import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/server/db';
import { createPasswordResetToken, validatePasswordResetToken, hashPassword, invalidateAllSessions } from '@/lib/server/auth';
import { sendPasswordResetEmail } from '@/lib/server/email';
import { logAudit } from '@/lib/server/audit';
import { rateLimit } from '@/lib/rate-limit';

const RequestSchema = z.object({ email: z.string().email().toLowerCase().trim() }).strict();
const ResetSchema = z.object({ token: z.string().min(1), password: z.string().min(12).max(128) }).strict();

// POST /api/auth/reset-password — request a reset
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const { allowed } = rateLimit(`reset:${ip}`, 3, 3600_000);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const { email } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success (don't reveal if email exists)
    if (user) {
      const token = await createPasswordResetToken(email);
      await sendPasswordResetEmail(email, token);
      await logAudit({ userId: user.id, action: 'auth.password_reset_request', outcome: 'success', ipAddress: ip });
    }

    return NextResponse.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch {
    return NextResponse.json({ error: 'An error occurred.' }, { status: 500 });
  }
}

// PUT /api/auth/reset-password — execute the reset
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ResetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const email = await validatePasswordResetToken(parsed.data.token);
    if (!email) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    const passwordHash = await hashPassword(parsed.data.password);
    const user = await prisma.user.update({
      where: { email },
      data: { passwordHash, failedLogins: 0, lockedUntil: null },
    });

    // Invalidate all sessions on password change
    await invalidateAllSessions(user.id);

    await logAudit({ userId: user.id, action: 'auth.password_reset', outcome: 'success', ipAddress: req.headers.get('x-forwarded-for') || '' });

    return NextResponse.json({ message: 'Password has been reset. Please log in.' });
  } catch {
    return NextResponse.json({ error: 'An error occurred.' }, { status: 500 });
  }
}
