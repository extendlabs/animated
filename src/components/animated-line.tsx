import React, { useMemo } from 'react';
import { AnimatePresence, delay, motion } from 'framer-motion';
import { useTextAnimation } from '@/hooks/useTextAnimation';
import { AnimatedToken } from './animated-token';

interface AnimatedLineProps {
  line: any[];
  lineIndex: number;
  currentSlide: number;
  diffType?: 'changed' | 'stale' | 'updated';
  matchingTokens?: string[];
  getLineProps: (options: { line: any[] }) => any;
  getTokenProps: (options: { token: any }) => any;
}

export const AnimatedLine: React.FC<AnimatedLineProps> = React.memo(({
  line,
  lineIndex,
  currentSlide,
  diffType,
  getLineProps,
  getTokenProps,
}) => {
  const lineKey = useMemo(() => `${currentSlide}-${lineIndex}`, [currentSlide, lineIndex]);



  return (
    <AnimatePresence mode="wait">
    <motion.div
      key={lineKey}
      {...getLineProps({ line })}
      layout
    >
      <motion.span 
        className="text-gray-500 select-none mr-4"
        layout
      >
        {String(lineIndex + 1).padStart(2, '0')}
      </motion.span>
      {(
        line.map((token, tokenIndex) => {
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
        })
      )}
      
    </motion.div>
    </AnimatePresence>
  );
});

// Add a display name for better debugging
AnimatedLine.displayName = 'AnimatedLine';
