import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAccessToken } from '@/lib/server/auth';
import { hasPermission, isIPBlocked, logAudit } from '@/lib/server/audit';
import { getClientIp } from '@/lib/server/request';
import { rateLimit } from '@/lib/rate-limit';
import { prisma } from '@/lib/server/db';

const QuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export async function GET(req: NextRequest) {
  // WAF
  const ip = getClientIp(req);
  if (await isIPBlocked(ip)) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }
  if (req.nextUrl.toString().includes('%00')) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  // Rate limit (30 read / minute / IP — brake-pad protection)
  const { allowed } = rateLimit(`admin:users:${ip}`, 30, 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  }

  // Auth
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  const payload = verifyAccessToken(authHeader.substring(7));
  if (!payload || !hasPermission(payload.role, 'users:read')) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }

  // Validate query params — guards against ?page=abc → NaN skip
  const parsed = QuerySchema.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
  }
  const { page, limit } = parsed.data;

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
    ipAddress: ip,
  });

  return NextResponse.json({ users, total, page, limit });
}
