/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedTokenProps {
  token: any;
  tokenIndex: number;
  diffType?: 'changed' | 'stale' | 'updated';
  getTokenProps: (options: { token: any }) => any;
}

export const AnimatedToken: React.FC<AnimatedTokenProps> = ({
  token,
  tokenIndex,
  diffType = 'stale',
  getTokenProps,
}) => {
  const initialVariants = {
    changed: {
      opacity: 0
    },
    stale: {
      opacity: 1
    },
    updated: {
      opacity: 1
    }
  };

  const animateVariants = {
    changed: {
      opacity: 1
    },
    stale: {
      opacity: 1
    },
    updated: {
      opacity: 1
    }
  };

  const transitionVariants = {
    changed: {
      duration: 0.2,
      delay: tokenIndex * 0.1,
    },
    stale: {
      duration: 0.2,
      delay: tokenIndex * 0.1
    },
    updated: {
      duration: 0.2,
      delay: tokenIndex * 0.1
    }
  };

  const exitVariants = {
    changed: { opacity: 0, scale: 0.9 },
    stale: { opacity: 0 },
    updated: { opacity: 0, scale: 0.95 },
  };

  return (
    <motion.span
      {...getTokenProps({ token })}
      initial={initialVariants[diffType]}
      animate={animateVariants[diffType]}
      transition={transitionVariants[diffType]}
      exit={exitVariants[diffType]}
    />
  );
};

