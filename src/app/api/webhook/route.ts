/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { initializeStripe, initializeSupabase } from '@/lib/utils/utils';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = initializeStripe();
const supabaseAdmin = initializeSupabase();

export async function POST(req: NextRequest) {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    const sig = req.headers.get('stripe-signature')!;
    const body = await req.text();

    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    const handlers: Record<string, (object: any) => Promise<void>> = {
      'product.created': handleProductEvent,
      'product.updated': handleProductEvent,
      'product.deleted': handleProductDeletion,
      'price.created': handlePriceEvent,
      'price.updated': handlePriceEvent,
      'price.deleted': handlePriceDeletion,
      'customer.subscription.updated': handleSubscriptionEvent,
      'invoice.payment_succeeded': (object) => handleInvoiceEvent(object, 'active'),
      'invoice.payment_failed': (object) => handleInvoiceEvent(object, 'past_due'),
      'checkout.session.completed': handleCheckoutSession,
      'customer.updated': handleCustomerUpdate,
    };

    const handler = handlers[event.type];
    if (handler) {
      await handler(event.data.object);
    } else {
      console.warn(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Error processing webhook:', err);
    return NextResponse.json({ error: `Webhook processing failed: ${err.message}` }, { status: 500 });
  }
}

async function handleProductEvent(product: Stripe.Product) {
  const { error } = await supabaseAdmin.from('products').upsert({
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description,
    image: product.images?.[0],
    metadata: product.metadata,
  });
  if (error) throw new Error(`Failed to sync product: ${error.message}`);
}

async function handleProductDeletion(product: Stripe.Product) {
  const { error } = await supabaseAdmin.from('products').delete().match({ id: product.id });
  if (error) throw new Error(`Failed to delete product: ${error.message}`);
}

async function handlePriceEvent(price: Stripe.Price) {
  const { error } = await supabaseAdmin.from('prices').upsert({
    id: price.id,
    product_id: price.product as string,
    active: price.active,
    description: price.nickname,
    unit_amount: price.unit_amount,
    currency: price.currency,
    type: price.type,
    interval: price.recurring?.interval,
    interval_count: price.recurring?.interval_count,
    trial_period_days: price.recurring?.trial_period_days,
    metadata: price.metadata,
  });
  if (error) throw new Error(`Failed to sync price: ${error.message}`);
}

async function handlePriceDeletion(price: Stripe.Price) {
  const { error } = await supabaseAdmin.from('prices').delete().match({ id: price.id });
  if (error) throw new Error(`Failed to delete price: ${error.message}`);
}

async function handleSubscriptionEvent(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.user_id;
  if (!userId) {
    console.warn(`No user_id found for subscription ${subscription.id}. Skipping update.`);
    return;
  }
  const { error } = await supabaseAdmin.from('subscriptions').upsert({
    id: subscription.id,
    user_id: userId,
    status: subscription.status,
    price_id: subscription.items.data[0]?.price.id,
    quantity: subscription.items.data[0]?.quantity,
    cancel_at_period_end: subscription.cancel_at_period_end,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    created: new Date(subscription.created * 1000).toISOString(),
    canceled_at: subscription.canceled_at
      ? new Date(subscription.canceled_at * 1000).toISOString()
      : null,
    metadata: subscription.metadata,
  });
  if (error) throw new Error(`Failed to sync subscription: ${error.message}`);
}

async function handleInvoiceEvent(invoice: Stripe.Invoice, status: string) {
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({
      status,
      current_period_start: new Date(invoice.period_start * 1000).toISOString(),
      current_period_end: new Date(invoice.period_end * 1000).toISOString(),
    })
    .eq('id', invoice.subscription as string);
  if (error) throw new Error(`Failed to update invoice: ${error.message}`);
}

async function handleCheckoutSession(session: Stripe.Checkout.Session) {
  const subscriptionId = session.subscription as string;
  if (subscriptionId) {
    const userId = session.metadata?.user_id;
    if (!userId) {
      console.warn(`No user_id found for checkout session ${session.id}. Skipping metadata update.`);
      return;
    }

    await stripe.subscriptions.update(subscriptionId, {
      metadata: {
        user_id: userId,
      },
    });

    const updatedSubscription = await stripe.subscriptions.retrieve(subscriptionId);
    await handleSubscriptionEvent(updatedSubscription);
  }
}

async function handleCustomerUpdate(customer: Stripe.Customer) {
  const userId = customer.metadata.user_id;
  if (!userId) {
    console.warn(`No user_id found for customer ${customer.id}. Skipping update.`);
    return;
  }

  const { error } = await supabaseAdmin.from('users').upsert({
    id: userId,
    full_name: customer.name,
    avatar_url: customer.metadata.avatar_url,
    billing_address: JSON.stringify(customer.address),
    payment_method: JSON.stringify(customer.invoice_settings.default_payment_method),
  });
  if (error) throw new Error(`Failed to update user: ${error.message}`);
}

// async function getUserIdFromCustomer(customerId: string): Promise<string | null> {
//   try {
//     const customer = await stripe.customers.retrieve(customerId);
//     return customer.metadata.user_id ?? null;
//   } catch (error) {
//     console.error(`Failed to retrieve customer ${customerId}:`, error);
//     return null;
//   }
// }

