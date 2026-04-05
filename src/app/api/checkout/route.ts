import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAccessToken } from '@/lib/server/auth';
import { createCheckoutSession } from '@/lib/server/stripe';
import { prisma } from '@/lib/server/db';
import { logAudit } from '@/lib/server/audit';
import { rateLimit } from '@/lib/rate-limit';

const CheckoutSchema = z.object({
  items: z.array(z.object({
    productId: z.string().max(50),
    name: z.string().max(200),
    priceInCents: z.number().int().positive().max(10_000_000),
    quantity: z.number().int().positive().max(10),
    customization: z.string().max(2000).optional(),
  })).min(1).max(20),
}).strict();

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const { allowed } = rateLimit(`checkout:${ip}`, 5, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }

  // Auth required
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const payload = verifyAccessToken(authHeader.substring(7));
  if (!payload) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = CheckoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid checkout data' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const url = await createCheckoutSession(parsed.data.items, user.id, user.email);

    await logAudit({
      userId: user.id, action: 'checkout.create', outcome: 'success',
      ipAddress: ip, details: { itemCount: parsed.data.items.length },
    });

    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: 'An error occurred.' }, { status: 500 });
  }
}
