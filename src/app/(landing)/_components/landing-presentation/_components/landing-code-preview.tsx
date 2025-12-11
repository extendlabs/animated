import { HighlightCode } from "@/app/dashboard/(main)/_components/code-presentation/_components/highlight-code";
import { PreviewCardHeader } from "@/app/dashboard/(main)/_components/preview-card-header";
import { getThemeStyles } from "@/helpers/get-theme-styles";
import { useMemo } from "react";
import { type CardTheme } from "types/code-presentation.type";
import { initialState, slides } from "../landing-presentation";

interface CodePreviewLandingProps {
  currentSlide: number;
}

export const CodePreviewLanding = ({
  currentSlide,
}: CodePreviewLandingProps) => {
  const themeStyles = getThemeStyles(initialState.themeName);

  const currentCode = useMemo(
    () => slides[currentSlide]?.code ?? "",
    [currentSlide]
  );

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative h-full w-full overflow-hidden rounded-md px-2 py-1">
        <div
          className="h-full rounded-sm"
          style={{ background: themeStyles.styles?.bg }}
        >
          <PreviewCardHeader
            cardTheme={initialState.cardTheme as CardTheme}
            themeBorder={themeStyles.styles?.border}
            themeText={themeStyles.styles?.text}
            fileName={"Undefined.tsx"}
          />
          <HighlightCode
            currentCode={currentCode}
            language={initialState.language}
            currentSlide={currentSlide}
            thumbnail
            diffMap={null}
          />
        </div>
      </div>
    </div>
  );
};
