import { create } from "zustand";
import { persist } from "zustand/middleware";

type SettingsStoreTypes = {
  background: string;
  padding: string;
  radius: string;
  language: string;
  fileName: string;
};

type SettingsStoreActions = {
  setBackground: (background: string) => void;
  setPadding: (padding: string) => void;
  setRadius: (radius: string) => void;
  setLanguage: (language: string) => void;
  setFileName: (fileName: string) => void;
};

export const useSettingsStore = create(
  persist<SettingsStoreTypes & SettingsStoreActions>(
    (set) => ({
      background: "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
      padding: "p-4",
      radius: "rounded-lg",
      language: "tsx",
      fileName: "Undefined-1.tsx",
      setBackground: (background) => set({ background }),
      setPadding: (padding) => set({ padding }),
      setRadius: (radius) => set({ radius }),
      setLanguage: (language) => set({ language }),
      setFileName: (fileName) => set({ fileName }),
    }),
    {
      name: "settings-storage",
    },
  ),
);
