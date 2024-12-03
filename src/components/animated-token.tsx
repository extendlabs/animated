/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { motion } from "framer-motion";

interface AnimatedTokenProps {
  token: any;
  tokenIndex: number;
  diffType?: "changed" | "stale" | "updated";
  getTokenProps: (options: { token: any }) => any;
}

export const AnimatedToken: React.FC<AnimatedTokenProps> = ({
  token,
  tokenIndex,
  diffType = "stale",
  getTokenProps,
}) => {
  const initialVariants = {
    changed: {
      opacity: 0,
    },
    stale: {
      opacity: 1,
    },
    updated: {
      opacity: 0,
    },
  };

  const animateVariants = {
    changed: {
      opacity: 1,
    },
    stale: {
      opacity: 1,
    },
    updated: {
      opacity: 1,
    },
  };

  const transitionVariants = {
    changed: {
      duration: 0.15,
      delay: tokenIndex * 0.1,
    },
    stale: {
    },
    updated: {
      duration: 0.15,
      delay: tokenIndex * 0.1,
    },
  };

  const exitVariants = {
    updated: {
    },
    changed: {
      opacity: [1, 0],
    },
    stale: {},
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
