/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { AnimatedToken } from "./animated-token";

interface AnimatedLineProps {
  line: any[];
  lineIndex: number;
  currentSlide: number;
  diffType?: "changed" | "stale" | "updated";
  matchingTokens?: string[];
  getLineProps: (options: { line: any[] }) => any;
  getTokenProps: (options: { token: any }) => any;
}

export const AnimatedLine: React.FC<AnimatedLineProps> = React.memo(
  ({
    line,
    lineIndex,
    currentSlide,
    diffType,
    getLineProps,
    getTokenProps,
  }) => {
    const lineKey = useMemo(
      () => `${currentSlide}-${lineIndex}`,
      [currentSlide, lineIndex],
    );

    return (
      <motion.div {...getLineProps({ line })} layout>
        <motion.span className="mr-4 select-none text-gray-500" layout>
          {String(lineIndex + 1).padStart(2, "0")}
        </motion.span>
        {line.map((token, tokenIndex) => {
          const tokenKey = `${lineKey}-${tokenIndex}`;
          return (
            <AnimatedToken
              token={token}
              tokenIndex={tokenIndex}
              getTokenProps={getTokenProps}
              diffType={diffType}
              key={tokenKey}
            />
          );
        })}
      </motion.div>
    );
  },
);

// Add a display name for better debugging
AnimatedLine.displayName = "AnimatedLine";
