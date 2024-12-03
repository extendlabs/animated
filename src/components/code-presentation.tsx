'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Highlight, themes } from 'prism-react-renderer';
import { computeDiff } from '@/lib/utils/code-diff';
import { type CodePresentationProps, type DiffResult } from 'types/code-presentation.type';
import { AnimatedLine } from './animated-line';


const CodePresentation: React.FC<CodePresentationProps> = ({ 
  slides = [], 
  autoPlayInterval = 3000 
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

  const currentCode = useMemo(() => slides[currentSlide]?.code ?? '', [slides, currentSlide]);

  const handleSlideChange = useCallback((direction: 'next' | 'prev') => {
    if (isAnimating) return;

    const newIndex = direction === 'next' 
      ? Math.min(currentSlide + 1, slides.length - 1)
      : Math.max(currentSlide - 1, 0);

    if (newIndex !== currentSlide) {
      setIsAnimating(true);
      const newDiff = computeDiff(slides[currentSlide].code, slides[newIndex].code);
      setDiffMap(newDiff);
      setCurrentSlide(newIndex);
      setTimeout(() => {
        setIsAnimating(false);
        setDiffMap({
          lineDiff: {},
          oldTokens: [],
          newTokens: [],
          matchingTokens: [],
        });
      }, 1000);
    }
  }, [currentSlide, slides, isAnimating]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isAutoPlaying && !isAnimating) {
      interval = setInterval(() => {
        if (currentSlide < slides.length - 1) {
          handleSlideChange('next');
        } else {
          setIsAutoPlaying(false);
        }
      }, autoPlayInterval);
    }

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentSlide, slides.length, autoPlayInterval, handleSlideChange, isAnimating]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        className="bg-gray-800 rounded-lg p-6 shadow-xl space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-gray-200 font-medium">
              Slide {currentSlide + 1} of {slides.length}
            </span>
            <div className="h-4 w-px bg-gray-600" />
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              disabled={isAnimating}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={isAutoPlaying ? 'Pause' : 'Play'}
            >
              {isAutoPlaying ? (
                <Pause className="w-4 h-4 text-gray-200" />
              ) : (
                <Play className="w-4 h-4 text-gray-200" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {slides[currentSlide]?.description && (
            <motion.div
              key={`desc-${currentSlide}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-gray-700/50 text-gray-200 rounded-md p-3 text-sm"
            >
              {slides[currentSlide].description}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative rounded-lg overflow-hidden">
          <Highlight
            theme={themes.nightOwl}
            code={currentCode}
            language="tsx"
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre 
                className={`${className} p-4 overflow-x-auto min-h-[200px] text-sm`}
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
        
        <div className="flex justify-between mt-2">
          <button
            onClick={() => handleSlideChange('prev')}
            disabled={currentSlide === 0 || isAnimating}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>
          <button
            onClick={() => handleSlideChange('next')}
            disabled={currentSlide === slides.length - 1 || isAnimating}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CodePresentation;