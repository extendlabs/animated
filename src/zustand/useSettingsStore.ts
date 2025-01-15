/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { type PrismTheme, themes } from "prism-react-renderer";
import { type CardTheme } from "types/code-presentation.type";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type SettingsStoreTypes = {
  background: string;
  padding?: number;
  radius?: number;
  language: string;
  fileName: string;
  theme: PrismTheme;
  withLineIndex: boolean;
  cardTheme: CardTheme;
};

type SettingsStoreActions = {
  setBackground: (background: string) => void;
  setPadding: (padding?: number) => void;
  setRadius: (radius?: number) => void;
  setLanguage: (language: string) => void;
  setFileName: (fileName: string) => void;
  setTheme: (theme: PrismTheme) => void;
  setWithLineIndex: (withLineIndex: boolean) => void;
  setCardTheme: (cardTheme: CardTheme) => void;
};

export const useSettingsStore = create(
  immer<SettingsStoreTypes & SettingsStoreActions>((set) => ({
    background: "linear-gradient(to right, #3b82f6, #9333ea, #ec4899)",
    padding: 50,
    radius: 10,
    language: "tsx",
    fileName: "Undefined-1.tsx",
    theme: themes.vsDark,
    withLineIndex: true,
    cardTheme: "default",
    setBackground: (background) => set({ background }),
    setPadding: (padding) => set({ padding }),
    setRadius: (radius) => set({ radius }),
    setLanguage: (language) => set({ language }),
    setFileName: (fileName) => set({ fileName }),
    setTheme: (theme) => set({ theme }),
    setWithLineIndex: (withLineIndex) => set({ withLineIndex }),
    setCardTheme: (cardTheme) => set({ cardTheme }),
  })),
);

export const {
  setBackground,
  setPadding,
  setRadius,
  setLanguage,
  setFileName,
  setTheme,
  setWithLineIndex,
  setCardTheme,
} = useSettingsStore.getState();
