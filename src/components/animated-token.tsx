/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedTokenProps {
  token: any;
  // isUpdated?: boolean;
  // currentSlide: number;
  // lineIndex: number;
  tokenIndex: number;
  getTokenProps: (options: { token: any }) => any;
}



export const AnimatedToken: React.FC<AnimatedTokenProps> = ({
  token,
  // isUpdated,
  // currentSlide,
  // lineIndex,
  tokenIndex,
  getTokenProps,
}) => {
  const tokenVariants = {
    initial: { 
    
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
        delay: tokenIndex * 0.03
      }
    },
    exit: {
      opacity: 0,
      x: 10,
      transition: {
        duration: 0.1,
        delay: tokenIndex * 0.02
      }
    }
  };

  return (
    <motion.span
    {...getTokenProps({ token })}
    variants={tokenVariants}
    layout
    />
  );
};