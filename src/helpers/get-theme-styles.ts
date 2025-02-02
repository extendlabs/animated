import { themes } from "prism-react-renderer";
import { themeStyles } from "@/constants/themes";

export const getThemeStyles = (themeName: string) => {
  return {
    theme: themes[themeName as keyof typeof themes] || themes.vsDark,
    styles: themeStyles[themeName] || themeStyles.vsDark
  };
};