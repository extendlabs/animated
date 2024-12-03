import { useState, useEffect } from 'react';

export const useTextAnimation = (diffType: string | undefined) => {
  const [animationState, setAnimationState] = useState<string>('initial');

  useEffect(() => {
    switch (diffType) {
      case 'changed':
        setAnimationState('changed');
        const resetTimeout = setTimeout(() => {
          setAnimationState('animate');
        }, 300);
        return () => clearTimeout(resetTimeout);
      
      case 'updated':
        setAnimationState('exit');
        break;
      
      case 'stale':
        setAnimationState('initial');
        break;
      
      default:
        setAnimationState('initial');
    }
  }, [diffType]);

  return { animationState };
};