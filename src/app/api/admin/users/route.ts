import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/server/auth';
import { hasPermission } from '@/lib/server/audit';
import { logAudit } from '@/lib/server/audit';
import { prisma } from '@/lib/server/db';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const payload = verifyAccessToken(authHeader.substring(7));
  if (!payload || !hasPermission(payload.role, 'users:read')) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }

  const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '20'), 100);

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true, email: true, name: true, role: true,
        emailVerified: true, mfaEnabled: true,
        createdAt: true, lastLoginAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count(),
  ]);

  await logAudit({
    userId: payload.sub, action: 'admin.users.list', outcome: 'success',
    ipAddress: req.headers.get('x-forwarded-for') || '',
  });

  return NextResponse.json({ users, total, page, limit });
}
