// useAuthStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  SubscriptionPlans,
  UserSubscriptionStatus,
} from "@/types/pricing.type";

type AuthState = {
  subscription: any;
  purchase: any;
  plan: any;
  subscriptionStatus: any;
};

type AuthActions = {
  setSubscription: (subscription: any) => void;
  setPurchase: (purchase: any) => void;
  setPlan: (plan: any) => void;
};

export const useAuthStore = create(
  immer<AuthState & AuthActions>((set) => ({
    subscription: null,
    purchase: null,
    plan: null,
    subscriptionStatus: null,

    setSubscription: (subscription) =>
      set((state) => {
        state.subscription = subscription;
        if (subscription) {
          state.plan = subscription.prices.products.name as SubscriptionPlans;
        } else if (!state.purchase) {
          state.plan = null;
        }

        // Update subscription status
        state.subscriptionStatus = {
          subscription: state.subscription,
          lifetimePurchase: state.purchase,
          isSubscribed: Boolean(state.subscription?.status === "active"),
          hasLifetimePurchase: Boolean(state.purchase?.status === "completed"),
          plan: state.plan,
        };
      }),

    setPurchase: (purchase) =>
      set((state) => {
        state.purchase = purchase;
        if (purchase) {
          state.plan = purchase.prices.products.name as SubscriptionPlans;
        } else if (!state.subscription) {
          state.plan = null;
        }

        // Update subscription status
        state.subscriptionStatus = {
          subscription: state.subscription,
          lifetimePurchase: state.purchase,
          isSubscribed: Boolean(state.subscription?.status === "active"),
          hasLifetimePurchase: Boolean(state.purchase?.status === "completed"),
          plan: state.plan,
        };
      }),

    setPlan: (plan) =>
      set((state) => {
        state.plan = plan;
        state.subscriptionStatus = {
          ...state.subscriptionStatus,
          plan,
        } as UserSubscriptionStatus;
      }),
  })),
);

export const { setSubscription, setPurchase, setPlan } =
  useAuthStore.getState();
