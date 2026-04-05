import { NextRequest, NextResponse } from 'next/server';
import { invalidateSession } from '@/lib/server/auth';
import { logAudit } from '@/lib/server/audit';

export async function POST(req: NextRequest) {
  const sessionToken = req.cookies.get('sessionToken')?.value;

  if (sessionToken) {
    await invalidateSession(sessionToken);
  }

  await logAudit({
    action: 'auth.logout', outcome: 'success',
    ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
  });

  const response = NextResponse.json({ success: true });
  response.cookies.delete('refreshToken');
  response.cookies.delete('sessionToken');
  return response;
}
