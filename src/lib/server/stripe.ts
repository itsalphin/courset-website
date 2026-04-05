import Stripe from 'stripe';

let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
    _stripe = new Stripe(key, { apiVersion: '2025-03-31.basil' });
  }
  return _stripe;
}

interface CheckoutItem {
  name: string;
  priceInCents: number;
  quantity: number;
  productId: string;
  customization?: string;
}

export async function createCheckoutSession(
  items: CheckoutItem[],
  userId: string,
  customerEmail: string,
): Promise<string> {
  const session = await getStripe().checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: customerEmail,
    metadata: { userId },
    line_items: items.map((item) => ({
      price_data: {
        currency: 'usd',
        unit_amount: item.priceInCents,
        product_data: {
          name: item.name,
          metadata: {
            productId: item.productId,
            customization: item.customization || '',
          },
        },
      },
      quantity: item.quantity,
    })),
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/order/cancelled`,
    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'GB', 'AU'],
    },
  });

  return session.url || '';
}

export async function constructWebhookEvent(
  body: string,
  signature: string,
): Promise<Stripe.Event> {
  return getStripe().webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET || '',
  );
}
