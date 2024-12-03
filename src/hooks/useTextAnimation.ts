import { useState, useEffect } from 'react';

export const useTextAnimation = (diffType: string | undefined) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (diffType === 'changed' || diffType === 'updated') {
      const deleteTimeout = setTimeout(() => {
        setIsDeleting(true);
      }, 0);

      const typeTimeout = setTimeout(() => {
        setIsDeleting(false);
        setIsTyping(true);
      }, 500);

      const resetTimeout = setTimeout(() => {
        setIsTyping(false);
      }, 1000);

      return () => {
        clearTimeout(deleteTimeout);
        clearTimeout(typeTimeout);
        clearTimeout(resetTimeout);
      };
    }
  }, [diffType]);

  return { isDeleting, isTyping };
}