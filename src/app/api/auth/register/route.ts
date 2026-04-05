import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/server/db';
import { hashPassword, generateAccessToken, generateRefreshToken, createSession } from '@/lib/server/auth';
import { logAudit } from '@/lib/server/audit';
import { rateLimit } from '@/lib/rate-limit';

const RegisterSchema = z.object({
  email: z.string().email().max(254).toLowerCase().trim(),
  password: z.string().min(12).max(128),
  name: z.string().min(1).max(100).trim(),
}).strict();

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';

  // Rate limit: 3 signups per hour per IP
  const { allowed } = rateLimit(`register:${ip}`, 3, 3600_000);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: parsed.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
      }, { status: 400 });
    }

    const { email, password, name } = parsed.data;

    // Check if user exists (don't reveal specifics)
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Unable to create account. Please try a different email.' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: { email, passwordHash, name },
    });

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = await generateRefreshToken(user.id);
    const sessionToken = await createSession(user.id, req.headers.get('user-agent') || '', ip);

    await logAudit({
      userId: user.id, action: 'auth.register', outcome: 'success',
      ipAddress: ip, userAgent: req.headers.get('user-agent') || '',
    });

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken,
    });

    // Set cookies
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
