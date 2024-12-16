import React from "react";
import { motion } from "framer-motion";
import { AnimatedToken } from "./animated-token";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/zustand/useSettingsStore";

interface AnimatedLineProps {
  line: any[];
  lineIndex: number;
  isNewLine: boolean;
  isExiting: boolean;
  thumbnail?: boolean;
  diffType?: "new" | "unchanged";
  getLineProps: (options: { line: any[] }) => any;
  getTokenProps: (options: { token: any }) => any;
}

export const AnimatedLine: React.FC<AnimatedLineProps> = React.memo(
  ({
    line,
    lineIndex,
    isNewLine,
    isExiting,
    diffType,
    thumbnail,
    getLineProps,
    getTokenProps,
  }) => {
    const { withLineIndex } = useSettingsStore((state) => state);

    const lineVariants = {
      initial: { opacity: 0, height: 0 },
      animate: { opacity: 1, height: "auto" },
      exit: { opacity: 0, height: 0 }
    };

    return (
      <motion.div
        {...getLineProps({ line })}
        layout
        variants={lineVariants}
        
        animate="animate"
        exit="exit"
        transition={{ duration: 0.8 }}
      >
        {withLineIndex && (
          <motion.span
            className={cn(
              "mr-4 select-none text-gray-500",
              thumbnail && "mr-3",
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {String(lineIndex + 1).padStart(2, "0")}
          </motion.span>
        )}
        {line.map((token, tokenIndex) => (
          <AnimatedToken
            key={`${lineIndex}-${tokenIndex}-${token.content}`}
            token={token}
            lineIndex={lineIndex}
            tokenIndex={tokenIndex}
            getTokenProps={getTokenProps}
            diffType={diffType}
            isNewLine={isNewLine}
          />
        ))}
      </motion.div>
    );
  },
);

AnimatedLine.displayName = "AnimatedLine";
