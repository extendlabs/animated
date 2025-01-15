import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type AuthState = {
    subscribed: boolean;
};

type AuthActions = {
  setSubscribed: (subscribed: boolean) => void;
};

export const useAuthStore = create(
  immer<AuthState & AuthActions>((set) => ({
    subscribed: false,
    setSubscribed: (open) => set({ subscribed: open }),
  }),
));

export const {
    setSubscribed,
} = useAuthStore.getState();
