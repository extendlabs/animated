/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedToken } from './animated-token';
import { useTextAnimation } from '@/hooks/useTextAnimation';


interface AnimatedLineProps {
  line: any[];
  lineIndex: number;
  currentSlide: number;
  diffType?: 'changed' | 'stale' | 'updated';
  matchingTokens?: string[];
  getLineProps: (options: { line: any[] }) => any;
  getTokenProps: (options: { token: any }) => any;
}

const lineVariants = {
    initial: {
        opacity: 0,
        transition: {
          duration: 0
        }
    },
    animate: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0
      }
    }
  };


export const AnimatedLine: React.FC<AnimatedLineProps> = ({
  line,
  lineIndex,
  currentSlide,
  diffType,
  getLineProps,
  getTokenProps,
}) => {
    const { isDeleting, isTyping } = useTextAnimation(diffType);
    const getAnimationState = () => {
        if (isDeleting) return 'exit';
        if (isTyping) return 'animate';
        return diffType;
      };

      console.log('diffType', diffType);
      console.log('isDeleting', isDeleting);
      console.log('isTyping', isTyping);
  return (
    <motion.div
      key={`${currentSlide}-${lineIndex}`}
      {...getLineProps({ line })}
    //   initial="initial"
      animate={getAnimationState()}
      variants={lineVariants}
      layout
    >
      <motion.span 
        className="text-gray-500 select-none mr-4"
        layout
      >
        {String(lineIndex + 1).padStart(2, '0')}
      </motion.span>
      {line.map((token, tokenIndex) => {
        // const tokenText = token.content;
        // const isUpdated = matchingTokens.includes(tokenText);
        
        return (
          <AnimatedToken
            key={`${currentSlide}-${lineIndex}-${tokenIndex}`}
            token={token}
            // isUpdated={isUpdated}
            // currentSlide={currentSlide}
            // lineIndex={lineIndex}
            tokenIndex={tokenIndex}
            getTokenProps={getTokenProps}
          />
        );
      })}
    </motion.div>
  );
};