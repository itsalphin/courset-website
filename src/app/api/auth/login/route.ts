import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/server/db';
import { verifyPassword, generateAccessToken, generateRefreshToken, createSession, isAccountLocked, recordFailedLogin, resetFailedLogins } from '@/lib/server/auth';
import { logAudit } from '@/lib/server/audit';
import { sendLoginAlertEmail } from '@/lib/server/email';
import { rateLimit } from '@/lib/rate-limit';

const LoginSchema = z.object({
  email: z.string().email().max(254).toLowerCase().trim(),
  password: z.string().min(1).max(128),
}).strict();

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const ua = req.headers.get('user-agent') || '';

  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    const { email, password } = parsed.data;

    // Rate limit: 5 per 15 min per IP+email
    const { allowed } = rateLimit(`login:${ip}:${email}`, 5, 900_000);
    if (!allowed) {
      await logAudit({ action: 'auth.login', outcome: 'blocked', ipAddress: ip, severity: 'warn', details: { email, reason: 'rate_limited' } });
      return NextResponse.json({ error: 'Too many login attempts. Please try again later.' }, { status: 429 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Don't reveal if email exists
    if (!user) {
      await logAudit({ action: 'auth.login', outcome: 'failure', ipAddress: ip, details: { reason: 'user_not_found' } });
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (isAccountLocked(user)) {
      await logAudit({ userId: user.id, action: 'auth.login', outcome: 'blocked', ipAddress: ip, severity: 'warn', details: { reason: 'account_locked' } });
      return NextResponse.json({ error: 'Account temporarily locked. Please try again later.' }, { status: 423 });
    }

    const valid = await verifyPassword(user.passwordHash, password);
    if (!valid) {
      const locked = await recordFailedLogin(email);
      await logAudit({ userId: user.id, action: 'auth.login', outcome: 'failure', ipAddress: ip, severity: 'warn', details: { reason: 'invalid_password', locked } });
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Success — reset failed logins
    await resetFailedLogins(user.id);

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), lastLoginIp: ip },
    });

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = await generateRefreshToken(user.id);
    const sessionToken = await createSession(user.id, ua, ip);

    await logAudit({ userId: user.id, action: 'auth.login', outcome: 'success', ipAddress: ip, userAgent: ua });

    // Send login alert if new IP
    if (user.lastLoginIp && user.lastLoginIp !== ip) {
      sendLoginAlertEmail(user.email, ip, ua).catch(() => {});
    }

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken,
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', maxAge: 7 * 24 * 60 * 60, path: '/',
    });
    response.cookies.set('sessionToken', sessionToken, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', maxAge: 8 * 60 * 60, path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'An error occurred.' }, { status: 500 });
  }
}
