import { NextRequest, NextResponse } from 'next/server';
import { rotateRefreshToken } from '@/lib/server/auth';
import { logAudit } from '@/lib/server/audit';

export async function POST(req: NextRequest) {
  const oldToken = req.cookies.get('refreshToken')?.value;

  if (!oldToken) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
  }

  const result = await rotateRefreshToken(oldToken);

  if (!result) {
    await logAudit({
      action: 'auth.refresh', outcome: 'failure',
      ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
      severity: 'warn', details: { reason: 'invalid_or_reused_token' },
    });

    const response = NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    response.cookies.delete('refreshToken');
    response.cookies.delete('sessionToken');
    return response;
  }

  const response = NextResponse.json({ accessToken: result.accessToken });
  response.cookies.set('refreshToken', result.refreshToken, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', maxAge: 7 * 24 * 60 * 60, path: '/',
  });

  return response;
}
