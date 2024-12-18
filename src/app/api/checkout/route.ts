/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { initializeStripe, initializeSupabase } from '@/lib/utils/utils';
import { NextRequest, NextResponse } from 'next/server';


const stripe = initializeStripe();
const supabaseAdmin = initializeSupabase();

export async function POST(req: NextRequest) {
  try {
    const { user_id, price_id } = await req.json();

    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(user_id);
    if (userError || !userData?.user) {
      console.error('User verification failed:', userError);
      return NextResponse.json({ error: 'User not found or unauthorized' }, { status: 401 });
    }

    const price = await stripe.prices.retrieve(price_id);
    if (!price.active) {
      return NextResponse.json({ error: 'Selected price is not active' }, { status: 400 });
    }

    // Ensure the customer exists in Stripe
    const existingCustomers = await stripe.customers.list({ email: userData.user.email });
    let customerId;

    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers?.data[0]?.id;
    } else {
      const newCustomer = await stripe.customers.create({ email: userData.user.email });
      customerId = newCustomer.id;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
      customer: customerId,
      metadata: { 
        user_id: user_id, // Ensure you're passing dynamic `user_id`
      },
    });
    

    return NextResponse.json({ sessionId: session.id, sessionUrl: session.url });
  } catch (err: any) {
    console.error('Checkout session creation error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session', details: err.message }, { status: 500 });
  }
}
