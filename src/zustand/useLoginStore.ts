import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type LoginState = {
  isDialogOpen: boolean;
};

type LoginActions = {
  setIsDialogOpen: (open: boolean) => void;
};

export const useLoginStore = create(
  immer<LoginState & LoginActions>((set) => ({
    isDialogOpen: false,
    setIsDialogOpen: (open) => set({ isDialogOpen: open }),
  })),
);

export const { setIsDialogOpen } = useLoginStore.getState();
