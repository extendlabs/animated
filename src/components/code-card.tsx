import { cn } from "@/lib/utils";
import { HighlightCode } from "./highlight-code";
import { type PrismTheme } from "prism-react-renderer";
import { type CardTheme, type DiffResult } from "types/code-presentation.type";
import { CardHeader } from "./card-header";

type Props = {
  theme: PrismTheme;
  currentCode: string;
  language: string;
  currentSlide: number;
  diffMap: DiffResult | null;
  thumbnail?: boolean;
  radius: string;
  themeBackground?: string;
  themeBorder?: string;
  themeText?: string;
  fileName: string;
  cardTheme: CardTheme;
};

export const CodeCard = ({
  theme,
  currentCode,
  language,
  currentSlide,
  diffMap,
  radius,
  themeBackground,
  themeBorder,
  themeText,
  fileName,
  cardTheme,
}: Props) => {
  return (
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
        fileName={fileName}
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
  );
};
