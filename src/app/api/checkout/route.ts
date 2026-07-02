import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAccessToken } from '@/lib/server/auth';
import { createCheckoutSession } from '@/lib/server/stripe';
import { prisma } from '@/lib/server/db';
import { logAudit } from '@/lib/server/audit';
import { rateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/server/request';
import { resolvePriceCents } from '@/lib/server/price';

// Note: priceInCents from the client is REFERENCE ONLY — the server recomputes
// every line item's price via resolvePriceCents() before billing. Without that,
// anyone could `POST {productId, priceInCents: 1}` and Stripe would accept it.
const CheckoutSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1).max(200),
    name: z.string().min(1).max(200),
    priceInCents: z.number().int().nonnegative().max(10_000_000), // reference only — see above
    quantity: z.number().int().positive().max(10),
    customization: z.string().max(2000).optional(),
  })).min(1).max(20),
}).strict();

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { allowed } = await rateLimit(`checkout:${ip}`, 5, 60_000);
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

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Recompute every price server-side. Any unknown product id is rejected.
    const sanitizedItems: { productId: string; name: string; priceInCents: number; quantity: number; customization?: string }[] = [];
    for (const item of parsed.data.items) {
      const canonical = resolvePriceCents(item.productId);
      if (canonical === null) {
        await logAudit({
          userId: user.id, action: 'checkout.create', outcome: 'failure',
          ipAddress: ip, severity: 'warn',
          details: { reason: 'unknown_product', productId: item.productId },
        });
        return NextResponse.json({ error: `Unknown product: ${item.productId}` }, { status: 400 });
      }
      // Surface client/server price drift in the audit log — useful for detecting
      // stale UI or potential tampering — but always bill the server price.
      if (canonical !== item.priceInCents) {
        await logAudit({
          userId: user.id, action: 'checkout.create', outcome: 'success',
          ipAddress: ip, severity: 'info',
          details: { reason: 'price_recomputed', productId: item.productId, clientPriceCents: item.priceInCents, serverPriceCents: canonical },
        });
      }
      sanitizedItems.push({
        productId: item.productId,
        name: item.name,
        priceInCents: canonical,
        quantity: item.quantity,
        customization: item.customization,
      });
    }

    const url = await createCheckoutSession(sanitizedItems, user.id, user.email);

    await logAudit({
      userId: user.id, action: 'checkout.create', outcome: 'success',
      ipAddress: ip, details: { itemCount: sanitizedItems.length },
    });

    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: 'An error occurred.' }, { status: 500 });
  }
}
