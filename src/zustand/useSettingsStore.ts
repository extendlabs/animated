import { create } from "zustand";
import { getThemeStyles } from "@/helpers/get-theme-styles";
import { type CardTheme } from "types/code-presentation.type";

interface Settings {
  name: string;
  background: string;
  width: number;
  radius: number;
  language: string;
  withLineIndex: boolean;
  cardTheme: string;
  themeName: string;
  theme: any;
  themeStyles?: {
    bg: string;
    border: string;
    text: string;
  };
  selectedThemeId: string | null;
  autoPlayInterval: number;
  transitionDuration: number;
  transitionDelay: number;
}

interface SettingsStore extends Settings {
  setSettings: (settings: Partial<Settings>) => void;
  setWidth: (width: number) => void;
  setRadius: (radius: number) => void;
  setLanguage: (language: string) => void;
  setBackground: (background: string) => void;
  setWithLineIndex: (withLineIndex: boolean) => void;
  setCardTheme: (cardTheme: string) => void;
  setThemeName: (themeName: CardTheme) => void;
  setName: (name: string) => void;
  setSelectedThemeId: (id: string | null) => void;
  resetSettings: () => void;
  setAutoPlayInterval: (interval: number) => void;
  setTransitionDuration: (duration: number) => void;
  setTransitionDelay: (delay: number) => void;
}

const DEFAULT_THEME_NAME = "vsDark";
const initialThemeStyles = getThemeStyles(DEFAULT_THEME_NAME);

const initialState: Settings = {
  background: "linear-gradient(to right, #11998e, #38ef7d)",
  width: 500,
  radius: 10,
  language: "tsx",
  withLineIndex: true,
  cardTheme: "default",
  themeName: DEFAULT_THEME_NAME,
  theme: initialThemeStyles.theme,
  themeStyles: initialThemeStyles.styles,
  name: "",
  selectedThemeId: null,
  autoPlayInterval: 2,
  transitionDuration: 0.6,
  transitionDelay: 0.1,
};

export const useSettingsStore = create<SettingsStore>()((set) => ({
  ...initialState,
  setSettings: (settings) => {
    if (settings.themeName) {
      const { theme, styles } = getThemeStyles(settings.themeName);
      set((state) => ({
        ...state,
        ...settings,
        theme,
        themeStyles: styles,
      }));
    } else {
      set((state) => ({ ...state, ...settings }));
    }
  },
  setWidth: (width) => set({ width }),
  setRadius: (radius) => set({ radius }),
  setLanguage: (language) => set({ language }),
  setBackground: (background) => set({ background }),
  setWithLineIndex: (withLineIndex) => set({ withLineIndex }),
  setCardTheme: (cardTheme) => set({ cardTheme }),
  setThemeName: (themeName) => {
    const { theme, styles } = getThemeStyles(themeName);
    set({ themeName, theme, themeStyles: styles });
  },
  setName: (name) => set({ name }),
  setSelectedThemeId: (id) => set({ selectedThemeId: id }),
  resetSettings: () => set(initialState),
  setAutoPlayInterval: (interval) => set({ autoPlayInterval: interval }),
  setTransitionDuration: (duration) => set({ transitionDuration: duration }),
  setTransitionDelay: (delay) => set({ transitionDelay: delay }),
}));

export const { setSelectedThemeId } = useSettingsStore.getState();
