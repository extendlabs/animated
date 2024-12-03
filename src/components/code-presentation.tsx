"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import { computeDiff } from "@/lib/utils/code-diff";
import {
  type CodePresentationProps,
  type DiffResult,
} from "types/code-presentation.type";
import { AnimatedLine } from "./animated-line";

const CodePresentation: React.FC<CodePresentationProps> = ({
  slides = [],
  autoPlayInterval = 3000,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
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

  const handleSlideChange = useCallback(
    (direction: "next" | "prev") => {
      if (isAnimating) return;

      const newIndex =
        direction === "next"
          ? Math.min(currentSlide + 1, slides.length - 1)
          : Math.max(currentSlide - 1, 0);

      if (newIndex !== currentSlide) {
        setIsAnimating(true);
        const newDiff = computeDiff(
          slides[currentSlide].code,
          slides[newIndex].code,
        );
        setDiffMap(newDiff);
        setCurrentSlide(newIndex);
        setTimeout(() => {
          setIsAnimating(false);
        }, 1000);
      }
    },
    [currentSlide, slides, isAnimating],
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isAutoPlaying && !isAnimating) {
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
    isAnimating,
  ]);

  return (
    <div className="mx-auto w-full max-w-4xl">
      <motion.div className="space-y-4 rounded-lg bg-gray-800 p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="font-medium text-gray-200">
              Slide {currentSlide + 1} of {slides.length}
            </span>
            <div className="h-4 w-px bg-gray-600" />
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              disabled={isAnimating}
              className="rounded-full p-2 transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={isAutoPlaying ? "Pause" : "Play"}
            >
              {isAutoPlaying ? (
                <Pause className="h-4 w-4 text-gray-200" />
              ) : (
                <Play className="h-4 w-4 text-gray-200" />
              )}
            </button>
          </div>
        </div>

        {slides[currentSlide]?.description && (
          <div
            key={`desc-${currentSlide}`}
            className="rounded-md bg-gray-700/50 p-3 text-sm text-gray-200 transition-colors"
          >
            {slides[currentSlide].description}
          </div>
        )}

        <div className="relative overflow-hidden rounded-lg">
          <Highlight theme={themes.nightOwl} code={currentCode} language="tsx">
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                className={`${className} min-h-[200px] overflow-x-auto p-4 text-sm`}
                style={style}
              >
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
              </pre>
            )}
          </Highlight>
        </div>

        <div className="mt-2 flex justify-between">
          <button
            onClick={() => handleSlideChange("prev")}
            disabled={currentSlide === 0 || isAnimating}
            className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </button>
          <button
            onClick={() => handleSlideChange("next")}
            disabled={currentSlide === slides.length - 1 || isAnimating}
            className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CodePresentation;
