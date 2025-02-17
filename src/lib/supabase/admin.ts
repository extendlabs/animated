/* eslint-disable @typescript-eslint/ban-ts-comment */

import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";
import type { Database, Tables, TablesInsert } from "types_db";
import { stripe } from "../stripe/config";
import { toDateTime } from "../helpers";

type Product = Tables<"products">;
type Price = Tables<"prices">;

// Change to control trial period length
const TRIAL_PERIOD_DAYS = 0;

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
);

const createUserRecord = async (uuid: string) => {
  const { error: createError } = await supabaseAdmin.from("users").upsert([
    {
      id: uuid,
      full_name: null,
      avatar_url: null,
      billing_address: null,
      payment_method: null,
    },
  ]);

  if (createError) {
    console.error("Error creating user record:", createError);
    throw new Error(`User record creation failed: ${createError.message}`);
  }
};

const upsertProductRecord = async (product: Stripe.Product) => {
  const productData: Product = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    metadata: product.metadata,
  };

  const { error: upsertError } = await supabaseAdmin
    .from("products")
    .upsert([productData]);
  if (upsertError)
    throw new Error(`Product insert/update failed: ${upsertError.message}`);
  console.log(`Product inserted/updated: ${product.id}`);
};

const upsertPriceRecord = async (
  price: Stripe.Price,
  retryCount = 0,
  maxRetries = 3,
) => {
  const priceData = {
    id: price.id,
    product_id: typeof price.product === "string" ? price.product : "",
    active: price.active,
    currency: price.currency,
    type: price.type,
    unit_amount: price.unit_amount ?? null,
    interval: price.recurring?.interval ?? null,
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS,
  };

  const { error: upsertError } = await supabaseAdmin
    .from("prices")
    .upsert([priceData]);

  if (upsertError?.message.includes("foreign key constraint")) {
    if (retryCount < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await upsertPriceRecord(price, retryCount + 1, maxRetries);
    } else {
      throw new Error(
        `Price insert/update failed after ${maxRetries} retries: ${upsertError.message}`,
      );
    }
  } else if (upsertError) {
    throw new Error(`Price insert/update failed: ${upsertError.message}`);
  } else {
    console.log(`Price inserted/updated: ${price.id}`);
  }
};

const deleteProductRecord = async (product: Stripe.Product) => {
  const { error: deletionError } = await supabaseAdmin
    .from("products")
    .delete()
    .eq("id", product.id);
  if (deletionError)
    throw new Error(`Product deletion failed: ${deletionError.message}`);
  console.log(`Product deleted: ${product.id}`);
};

const deletePriceRecord = async (price: Stripe.Price) => {
  const { error: deletionError } = await supabaseAdmin
    .from("prices")
    .delete()
    .eq("id", price.id);
  if (deletionError)
    throw new Error(`Price deletion failed: ${deletionError.message}`);
  console.log(`Price deleted: ${price.id}`);
};

const upsertCustomerToSupabase = async (uuid: string, customerId: string) => {
  const { error: upsertError } = await supabaseAdmin
    .from("customers")
    .upsert([{ id: uuid, stripe_customer_id: customerId }]);

  if (upsertError)
    throw new Error(
      `Supabase customer record creation failed: ${upsertError.message}`,
    );

  return customerId;
};

const createCustomerInStripe = async (uuid: string, email: string) => {
  const customerData = { metadata: { supabaseUUID: uuid }, email: email };
  const newCustomer = await stripe.customers.create(customerData);
  if (!newCustomer) throw new Error("Stripe customer creation failed.");

  return newCustomer.id;
};

const createPortalSession = async (uuid: string) => {
  const { data: customer } = await supabaseAdmin
    .from("customers")
    .select("stripe_customer_id")
    .eq("id", uuid)
    .single();

  if (!customer?.stripe_customer_id) {
    throw new Error("Customer not found");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customer.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account`,
  });

  return session.url;
};

export const getUserInvoices = async (uuid: string) => {
  const { data: customer } = await supabaseAdmin
    .from("customers")
    .select("stripe_customer_id")
    .eq("id", uuid)
    .single();

  if (!customer?.stripe_customer_id) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Customer not found",
      }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    const invoices = await stripe.invoices.list({
      customer: customer.stripe_customer_id,
      limit: 12,
      expand: ["data.subscription"],
    });

    return new Response(
      JSON.stringify({
        success: true,
        invoices: invoices.data.map((invoice) => ({
          id: invoice.id,
          amount_paid: invoice.amount_paid,
          currency: invoice.currency,
          status: invoice.status,
          created: invoice.created,
          invoice_pdf: invoice.invoice_pdf,
          invoice_url: invoice.hosted_invoice_url,
        })),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (stripeError) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Error fetching invoices from Stripe",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};

export const deleteAccount = async (uuid: string) => {
  try {
    const [
      { data: customerData, error: customerError },
      { data: subscriptionData, error: subscriptionError },
      { data: lifetimePurchaseData, error: lifetimePurchaseError },
    ] = await Promise.all([
      supabaseAdmin
        .from("customers")
        .select("stripe_customer_id")
        .eq("id", uuid)
        .single(),
      supabaseAdmin
        .from("subscriptions")
        .select("id, status")
        .eq("user_id", uuid),
      supabaseAdmin.from("lifetime_purchases").select("id").eq("user_id", uuid),
    ]);

    if (
      subscriptionData?.some((sub) =>
        ["active", "trialing"].includes(sub.status as string),
      )
    ) {
      throw new Error(
        "Please cancel all active subscriptions before deleting your account",
      );
    }

    if (customerData?.stripe_customer_id) {
      try {
        await stripe.customers.del(customerData.stripe_customer_id);
      } catch (error: any) {
        console.error("Stripe customer deletion failed:", error.message);
      }
    }

    const deletionPromises = await Promise.allSettled([
      // Delete subscriptions first (foreign key constraint)
      supabaseAdmin.from("subscriptions").delete().eq("user_id", uuid),

      supabaseAdmin.from("lifetime_purchases").delete().eq("user_id", uuid),

      supabaseAdmin.from("customers").delete().eq("id", uuid),

      supabaseAdmin.from("users").delete().eq("id", uuid),

      supabaseAdmin.auth.admin.deleteUser(uuid),
    ]);

    const criticalFailures = deletionPromises.filter(
      (result) =>
        result.status === "rejected" &&
        result.reason?.message?.includes("foreign key constraint"),
    );

    if (criticalFailures.length > 0) {
      throw new Error(
        "Failed to delete some user data due to database constraints",
      );
    }

    // Log non-critical failures but continue
    const warnings = deletionPromises
      .filter((result) => result.status === "rejected")
      .map((result) => (result as PromiseRejectedResult).reason);

    if (warnings.length > 0) {
      console.warn("Non-critical deletion warnings:", warnings);
    }

    return {
      success: true,
      message: "Account deleted successfully",
    };
  } catch (error: any) {
    console.error("Account deletion error:", error);
    return {
      success: false,
      error: error.message || "Error deleting account",
    };
  }
};

const createOrRetrieveCustomer = async ({
  email,
  uuid,
}: {
  email: string;
  uuid: string;
}) => {
  const { data: existingUser } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("id", uuid)
    .single();

  if (!existingUser) {
    await createUserRecord(uuid);
  }

  const { data: existingSupabaseCustomer, error: queryError } =
    await supabaseAdmin
      .from("customers")
      .select("*")
      .eq("id", uuid)
      .maybeSingle();

  if (queryError) {
    throw new Error(`Supabase customer lookup failed: ${queryError.message}`);
  }

  let stripeCustomerId: string | undefined;
  if (existingSupabaseCustomer?.stripe_customer_id) {
    const existingStripeCustomer = await stripe.customers.retrieve(
      existingSupabaseCustomer.stripe_customer_id,
    );
    stripeCustomerId = existingStripeCustomer.id;
  } else {
    const stripeCustomers = await stripe.customers.list({ email: email });
    stripeCustomerId =
      stripeCustomers.data.length > 0 ? stripeCustomers.data[0]?.id : undefined;
  }

  const stripeIdToInsert = stripeCustomerId
    ? stripeCustomerId
    : await createCustomerInStripe(uuid, email);
  if (!stripeIdToInsert) throw new Error("Stripe customer creation failed.");

  if (existingSupabaseCustomer && stripeCustomerId) {
    // If Supabase has a record but doesn't match Stripe, update Supabase record
    if (existingSupabaseCustomer.stripe_customer_id !== stripeCustomerId) {
      const { error: updateError } = await supabaseAdmin
        .from("customers")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("id", uuid);

      if (updateError)
        throw new Error(
          `Supabase customer record update failed: ${updateError.message}`,
        );
      console.warn(
        `Supabase customer record mismatched Stripe ID. Supabase record updated.`,
      );
    }
    return stripeCustomerId;
  } else {
    console.warn(
      `Supabase customer record was missing. A new record was created.`,
    );
    const upsertedStripeCustomer = await upsertCustomerToSupabase(
      uuid,
      stripeIdToInsert,
    );
    if (!upsertedStripeCustomer)
      throw new Error("Supabase customer record creation failed.");

    return upsertedStripeCustomer;
  }
};

export const upsertCustomerRecord = async (customer: Stripe.Customer) => {
  const customerData = {
    id: customer.metadata.supabaseUUID || "",
    stripe_customer_id: customer.id,
    email: customer.email,
    name: customer.name,
    metadata: customer.metadata,
  };

  const { error: upsertError } = await supabaseAdmin
    .from("customers")
    .upsert([customerData]);

  if (upsertError)
    throw new Error(`Customer insert/update failed: ${upsertError.message}`);
  console.log(`Customer inserted/updated: ${customer.id}`);
};

export const deleteCustomerRecord = async (customer: Stripe.Customer) => {
  const { data: customerData, error: lookupError } = await supabaseAdmin
    .from("customers")
    .select("id")
    .eq("stripe_customer_id", customer.id)
    .single();

  if (lookupError)
    throw new Error(`Customer lookup failed: ${lookupError.message}`);

  // Then delete the customer record
  const { error: deletionError } = await supabaseAdmin
    .from("customers")
    .delete()
    .eq("id", customerData.id);

  if (deletionError)
    throw new Error(`Customer deletion failed: ${deletionError.message}`);

  console.log(`Customer deleted: ${customer.id}`);
};

const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod,
) => {
  const customer = payment_method.customer as string;
  const { name, phone, address } = payment_method.billing_details;
  if (!name || !phone || !address) return;
  //@ts-ignore
  await stripe.customers.update(customer, { name, phone, address });
  const { error: updateError } = await supabaseAdmin
    .from("users")
    .update({
      billing_address: { ...address },
      payment_method: { ...payment_method[payment_method.type] },
    })
    .eq("id", uuid);
  if (updateError)
    throw new Error(`Customer update failed: ${updateError.message}`);
};

const retriveCustomerId = async (uuid: string) => {
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from("customers")
    .select("stripe_customer_id")
    .eq("id", uuid)
    .single();
  if (noCustomerError)
    throw new Error(`Customer lookup failed: ${noCustomerError.message}`);
  return customerData;
};

// Add to your exports at the bottom of the file
export async function resumeUserSubscription(subscriptionId: string): Promise<{
  success: boolean;
  message: string;
  subscription?: any;
}> {
  try {
    const {
      data: { user },
    } = await supabaseAdmin.auth.getUser();

    if (!user) {
      throw new Error("User not found");
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const customerData = await retriveCustomerId(user.id);

    if (!customerData) {
      throw new Error("Stripe customer ID not found for the current user");
    }

    const stripeCustomerId = customerData.stripe_customer_id;

    if (subscription.customer !== stripeCustomerId) {
      throw new Error("Subscription does not belong to the current user");
    }

    // Simply remove the cancellation schedule
    const resumedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        cancel_at_period_end: false,
      },
    );

    if (!resumedSubscription.cancel_at_period_end) {
      // Get the updated subscription data for the frontend
      const { data: updatedSubscription } = await supabaseAdmin
        .from("subscriptions")
        .select(
          `
          *,
          prices (
            *,
            products (*)
          )
        `,
        )
        .eq("id", subscriptionId)
        .single();

      return {
        success: true,
        message: "Subscription successfully resumed",
        subscription: updatedSubscription,
      };
    } else {
      throw new Error("Failed to resume subscription");
    }
  } catch (error) {
    console.error("Error resuming subscription:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false,
) => {
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from("customers")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (noCustomerError)
    throw new Error(`Customer lookup failed: ${noCustomerError.message}`);

  const { id: uuid } = customerData;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"],
  });

  const subscriptionData: TablesInsert<"subscriptions"> = {
    id: subscription.id,
    user_id: uuid,
    metadata: subscription.metadata,
    status: subscription.status,
    price_id: subscription.items.data[0]?.price.id,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at
      ? toDateTime(subscription.cancel_at).toISOString()
      : null,
    canceled_at: subscription.canceled_at
      ? toDateTime(subscription.canceled_at).toISOString()
      : null,
    current_period_start: toDateTime(
      subscription.current_period_start,
    ).toISOString(),
    current_period_end: toDateTime(
      subscription.current_period_end,
    ).toISOString(),
    created: toDateTime(subscription.created).toISOString(),
    ended_at: subscription.ended_at
      ? toDateTime(subscription.ended_at).toISOString()
      : null,
    trial_start: subscription.trial_start
      ? toDateTime(subscription.trial_start).toISOString()
      : null,
    trial_end: subscription.trial_end
      ? toDateTime(subscription.trial_end).toISOString()
      : null,
  };

  const { error: upsertError } = await supabaseAdmin
    .from("subscriptions")
    .upsert([subscriptionData]);

  if (upsertError)
    throw new Error(
      `Subscription insert/update failed: ${upsertError.message}`,
    );

  if (createAction && subscription.default_payment_method && uuid)
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod,
    );
};
export async function manageLifetimePurchase(
  checkoutSession: Stripe.Checkout.Session,
  paymentIntent: Stripe.PaymentIntent,
) {
  const userId = checkoutSession.client_reference_id;

  if (!userId) {
    throw new Error("No client_reference_id found in checkout session");
  }

  try {
    const { error } = await supabaseAdmin.from("lifetime_purchases").upsert({
      user_id: userId,
      price_id: paymentIntent.metadata.price_id || null,
      payment_intent_id: paymentIntent.id || null,
      amount: paymentIntent.amount,
      status: "completed",
      metadata: paymentIntent.metadata || null, // Required field of type Json
    });

    if (error) {
      console.error("Lifetime purchase insert/update failed:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error managing lifetime purchase:", error);
    throw error;
  }
}

export const checkPurchaseStatus = async (userId: string) => {
  const [subscription, lifetimePurchase] = await Promise.all([
    supabaseAdmin
      .from("subscriptions")
      .select("status")
      .eq("user_id", userId)
      .eq("status", "active")
      .single(),
    (supabaseAdmin as any)
      .from("lifetime_purchases")
      .select("status")
      .eq("user_id", userId)
      .eq("status", "completed")
      .single(),
  ]);

  return {
    hasActiveSubscription: Boolean(subscription.data),
    hasLifetimePurchase: Boolean(lifetimePurchase.data),
  };
};

export {
  upsertProductRecord,
  upsertPriceRecord,
  deleteProductRecord,
  deletePriceRecord,
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange,
  retriveCustomerId,
  createPortalSession,
};
