import React from "react";
import { motion } from "framer-motion";
import {
  type TokenInputProps,
  type TokenOutputProps,
  type Token,
} from "prism-react-renderer";
import { useSettingsStore } from "@/zustand/useSettingsStore";
type Props = {
  token: Token;
  lineIndex: number;
  tokenIndex: number;
  isNewLine: boolean;
  diffType?: "new" | "unchanged" | "default";
  getTokenProps: (input: TokenInputProps) => TokenOutputProps;
};
export const AnimatedToken = ({
  token,
  tokenIndex,
  diffType = "default",
  getTokenProps,
}: Props) => {
  const variants = {
    initial: { opacity: diffType === "new" ? 0 : 1 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const { transitionDuration, transitionDelay } = useSettingsStore(
    (state) => state
  );

  return (
    <motion.span
      {...getTokenProps({ token })}
      layout
      variants={variants}
      initial={"initial"}
      animate="animate"
      exit="exit"
      transition={{
        duration: transitionDuration,
        delay: tokenIndex * transitionDelay,
      }}
    />
  );
};
