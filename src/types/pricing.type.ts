import { Tables } from "types_db";

export type BillingInterval = "month" | "year" | "lifetime";
export type SubscriptionPlans = "For life" | "Premium" | null;
export type PurchaseType = "subscription" | "one_time";
export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "past_due"
  | "unpaid"
  | "paused";
export type Price = Tables<"prices">;
export type Product = Tables<"products">;
export type Subscription = Tables<"subscriptions">;
export type SubscriptionWithPriceAndProduct = Subscription & {
  prices:
    | (Price & {
        products: Product | null;
      })
    | null;
};
export interface SubscriptionWithProduct extends Tables<"subscriptions"> {
  products: Tables<"products">;
  prices: Tables<"prices"> & {
    products: Tables<"products">;
  };
}

export interface LifetimePurchaseWithProduct {
  id: string;
  user_id: string;
  price_id: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
  payment_intent_id: string;
  prices?: {
    products: Tables<"products">;
  };
}

export interface UserSubscriptionStatus {
  subscription: SubscriptionWithProduct | null;
  lifetimePurchase: LifetimePurchaseWithProduct | null;
  isSubscribed: boolean;
  hasLifetimePurchase: boolean;
  plan: SubscriptionPlans;
}

export type Invoice = {
  id: string;
  amount_paid: number;
  currency: string;
  status: string;
  created: number;
  invoice_pdf: string;
  invoice_url: string;
};
