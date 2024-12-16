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
    const prevTokensRef = useRef<any[][]>([]);
    const [exitingLines, setExitingLines] = useState<Set<string>>(new Set());

    useEffect(() => {
      const newExitingLines = new Set<string>();
      prevTokensRef.current.forEach((line, index) => {
        const lineContent = line.map(token => token.content).join('');
        if (!currentCode.includes(lineContent)) {
          newExitingLines.add(`${index}-${lineContent}`);
        }
      });
      setExitingLines(newExitingLines);

      return () => {
        prevTokensRef.current = [];
        setExitingLines(new Set());
      };
    }, [currentCode]);

    return (
      <Highlight theme={theme} code={currentCode} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => {
          const uniqueTokens = tokens.map((line, index) => ({
            id: `${index}-${line.map(token => token.content).join('')}`,
            line,
            index
          }));

          return (
            <pre
              className={cn(
                className,
                "overflow-hidden pl-5 pt-4 text-sm",
                thumbnail && "pl-1 pt-1 text-[4px] leading-[6px]",
              )}
              style={style}
            >
              <AnimatePresence initial={false}>
                {uniqueTokens.map(({ id, line, index }) => {
                  const isNewLine = !prevTokensRef.current.some(prevLine => 
                    prevLine.every((token, i) => token.content === line[i]?.content)
                  );
                  const isExiting = exitingLines.has(id);
                  const lineDiffType = diffMap?.lineDiff[index] || "unchanged";

                  prevTokensRef.current[index] = line;

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
  }

HighlightCode.displayName = "HighlightCode";

