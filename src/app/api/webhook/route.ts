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

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) break;

        const totalCents = session.amount_total || 0;

        const order = await prisma.order.create({
          data: {
            userId,
            status: 'paid',
            totalCents,
            stripeSessionId: session.id,
            stripePaymentId: session.payment_intent as string,
            shippingAddress: JSON.stringify((session as unknown as { shipping_details?: unknown }).shipping_details ?? null),
          },
        });

        await logAudit({
          userId, action: 'order.paid', outcome: 'success',
          resource: order.id, details: { totalCents },
        });

        const total = `$${(totalCents / 100).toLocaleString()}`;
        await sendOrderConfirmationEmail(user.email, order.id, total);
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
