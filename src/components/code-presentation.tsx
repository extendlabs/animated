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
import { useEngineSettingsSlidesStore } from "@/zustand/useEngineSlides";
import { MyEditor } from "./my-editor";
import { computeDiff } from "@/lib/utils/code-diff";


const CodePresentation: React.FC<CodePresentationProps> = ({
  autoPlayInterval = 1500,
}) => {
  const { slides, currentSlide, isEditing, isAutoPlaying, setCurrentSlide, setIsAutoPlaying, updateSlide } =
    useEngineSettingsSlidesStore();

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
  }, [isAutoPlaying, currentSlide, slides.length, autoPlayInterval, handleSlideChange, setIsAutoPlaying]);

  const handleUpdateSlide = (value: string | undefined) => {
    if (value !== undefined) {
      const updatedSlide = { code: value, description: "Updated description" };
      updateSlide(currentSlide, updatedSlide);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <motion.div className="space-y-4 rounded-lg p-6">
        <div className="relative overflow-hidden rounded-lg border border-gray-700">
          {isEditing ? (
            <MyEditor
              value={currentCode}
              handleUpdateSlide={handleUpdateSlide}
            />
          ) : (
            <Highlight theme={themes.vsDark} code={currentCode} language="tsx">
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  className={`${className}  overflow-x-auto p-4 pl-5 text-sm`}
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
              variant={"outline"}
            >
              Play
            </Button>
            
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CodePresentation;
