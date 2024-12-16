import React from "react";
import { motion } from "framer-motion";

interface AnimatedTokenProps {
  token: any;
  lineIndex: number;
  tokenIndex: number;
  isNewLine: boolean;
  diffType?: "new" | "unchanged" | "default";
  getTokenProps: (options: { token: any }) => any;
}

export const AnimatedToken: React.FC<AnimatedTokenProps> = ({
  token,
  lineIndex,
  tokenIndex,
  isNewLine,
  diffType = "default",
  getTokenProps,
}) => {
  const variants = {
    initial: { opacity: diffType === "new" ? 0 : 1 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <motion.span
      {...getTokenProps({ token })}
      layout
      variants={variants}
      initial={isNewLine ? "initial" : false}
      animate="animate"
      exit="exit"
      transition={{ duration: 0.6, delay: tokenIndex * 0.05 }}
    />
  );
};

