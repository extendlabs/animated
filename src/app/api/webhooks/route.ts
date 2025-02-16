import type Stripe from "stripe";
import {
  upsertProductRecord,
  upsertPriceRecord,
  manageSubscriptionStatusChange,
  deleteProductRecord,
  deletePriceRecord,
  upsertCustomerRecord,
  deleteCustomerRecord,
  manageLifetimePurchase,
} from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe/config";

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "product.deleted",
  "price.created",
  "price.updated",
  "price.deleted",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.paid",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
  "invoice.upcoming",
  "invoice.created",
  "invoice.finalized",
  "invoice.updated",
  "payment_intent.succeeded",
  "payment_intent.created",
  "payment_intent.payment_failed",
  "payment_method.attached",
  "charge.succeeded",
  "customer.created",
  "customer.updated",
  "customer.deleted"
]);

async function handlePaymentIntentSuccess(paymentIntent: Stripe.PaymentIntent) {
  if (paymentIntent.metadata?.purchaseType === 'lifetime') {
    const sessions = await stripe.checkout.sessions.list({
      payment_intent: paymentIntent.id
    });
    const session = sessions.data[0];
    
    if (session) {
      await manageLifetimePurchase(session, paymentIntent);
    }
  } else if (paymentIntent.invoice) {
    const invoice = await stripe.invoices.retrieve(paymentIntent.invoice as string);
    if (invoice.subscription) {
      await manageSubscriptionStatusChange(
        invoice.subscription as string,
        invoice.customer as string,
        false
      );
    }
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  switch (session.mode) {
    case "subscription":
      const subscriptionId = session.subscription;
      await manageSubscriptionStatusChange(
        subscriptionId as string,
        session.customer as string,
        true
      );
      break;
    
    case "payment":
      const paymentIntent = await stripe.paymentIntents.retrieve(
        session.payment_intent as string
      );
      
      if (paymentIntent.metadata?.purchaseType === 'lifetime') {
        await manageLifetimePurchase(session, paymentIntent);
      } 
      break;
  }
}

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      console.error("Webhook secret not found.");
      return new Response("Webhook secret not found.", { status: 400 });
    }
    
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log(`🔔 Webhook received: ${event.type}`);
  } catch (err: any) {
    console.error(`❌ Error message: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "product.created":
        case "product.updated":
          await upsertProductRecord(event.data.object as Stripe.Product);
          break;
          
        case "product.deleted":
          await deleteProductRecord(event.data.object as Stripe.Product);
          break;
          
        case "price.created":
        case "price.updated":
          await upsertPriceRecord(event.data.object as Stripe.Price);
          break;
          
        case "price.deleted":
          await deletePriceRecord(event.data.object as Stripe.Price);
          break;

        case "invoice.payment_succeeded":
        case "invoice.paid":
          const invoice = event.data.object as Stripe.Invoice;
          if (invoice.subscription) {
            await manageSubscriptionStatusChange(
              invoice.subscription as string,
              invoice.customer as string,
              false
            );
          }
          break;

        case "invoice.payment_failed":
          const failedInvoice = event.data.object as Stripe.Invoice;
          if (failedInvoice.subscription) {
            await manageSubscriptionStatusChange(
              failedInvoice.subscription as string,
              failedInvoice.customer as string,
              false
            );
          }
          break;

        case "payment_intent.succeeded":
          await handlePaymentIntentSuccess(event.data.object as Stripe.PaymentIntent);
          break;

        case "payment_intent.created":
        case "payment_intent.payment_failed":
          const pi = event.data.object as Stripe.PaymentIntent;
          if (pi.invoice) {
            const invoice = await stripe.invoices.retrieve(pi.invoice as string);
            if (invoice.subscription) {
              await manageSubscriptionStatusChange(
                invoice.subscription as string,
                invoice.customer as string,
                false
              );
            }
          }
          break;

        case "customer.created":
        case "customer.updated":
          await upsertCustomerRecord(event.data.object as Stripe.Customer);
          break;
        
        case "customer.deleted":
          await deleteCustomerRecord(event.data.object as Stripe.Customer);
          break;

        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = event.data.object as Stripe.Subscription;
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            event.type === "customer.subscription.created"
          );
          break;

        case "checkout.session.completed":
          await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
          break;

        default:
          console.warn(`Unhandled relevant event type: ${event.type}`);
      }
    } catch (error: any) {
      console.error(`Webhook error: ${error.message}`);
      return new Response(
        "Webhook handler failed. View your Next.js function logs.",
        { status: 400 }
      );
    }
  } else {
    return new Response(`Unsupported event type: ${event.type}`, { status: 400 });
  }

  return new Response(JSON.stringify({ received: true }));
}