"use client";

import React, { useMemo } from "react";
import { themes } from "prism-react-renderer";
import { useSettingsStore } from "@/zustand/useSettingsStore";
import { useUIStore } from "@/zustand/useUIStore";
import { cn } from "@/lib/utils";
import { themeStyles } from "@/constants/themes";
import { HighlightCode } from "./highlight-code";

type Props = {
  currentSlide: number;
  isCurrent: boolean;
};

const CodePreview = ({ currentSlide, isCurrent }: Props) => {
  const { slides } = useUIStore();
  const { language, theme, background, fileName } = useSettingsStore();

  const currentThemeName =
    Object.keys(themes).find(
      (key) => themes[key as keyof typeof themes] === theme,
    ) ?? "vsDark";

  const themeBackground =
    themeStyles[currentThemeName]?.bg ?? themeStyles.vsDark?.bg;
  const themeBorder =
    themeStyles[currentThemeName]?.border ?? themeStyles.vsDark?.border;
  const themeText =
    themeStyles[currentThemeName]?.text ?? themeStyles.vsDark?.text;

  const currentCode = useMemo(
    () => slides[currentSlide]?.code ?? "",
    [slides, currentSlide],
  );

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className={cn(
          "relative h-[120px] w-full overflow-hidden rounded-md p-2",
        )}
        style={{ background: background }}
      >
        {!isCurrent ? (
          <div className="absolute inset-0 h-full rounded-sm bg-black bg-opacity-70 hover:bg-slate-600/50" />
        ) : (
          <div className="absolute inset-0 h-[120px] rounded-sm hover:bg-slate-600/50" />
        )}
        <div
          className="h-full rounded-sm"
          style={{
            background: themeBackground,
          }}
        >
          <div
            className={cn(
              "flex items-center justify-between border-b px-2 py-0 leading-3",
            )}
            style={{ borderColor: themeBorder }}
          >
            <div className="flex items-center gap-1">
              <div className="h-1 w-1 rounded-full bg-red-500" />
              <div className="h-1 w-1 rounded-full bg-yellow-500" />
              <div className="h-1 w-1 rounded-full bg-green-500" />
            </div>
            <div className={cn("text-[4px]")} style={{ color: themeText }}>
              {fileName}
            </div>
            <div className="w-[20px]" />
          </div>
          <HighlightCode
            theme={theme}
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
