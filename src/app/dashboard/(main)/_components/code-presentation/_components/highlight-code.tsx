import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Highlight, themes } from "prism-react-renderer";
import { AnimatePresence } from "framer-motion";
import { type DiffResult } from "types/code-presentation.type";
import { AnimatedLine } from "./animated-line";
import { useUIStore } from "@/zustand/useUIStore";
import { useSettingsStore } from "@/zustand/useSettingsStore";
type Props = {
  currentCode: string;
  language: string;
  currentSlide: number;
  diffMap: DiffResult | null;
  thumbnail?: boolean;
};
export const HighlightCode = ({
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

  const { isAutoPlaying } = useUIStore();
  const { themeName } = useSettingsStore((state) => state);
  const { withLineIndex } = useSettingsStore((state) => state);



  const theme = themes[themeName as keyof typeof themes] || themes.vsDark;

  return (
    <Highlight theme={theme} code={currentCode} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => {
        const currentLines = tokens.map((line) =>
          line.map((token) => token.content).join(""),
        );
        return (
          <pre
            className={cn(
              className,
              "overflow-hidden pl-5 pt-4 text-sm",
              thumbnail && "pl-1 pt-1 text-[5px] leading-[6px]",
            )}
            style={style}
          >
            {!isAutoPlaying ? (
              <div>
                {tokens.map((line, index) => {
                  const lineContent = currentLines[index];
                  return (
                    <div key={`${index}-${lineContent}-notAnimated`}>
                      {withLineIndex && (
                        <span
                          className={cn(
                            "mr-4 select-none text-gray-500",
                            thumbnail && "mr-3",
                          )}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      )}
                      {line.map((token) => (
                        <span
                          {...getTokenProps({ token })}
                          key={crypto.randomUUID()}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {tokens.map((line, index) => {
                  const lineContent = currentLines[index];
                  const isNewLine =
                    index >= prevTokensRef.current.length ||
                    prevTokensRef.current[index] !== lineContent;
                  const isExiting = exitingLines.has(index);
                  const lineDiffType = diffMap?.lineDiff[index];
                  const disableAnimations = !isAutoPlaying;
                  return (
                    <AnimatedLine
                      key={`${index}-${lineContent}`}
                      line={line}
                      lineIndex={index}
                      isNewLine={isNewLine}
                      isExiting={isExiting}
                      diffType={lineDiffType}
                      thumbnail={thumbnail}
                      disableAnimations={disableAnimations}
                      getLineProps={getLineProps}
                      getTokenProps={getTokenProps}
                    />
                  );
                })}
              </AnimatePresence>
            )}
          </pre>
        );
      }}
    </Highlight>
  );
};
HighlightCode.displayName = "HighlightCode";
