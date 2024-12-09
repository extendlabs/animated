"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import {
  type CodePresentationProps,
  type DiffResult,
} from "types/code-presentation.type";
import { AnimatedLine } from "./animated-line";
import { Button } from "./ui/button";
import { MyEditor } from "./my-editor";
import { computeDiff } from "@/lib/utils/code-diff";
import { useSettingsStore } from "@/zustand/useSettingsStore";
import { useUIStore } from "@/zustand/useUIStore";
import { cn } from "@/lib/utils";
import { themeStyles } from "@/constants/themes";
import { PauseIcon, Play, PlayIcon } from "lucide-react";

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

  const { padding, radius, language, fileName, theme, background } =
    useSettingsStore();

  const currentThemeName =
    Object.keys(themes).find((key) => themes[key] === theme) ?? "vsDark";

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

  return (
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
              className={cn(
                "relative overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-12",
                padding,
                "transition-all duration-300 ease-in-out",
              )}
              style={{ background: background }}
            >
              <div
                className={cn("shadow-xl", radius)}
                style={{
                  background: themeBackground,
                }}
              >
                <div
                  className={cn(
                    "flex items-center justify-between border-b px-4 py-3",
                  )}
                  style={{ borderColor: themeBorder }}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <div className={cn("text-sm")} style={{ color: themeText }}>
                    {fileName}
                  </div>
                  <div className="w-[62px]" />
                </div>
                <Highlight theme={theme} code={currentCode} language={language}>
                  {({
                    className,
                    style,
                    tokens,
                    getLineProps,
                    getTokenProps,
                  }) => (
                    <pre
                      className={cn(
                        className,
                        "overflow-hidden pl-5 pt-4 text-sm",
                      )}
                      style={style}
                    >
                      <AnimatePresence mode="wait">
                        {tokens.map((line, i) => (
                          <AnimatedLine
                            key={`${currentSlide}-${i}`}
                            line={line}
                            lineIndex={i}
                            currentSlide={currentSlide}
                            diffType={diffMap.lineDiff[i]}
                            getLineProps={getLineProps}
                            getTokenProps={getTokenProps}
                          />
                        ))}
                      </AnimatePresence>
                    </pre>
                  )}
                </Highlight>
                <div className="py-2" />
              </div>
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
  );
};

export default CodePresentation;
