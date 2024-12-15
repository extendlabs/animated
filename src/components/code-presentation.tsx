"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";

import { motion } from "framer-motion";
import { themes } from "prism-react-renderer";
import {
  type CodePresentationProps,
  type DiffResult,
} from "types/code-presentation.type";
import { Button } from "./ui/button";
import { MyEditor } from "./my-editor";
import { computeDiff } from "@/lib/code-diff";
import { useSettingsStore } from "@/zustand/useSettingsStore";
import { useUIStore } from "@/zustand/useUIStore";
import { cn } from "@/lib/utils";
import { themeStyles } from "@/constants/themes";
import { PauseIcon, PlayIcon } from "lucide-react";
import { CodeCard } from "./code-card";

const CodePresentation: React.FC<CodePresentationProps> = ({
  autoPlayInterval = 1500,
}) => {
  const {
    slides,
    currentSlide,
    isEditing,
    isAutoPlaying,
    setCurrentSlide,
    setIsAutoPlaying,
    updateSlide,
  } = useUIStore();

  const { padding, radius, language, fileName, theme, background, cardTheme } =
    useSettingsStore();

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

  const [diffMap, setDiffMap] = useState<DiffResult>({
    lineDiff: {},
    oldTokens: [],
    newTokens: [],
  });

  const currentCode = useMemo(
    () => slides[currentSlide]?.code ?? "",
    [slides, currentSlide],
  );

  const handleSlideChange = useCallback(
    (direction: "next" | "prev") => {
      const newIndex =
        direction === "next"
          ? Math.min(currentSlide + 1, slides.length - 1)
          : Math.max(currentSlide - 1, 0);

      if (newIndex !== currentSlide) {
        setTimeout(() => {
          if (slides[newIndex] && slides[currentSlide]) {
            const newDiff = computeDiff(
              slides[currentSlide].code,
              slides[newIndex].code,
            );
            setDiffMap(newDiff);
            setCurrentSlide(newIndex);
          }
        }, 300);
      }
    },
    [currentSlide, slides, setCurrentSlide],
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isAutoPlaying) {
      interval = setInterval(() => {
        if (currentSlide < slides.length - 1) {
          handleSlideChange("next");
        } else {
          setIsAutoPlaying(false);
          setDiffMap({
            lineDiff: {},
            oldTokens: [],
            newTokens: [],
          });
        }
      }, autoPlayInterval);
    }

    return () => clearInterval(interval);
  }, [
    isAutoPlaying,
    currentSlide,
    slides.length,
    autoPlayInterval,
    handleSlideChange,
    setIsAutoPlaying,
  ]);

  const handleUpdateSlide = (value: string | undefined) => {
    if (value !== undefined) {
      const updatedSlide = { code: value, description: "Updated description" };
      updateSlide(currentSlide, updatedSlide);
    }
  };

  const componentRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div className="mx-auto w-full max-w-3xl">
        <motion.div className="space-y-4 rounded-lg p-4">
          <div className="relative overflow-hidden rounded-sm">
            {isEditing ? (
              <MyEditor
                value={currentCode}
                handleUpdateSlide={handleUpdateSlide}
              />
            ) : (
              <div
                ref={componentRef}
                className={cn(
                  "relative overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-12",
                  padding,
                  "transition-all duration-300 ease-in-out",
                )}
                style={{ background: background }}
              >
                <CodeCard
                  theme={theme}
                  currentCode={currentCode}
                  language={language}
                  diffMap={diffMap}
                  currentSlide={currentSlide}
                  radius={radius}
                  themeBackground={themeBackground}
                  themeBorder={themeBorder}
                  themeText={themeText}
                  fileName={fileName}
                  cardTheme={cardTheme}
                />
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <div className="mt-4 flex items-center space-x-4">
              <Button
                onClick={() => {
                  setCurrentSlide(0);
                  setIsAutoPlaying(!isAutoPlaying);
                }}
                aria-label={isAutoPlaying ? "Pause" : "Play"}
                disabled={isAutoPlaying}
                variant="ghost"
                size={"icon"}
              >
                {isAutoPlaying ? (
                  <PauseIcon className="h-4 w-4" />
                ) : (
                  <PlayIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CodePresentation;
