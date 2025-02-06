import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type SubscriptionPlans = "Hobby" | "Premium" | null;

type AuthState = {
  subscription: SubscriptionPlans;
};

type AuthActions = {
  setSubscription: (subscription: SubscriptionPlans) => void;
};

export const useAuthStore = create(
  immer<AuthState & AuthActions>((set) => ({
    subscription: null,
    setSubscription: (subscription) => set({ subscription }),
  })),
);

export const { setSubscription } = useAuthStore.getState();
