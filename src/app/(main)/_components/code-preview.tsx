"use client";

import React, { useMemo } from "react";
import { useSettingsStore } from "@/zustand/useSettingsStore";
import { useUIStore } from "@/zustand/useUIStore";
import { HighlightCode } from "./code-presentation/_components/highlight-code";
import { getThemeStyles } from "@/helpers/get-theme-styles";
import PreviewCardHeader from "./preview-card-header";
import { type CardTheme } from "types/code-presentation.type";

type Props = {
  currentSlide: number;
};

const CodePreview = ({ currentSlide }: Props) => {
  const { slides, fileName } = useUIStore();
  const { language, themeName, cardTheme } = useSettingsStore();

  const themeStyles = getThemeStyles(themeName);

  const currentCode = useMemo(
    () => slides[currentSlide]?.code ?? "",
    [slides, currentSlide],
  );

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative h-[120px] w-full overflow-hidden rounded-md px-2 py-1">
        <div
          className="h-full rounded-sm"
          style={{ background: themeStyles.styles?.bg }}
        >
          <PreviewCardHeader
            cardTheme={cardTheme as CardTheme}
            themeBorder={themeStyles.styles?.border}
            themeText={themeStyles.styles?.text}
            fileName={fileName}
          />
          <HighlightCode
            currentCode={currentCode}
            language={language}
            currentSlide={currentSlide}
            thumbnail
            diffMap={null}
          />
        </div>
      </div>
    </div>
  );
};
export default CodePreview;
