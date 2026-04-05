import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/server/auth';
import { hasPermission, logAudit } from '@/lib/server/audit';
import { prisma } from '@/lib/server/db';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const payload = verifyAccessToken(authHeader.substring(7));
  if (!payload || !hasPermission(payload.role, 'orders:read')) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }

  const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '20'), 100);
  const status = req.nextUrl.searchParams.get('status');

  const where = status ? { status } : {};

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { select: { id: true, email: true, name: true } },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.count({ where }),
  ]);

  await logAudit({
    userId: payload.sub, action: 'admin.orders.list', outcome: 'success',
    ipAddress: req.headers.get('x-forwarded-for') || '',
  });

  return NextResponse.json({ orders, total, page, limit });
}
