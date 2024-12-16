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

export const HighlightCode: React.FC<Props> = 
  ({
    theme,
    currentCode,
    language,
    diffMap,
    thumbnail,
  }) => {
    const prevTokensRef = useRef<string[]>([]); // Track previous lines as plain strings
    const [exitingLines, setExitingLines] = useState<Set<string>>(new Set());

    useEffect(() => {
      const newExitingLines = new Set<string>();
      const currentLines = currentCode.split("\n"); // Split current code into lines

      prevTokensRef.current.forEach((lineContent, index) => {
        if (!currentLines.includes(lineContent)) {
          newExitingLines.add(`${index}-${lineContent}`);
        }
      });

      setExitingLines(newExitingLines);

      // Save current lines for the next render
      prevTokensRef.current = currentLines;

    }, [currentCode]);

    return (
      <Highlight theme={theme} code={currentCode} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => {
          const currentLines = tokens.map(line => line.map(token => token.content).join(""));

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
                  const id = `${index}-${lineContent}`;
                  const isNewLine = !prevTokensRef.current.includes(lineContent);
                  const isExiting = exitingLines.has(id);
                  const lineDiffType = diffMap?.lineDiff[index] || "unchanged";

                  return (
                    <AnimatedLine
                      key={id}
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
