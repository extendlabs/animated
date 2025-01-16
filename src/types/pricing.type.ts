import { type Tables } from "types_db";

export type BillingInterval = "lifetime" | "year" | "month";
export type Subscription = Tables<"subscriptions">;
export type Product = Tables<"products">;
export type Price = Tables<"prices">;
export type SubscriptionPlans = "Premium" | "Hobby" | null;
export interface ProductWithPrices extends Product {
  prices: Price[];
}
export interface PriceWithProduct extends Price {
  products: Product | null;
}
export interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}