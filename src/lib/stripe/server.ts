"use server";

import type Stripe from "stripe";
import { type Tables } from "types_db";
import { createClient } from "../supabase/server";
import {
  calculateTrialEndUnixTimestamp,
  getErrorRedirect,
  getURL,
} from "../helpers";
import { stripe } from "./config";
import { createOrRetrieveCustomer, createPortalSession, deleteAccount, retriveCustomerId } from "../supabase/admin";

type Price = Tables<"prices">;

type CheckoutResponse = {
  errorRedirect?: string;
  sessionId?: string;
};

export async function checkoutWithStripe(
  price: Price,
  redirectPath = "/account",
): Promise<CheckoutResponse> {
  try {
    const supabase = await createClient();
    const {
      error,
      data: { user },
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error(error);
      throw new Error("Could not get user session.");
    }

    // Check if user already has lifetime access
    const { data: lifetimePurchase } = await supabase
      .from('lifetime_purchases')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .single();

    if (lifetimePurchase) {
      throw new Error("You already have lifetime access to this product.");
    }

    // For subscriptions, check if user already has an active one
    if (price.type === 'recurring') {
      const { data: activeSubscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (activeSubscription) {
        throw new Error("You already have an active subscription.");
      }
    }

    let customer: string;
    try {
      customer = await createOrRetrieveCustomer({
        uuid: user?.id || "",
        email: user?.email ?? "",
      });
    } catch (err) {
      console.error(err);
      throw new Error("Unable to access customer record.");
    }

    let params: Stripe.Checkout.SessionCreateParams = {
      allow_promotion_codes: true,
      billing_address_collection: "required",
      customer,
      locale: "auto", // Automatically detect customer's language
      
      // Tax Configuration
      automatic_tax: { 
        enabled: true,
      },
    

      // Customer Data Collection
      customer_update: {
        address: "auto",
        name: "auto"
      },

      // Tax ID Collection
      tax_id_collection: {
        enabled: true
      },


      line_items: [
        {
          price: price.id,
          quantity: 1
        },
      ],

      // URLs
      cancel_url: `${getURL()}/checkout/cancel`,
      success_url: `${getURL()}${redirectPath}?session_id={CHECKOUT_SESSION_ID}`,
      client_reference_id: user.id,
    };

    if (price.type === "recurring") {
      params = {
        ...params,
        mode: "subscription",
        subscription_data: {
          trial_settings: {
            end_behavior: {
              missing_payment_method: 'cancel'
            }
          },
        },
        payment_method_collection: 'always'
      };
    } else if (price.type === "one_time") {
      params = {
        ...params,
         // Invoice Configuration
      invoice_creation: {
        enabled: true,
      },
        mode: "payment",
        metadata: {
          purchaseType: 'lifetime',
          price_id: price.id,
        },
        payment_intent_data: {
          metadata: {
            purchaseType: 'lifetime',
            price_id: price.id,
          },
          setup_future_usage: 'off_session',
          capture_method: 'automatic'
        }
      };
    }

    const session = await stripe.checkout.sessions.create(params);

    if (session) {
      return { sessionId: session.id };
    } else {
      throw new Error("Unable to create checkout session.");
    }
  } catch (error) {
    console.error('Checkout error:', error);
    return {
      errorRedirect: getErrorRedirect(
        redirectPath,
        error instanceof Error ? error.message : "An unknown error occurred",
        "Please try again later or contact support.",
      ),
    };
  }
}

export async function createStripePortal(currentPath: string) {
  try {
    const supabase = await createClient();
    const {
      error,
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      if (error) {
        console.error(error);
      }
      throw new Error("Could not get user session.");
    }

    let customer;
    try {
      customer = await createOrRetrieveCustomer({
        uuid: user.id || "",
        email: user.email ?? "",
      });
    } catch (err) {
      console.error(err);
      throw new Error("Unable to access customer record.");
    }

    if (!customer) {
      throw new Error("Could not get customer.");
    }

    try {
      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: getURL("/account"),
      });
      if (!url) {
        throw new Error("Could not create billing portal");
      }
      return url;
    } catch (err) {
      console.error(err);
      throw new Error("Could not create billing portal");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return getErrorRedirect(
        currentPath,
        error.message,
        "Please try again later or contact a system administrator.",
      );
    } else {
      return getErrorRedirect(
        currentPath,
        "An unknown error occurred.",
        "Please try again later or contact a system administrator.",
      );
    }
  }
}

export async function cancelStripeSubscription(
  subscriptionId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

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

    // Instead of immediate cancellation, schedule it for the end of the period
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    });

    if (updatedSubscription.cancel_at_period_end) {
      return { success: true, message: "Subscription scheduled for cancellation at the end of the billing period" };
    } else {
      throw new Error("Failed to schedule subscription cancellation");
    }
  } catch (error) {
    console.error("Error scheduling subscription cancellation:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function redirectToCustomerPortalsubscriptionId(
  subscriptionId: string,
) {
  try {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found");
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const customerData = await retriveCustomerId(user.id);

  const stripeCustomerId = customerData.stripe_customer_id;

    if (subscription.customer !== stripeCustomerId) {
      throw new Error("Subscription does not belong to the current user");
    }

    const response = await createPortalSession(user.id);

    return {
      success: true,
      message: "Redirecting to customer portal",
      path: response
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      path: null
    };
  }
}



export async function resumeUserSubscription(
  subscriptionId: string
): Promise<{ 
  success: boolean; 
  message: string;
  subscription?: any;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

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
    const resumedSubscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false
    });

    if (!resumedSubscription.cancel_at_period_end) {
      // Get the updated subscription data for the frontend
      const { data: updatedSubscription } = await supabase
        .from("subscriptions")
        .select(`
          *,
          prices (
            *,
            products (*)
          )
        `)
        .eq("id", subscriptionId)
        .single();

      return { 
        success: true, 
        message: "Subscription successfully resumed",
        subscription: updatedSubscription
      };
    } else {
      throw new Error("Failed to resume subscription");
    }
  } catch (error) {
    console.error("Error resuming subscription:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}



export async function deleteUserAccount(): Promise<{ 
  success: boolean; 
  message: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError) {
      throw new Error("Failed to get user: " + userError.message);
    }

    if (!user) {
      throw new Error("User not found");
    }

    // Wait for deleteAccount to complete and get its result
    const result = await deleteAccount(user.id);

    // If deleteAccount failed, propagate its error
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete account');
    }

    // Sign out the user after successful deletion
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      console.error('Error signing out:', signOutError);
      // We don't throw here as the account was successfully deleted
    }

    return {
      success: true,
      message: 'Account successfully deleted'
    };
    
  } catch (error) {
    console.error('Error in deleteAccount:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error deleting account'
    };
  }
}