/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { PrismTheme, themes } from "prism-react-renderer";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type SettingsStoreTypes = {
  background: string;
  padding: string;
  radius: string;
  language: string;
  fileName: string;
  theme: PrismTheme;
};

type SettingsStoreActions = {
  setBackground: (background: string) => void;
  setPadding: (padding: string) => void;
  setRadius: (radius: string) => void;
  setLanguage: (language: string) => void;
  setFileName: (fileName: string) => void;
  setTheme: (theme: PrismTheme) => void;
};

export const useSettingsStore = create(
  immer<SettingsStoreTypes & SettingsStoreActions>((set) => ({
    background: "linear-gradient(to right, #3b82f6, #9333ea, #ec4899)",
    padding: "p-4",
    radius: "rounded-lg",
    language: "tsx",
    fileName: "Undefined-1.tsx",
    theme: themes.vsDark,
    setBackground: (background) => set({ background }),
    setPadding: (padding) => set({ padding }),
    setRadius: (radius) => set({ radius }),
    setLanguage: (language) => set({ language }),
    setFileName: (fileName) => set({ fileName }),
    setTheme: (theme) => set({ theme }),
  })),
);

export const {
  setBackground,
  setPadding,
  setRadius,
  setLanguage,
  setFileName,
  setTheme,
} = useSettingsStore.getState();
