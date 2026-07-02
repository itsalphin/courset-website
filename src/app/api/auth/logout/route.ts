import { NextRequest, NextResponse } from 'next/server';
import { invalidateSession, revokeRefreshToken } from '@/lib/server/auth';
import { logAudit } from '@/lib/server/audit';
import { getClientIp } from '@/lib/server/request';

export async function POST(req: NextRequest) {
  const sessionToken = req.cookies.get('sessionToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  if (sessionToken) {
    await invalidateSession(sessionToken);
  }
  // Clearing the cookie only drops the browser's copy — revoke the DB row too,
  // so a token captured before logout can't be replayed for its 7-day life.
  if (refreshToken) {
    await revokeRefreshToken(refreshToken);
  }

  await logAudit({
    action: 'auth.logout', outcome: 'success',
    ipAddress: getClientIp(req),
  });

  const response = NextResponse.json({ success: true });
  response.cookies.delete('refreshToken');
  response.cookies.delete('sessionToken');
  return response;
}
