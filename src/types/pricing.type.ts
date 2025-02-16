// types/pricing.type.ts
import { Tables } from "types_db";

export type BillingInterval = 'month' | 'year' | 'lifetime';
export type SubscriptionPlans = 'Hobby' | 'Premium' | null;
export type PurchaseType = 'subscription' | 'one_time';
export type SubscriptionStatus = 'trialing' | 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'unpaid' | 'paused';

export interface SubscriptionWithProduct extends Tables<'subscriptions'> {
  products: any;
  prices: Tables<'prices'> & {
    products: Tables<'products'>;
  };
}

export interface LifetimePurchaseWithProduct {
  id: string;
  user_id: string;
  price_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
  payment_intent_id: string;
  prices?: {
    products: Tables<'products'>;
  };
}

export interface UserSubscriptionStatus {
  subscription: SubscriptionWithProduct | null;
  lifetimePurchase: LifetimePurchaseWithProduct | null;
  isSubscribed: boolean;
  hasLifetimePurchase: boolean;
  plan: SubscriptionPlans;
}