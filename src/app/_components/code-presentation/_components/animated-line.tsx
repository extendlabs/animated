import React from "react";
import { motion } from "framer-motion";
import { AnimatedToken } from "./animated-token";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/zustand/useSettingsStore";
import { type TokenInputProps, type TokenOutputProps, type LineInputProps, type LineOutputProps, type Token } from "prism-react-renderer";

type Props = {
  line: Token[];
  lineIndex: number;
  isNewLine: boolean;
  isExiting: boolean;
  thumbnail?: boolean;
  diffType?: "new" | "unchanged";
  getLineProps: (input: LineInputProps) => LineOutputProps;
  getTokenProps: (input: TokenInputProps) => TokenOutputProps;
};

export const AnimatedLine = ({
  line,
  lineIndex,
  isNewLine,
  isExiting,
  diffType,
  thumbnail,
  getLineProps,
  getTokenProps,
}: Props) => {
  const { withLineIndex } = useSettingsStore((state) => state);

  const lineVariants = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
  };

  return (
    <motion.div
      {...getLineProps({ line })}
      key={lineIndex}
      layout
      variants={lineVariants}
      initial={isNewLine ? "initial" : false}
      animate="animate"
      exit="exit"
      transition={!isExiting ? { duration: 0 } : { duration: 0.5 }}
    >
      {withLineIndex && (
        <motion.span
          className={cn(
            "mr-4 select-none text-gray-500",
            thumbnail && "mr-3"
          )}
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
};
