import React from "react";
import { motion } from "framer-motion";

interface AnimatedTokenProps {
  token: any;
  tokenIndex: number;
  diffType?: "new" | "removed" | "unchanged" | "updated";
  getTokenProps: (options: { token: any }) => any;
}

export const AnimatedToken: React.FC<AnimatedTokenProps> = ({
  token,
  tokenIndex,
  diffType = "unchanged",
  getTokenProps,
}) => {
  const initialVariants = {
    new: { opacity: 0 },
    removed: { opacity: 1 },
    unchanged: { opacity: 1 },
    updated: { opacity: 0 },
  };

  const animateVariants = {
    new: { opacity: 1 },
    removed: { opacity: 0, scale: 0.8 },
    unchanged: { opacity: 1 },
    updated: { opacity: 1 },
  };

  const transitionVariants = {
    new: { duration: 0.3, delay: tokenIndex * 0.05 },
    removed: { duration: 0.3, delay: tokenIndex * 0.05 },
    updated: { duration: 0.3, delay: tokenIndex * 0.05 },
    unchanged: {},
  };

  const exitVariants = {
    new: {
      opacity: [1, 0],
    },
    removed: {
      opacity: [1, 0],
    },
    updated: {},
    unchanged: {},
  };

  return (
    <motion.span
      {...getTokenProps({ token })}
      key={crypto.randomUUID()}
      initial={initialVariants[diffType]}
      animate={animateVariants[diffType]}
      transition={transitionVariants[diffType]}
      exit={exitVariants[diffType]}
    />
  );
};
