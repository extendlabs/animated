import { cn } from "@/lib/utils";
import { Highlight, PrismTheme } from "prism-react-renderer";
import { AnimatePresence } from "framer-motion";
import { AnimatedLine } from "./animated-line";
import { type DiffResult } from "types/code-presentation.type";

type Props = {
  theme: PrismTheme;
  currentCode: string;
  language: string;
  currentSlide: number;
  diffMap: DiffResult | null;
  thumbnail?: boolean;
};

export const HighlightCode = ({
  theme,
  currentCode,
  language,
  currentSlide,
  diffMap,
  thumbnail,
}: Props) => {
  return (
    <Highlight theme={theme} code={currentCode} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={cn(
            className,
            "overflow-hidden pl-5 pt-4 text-sm",
            thumbnail && "pl-1 pt-1 text-[4px] leading-[6px]",
          )}
          style={style}
        >
          {!diffMap ? (
            tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span
                  className={cn(
                    "mr-4 select-none text-gray-500",
                    thumbnail && "mr-1",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {line.map((token) => (
                  <span
                    {...getTokenProps({ token })}
                    key={crypto.randomUUID()}
                  />
                ))}
              </div>
            ))
          ) : (
            <AnimatePresence mode="wait">
              {tokens.map((line, i) => (
                <AnimatedLine
                  key={`${currentSlide}-${i}`}
                  line={line}
                  lineIndex={i}
                  currentSlide={currentSlide}
                  diffType={diffMap.lineDiff[i]}
                  thumbnail
                  getLineProps={getLineProps}
                  getTokenProps={getTokenProps}
                />
              ))}
            </AnimatePresence>
          )}
        </pre>
      )}
    </Highlight>
  );
};
