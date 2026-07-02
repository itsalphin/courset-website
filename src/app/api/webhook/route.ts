import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent } from '@/lib/server/stripe';
import { prisma } from '@/lib/server/db';
import { sendOrderConfirmationEmail } from '@/lib/server/email';
import { logAudit } from '@/lib/server/audit';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  try {
    const event = await constructWebhookEvent(body, signature);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        if (!userId) break;

        // Only fulfill once payment is actually captured. For card + mode:
        // 'payment' this is synchronously 'paid', but async methods can
        // complete the session as 'unpaid' — never mark those paid.
        if (session.payment_status !== 'paid') break;

        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, email: true },
        });
        if (!user) break;

        const totalCents = session.amount_total || 0;

        // Idempotent: Stripe retries webhooks on transient failures. Decide
        // "is this the first time we've seen this session?" from the DB BEFORE
        // writing, so the side effects (email, audit) fire exactly once. The
        // previous createdAt===updatedAt check re-fired on every retry because
        // the upsert's empty update never advanced updatedAt.
        const existing = await prisma.order.findUnique({
          where: { stripeSessionId: session.id },
          select: { id: true },
        });

        const order = existing ?? await prisma.order.create({
          data: {
            userId,
            status: 'paid',
            totalCents,
            stripeSessionId: session.id,
            stripePaymentId: session.payment_intent as string,
            shippingAddress: JSON.stringify((session as unknown as { shipping_details?: unknown }).shipping_details ?? null),
          },
        });

        if (!existing) {
          await logAudit({
            userId, action: 'order.paid', outcome: 'success',
            resource: order.id, details: { totalCents },
          });

          const total = `$${(totalCents / 100).toLocaleString()}`;
          await sendOrderConfirmationEmail(user.email, order.id, total);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const intent = event.data.object;
        await logAudit({
          action: 'payment.failed', outcome: 'failure',
          details: { paymentIntentId: intent.id, reason: intent.last_payment_error?.message },
          severity: 'warn',
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 });
  }
}
