import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { AnimatedToken } from "./animated-token";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/zustand/useSettingsStore";

interface AnimatedLineProps {
  line: any[];
  lineIndex: number;
  currentSlide: number;
  thumbnail?: boolean;
  diffType?: "new" | "removed" | "unchanged" | "updated";
  getLineProps: (options: { line: any[] }) => any;
  getTokenProps: (options: { token: any }) => any;
}

export const AnimatedLine: React.FC<AnimatedLineProps> = React.memo(
  ({
    line,
    lineIndex,
    currentSlide,
    diffType,
    thumbnail,
    getLineProps,
    getTokenProps,
  }) => {
    const lineKey = useMemo(
      () => `${currentSlide}-${lineIndex}`,
      [currentSlide, lineIndex],
    );

    const { withLineIndex } = useSettingsStore((state) => state);

    return (
      <motion.div {...getLineProps({ line })} layout>
        {withLineIndex && (
          <motion.span
            className={cn(
              "mr-4 select-none text-gray-500",
              thumbnail && "mr-3",
            )}
            layout
          >
            {String(lineIndex + 1).padStart(2, "0")}
          </motion.span>
        )}
        {line.map((token, tokenIndex) => (
          <AnimatedToken
            key={`${lineKey}-${tokenIndex}`}
            token={token}
            tokenIndex={tokenIndex}
            getTokenProps={getTokenProps}
            diffType={diffType} // Pass parent line's diffType
          />
        ))}
      </motion.div>
    );
  },
);

AnimatedLine.displayName = "AnimatedLine";
