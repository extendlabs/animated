"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

type AnimationProps = {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  blurAmount?: number;
  triggerOnce?: boolean;
  useBlur?: boolean;
  threshold?: number;
};

export default function FadeUp({
  children,
  delay = 0,
  duration = 0.5,
  blurAmount = 10,
  triggerOnce = true,
  useBlur = true,
  threshold = 0.1,
}: AnimationProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: triggerOnce, amount: threshold });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isInView && !isVisible) {
      setIsVisible(true);
    }
  }, [isInView, isVisible]);

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: 15,
        filter: useBlur ? `blur(${blurAmount}px)` : "none",
      }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 15,
        filter: isVisible
          ? "blur(0px)"
          : useBlur
            ? `blur(${blurAmount}px)`
            : "none",
      }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // Smooth easing function
        filter: { duration: duration * 0.8 }, // Blur effect duration slightly shorter
      }}
    >
      {children}
    </motion.div>
  );
}
