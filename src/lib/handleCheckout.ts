'use client';

import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default async function handleCheckout(priceId: string, userId: string) {
  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        price_id: priceId,
        user_id: userId,
      }),
    });

    const { sessionUrl } = await response.json();

    const stripe = await stripePromise;

    if (sessionUrl) {
      window.location.href = sessionUrl; // Redirect to Stripe Checkout
    }
  } catch (error) {
    console.error('Error creating Stripe Checkout session:', error);
  }
}
