import { cn } from "@/lib/utils";
import { HighlightCode } from "./highlight-code";
import { type DiffResult } from "types/code-presentation.type";
import { CardHeader } from "./card-header";
import { useSettingsStore } from "@/zustand/useSettingsStore";

type Props = {
  currentCode: string;
  currentSlide: number;
  diffMap: DiffResult | null;
  themeBackground?: string;
  themeBorder?: string;
  themeText?: string;
};

export const CodeCard = ({
  currentCode,
  currentSlide,
  diffMap,
  themeBackground,
  themeBorder,
  themeText,
}: Props) => {
  const { padding, radius, language, theme, background, cardTheme } =
    useSettingsStore();

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
        padding,
        "transition-all duration-300 ease-in-out",
      )}
      style={{ background: background }}
    >
      <div
        className={cn("p-1 shadow-xl", radius)}
        style={{
          background: themeBackground,
        }}
      >
        <CardHeader
          cardTheme={cardTheme}
          themeBorder={themeBorder}
          themeText={themeText}
        />

        <HighlightCode
          theme={theme}
          currentCode={currentCode}
          language={language}
          currentSlide={currentSlide}
          diffMap={diffMap}
        />
        <div className="py-2" />
      </div>
    </div>
  );
};
