import { NextRequest, NextResponse } from 'next/server';
import { rotateRefreshToken, verifyAccessToken } from '@/lib/server/auth';
import { logAudit } from '@/lib/server/audit';
import { getClientIp } from '@/lib/server/request';
import { prisma } from '@/lib/server/db';

export async function POST(req: NextRequest) {
  const oldToken = req.cookies.get('refreshToken')?.value;

  if (!oldToken) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
  }

  const result = await rotateRefreshToken(oldToken);

  if (!result) {
    await logAudit({
      action: 'auth.refresh', outcome: 'failure',
      ipAddress: getClientIp(req),
      severity: 'warn', details: { reason: 'invalid_or_reused_token' },
    });

    const response = NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    response.cookies.delete('refreshToken');
    response.cookies.delete('sessionToken');
    return response;
  }

  // Include the user so the client can rehydrate the auth context on reload
  // without a separate /me round-trip. The access token we just minted has
  // the userId in its sub claim — read it back rather than re-querying.
  const payload = verifyAccessToken(result.accessToken);
  const user = payload
    ? await prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true, name: true, role: true },
      })
    : null;

  const response = NextResponse.json({ accessToken: result.accessToken, user });
  response.cookies.set('refreshToken', result.refreshToken, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', maxAge: 7 * 24 * 60 * 60, path: '/',
  });

  return response;
}
