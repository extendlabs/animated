import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Highlight, type PrismTheme } from "prism-react-renderer";
import { AnimatePresence } from "framer-motion";
import { type DiffResult } from "types/code-presentation.type";
import { AnimatedLine } from "./animated-line";

type Props = {
  theme: PrismTheme;
  currentCode: string;
  language: string;
  currentSlide: number;
  diffMap: DiffResult | null;
  thumbnail?: boolean;
};

export const HighlightCode = 
  ({
    theme,
    currentCode,
    language,
    diffMap,
    thumbnail,
  }: Props) => {
    const prevTokensRef = useRef<string[]>([]);
    const [exitingLines, setExitingLines] = useState<Set<number>>(new Set());

    useEffect(() => {
      const prevLines = prevTokensRef.current;
      const currentLines = currentCode.split("\n");
      const newExitingLines = new Set<number>();

      prevLines.forEach((lineContent, index) => {
        if (currentLines[index] !== lineContent) {
          newExitingLines.add(index);
        }
      });

      setExitingLines(newExitingLines);

      prevTokensRef.current = currentLines;
    }, [currentCode]);

    return (
      <Highlight theme={theme} code={currentCode} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => {
          const currentLines = tokens.map(line =>
            line.map(token => token.content).join("")
          );
          return (
            <pre
              className={cn(
                className,
                "overflow-hidden pl-5 pt-4 text-sm",
                thumbnail && "pl-1 pt-1 text-[4px] leading-[6px]"
              )}
              style={style}
            >
              <AnimatePresence initial={false}>
                {tokens.map((line, index) => {
                  const lineContent = currentLines[index];
                  const isNewLine =
                    index >= prevTokensRef.current.length ||
                    prevTokensRef.current[index] !== lineContent;
                  const isExiting = exitingLines.has(index);
                  const lineDiffType = diffMap?.lineDiff[index] ?? "unchanged";

                  return (
                    <AnimatedLine
                      key={`${index}-${lineContent}`}
                      line={line}
                      lineIndex={index}
                      isNewLine={isNewLine}
                      isExiting={isExiting}
                      diffType={lineDiffType}
                      thumbnail={thumbnail}
                      getLineProps={getLineProps}
                      getTokenProps={getTokenProps}
                    />
                  );
                })}
              </AnimatePresence>
            </pre>
          );
        }}
      </Highlight>
    );
  };

HighlightCode.displayName = "HighlightCode";
