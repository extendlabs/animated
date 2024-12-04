"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import { computeDiff } from "@/lib/utils/code-diff";
import {
  type CodePresentationProps,
  type DiffResult,
} from "types/code-presentation.type";
import { AnimatedLine } from "./animated-line";
import { Button } from "./ui/button";
import { useEngineSettingsSlidesStore } from "@/zustand/useEngineSlides";
import { MyEditor } from "./my-editor";

const CodePresentation: React.FC<CodePresentationProps> = ({
  autoPlayInterval = 1500,
}) => {
  const { slides, currentSlide, setCurrentSlide, updateSlide } =
    useEngineSettingsSlidesStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [diffMap, setDiffMap] = useState<DiffResult>({
    lineDiff: {},
    oldTokens: [],
    newTokens: [],
    matchingTokens: [],
  });

  const currentCode = useMemo(
    () => slides[currentSlide]?.code ?? "",
    [slides, currentSlide],
  );

  const handleEdit = () => setIsEditing((prev) => !prev);

  const handleSlideChange = useCallback(
    (direction: "next" | "prev") => {
      const newIndex =
        direction === "next"
          ? Math.min(currentSlide + 1, slides.length - 1)
          : Math.max(currentSlide - 1, 0);

      if (
        newIndex !== currentSlide &&
        slides[newIndex] &&
        slides[currentSlide]
      ) {
        const newDiff = computeDiff(
          slides[currentSlide].code,
          slides[newIndex].code,
        );
        setDiffMap(newDiff);
        setCurrentSlide(newIndex);
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
  ]);

  const handleUpdateSlide = (value: string | undefined) => {
    if (value !== undefined) {
      const updatedSlide = { code: value, description: "Updated description" };
      updateSlide(currentSlide, updatedSlide);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <motion.div className="space-y-4 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="font-medium">
              Slide {currentSlide + 1} of {slides.length}
            </span>
            <Button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              size="icon"
              aria-label={isAutoPlaying ? "Pause" : "Play"}
            >
              {isAutoPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {slides[currentSlide]?.description && (
          <div className="rounded-md p-3 text-sm">
            {slides[currentSlide].description}
          </div>
        )}

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
                  className={`${className} min-h-[400px] overflow-x-auto p-4 pl-5 text-sm`}
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
                        matchingTokens={diffMap.matchingTokens}
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

        <div className="flex justify-between">
          <Button onClick={handleEdit}>{isEditing ? "View" : "Edit"}</Button>
          <div className="flex space-x-2">
          <Button
            onClick={() => handleSlideChange("prev")}
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Previous
          </Button>
          <Button
            onClick={() => handleSlideChange("next")}
            disabled={currentSlide === slides.length - 1}
          >
            Next <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CodePresentation;
