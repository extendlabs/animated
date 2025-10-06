import { CardHeader } from "./card-header";
import { HighlightCode } from "./highlight-code";
import { useSettingsStore } from "@/zustand/useSettingsStore";
import { type DiffResult } from "types/code-presentation.type";
import { useEffect, useRef, useState } from "react";
import { useUIStore } from "@/zustand/useUIStore";
import Watermark from "@/app/_components/watermark";

type Props = {
  currentCode: string;
  currentSlide: number;
  diffMap: DiffResult | null;
};

export const CodeCard = ({ currentCode, currentSlide, diffMap }: Props) => {
  const { width, radius, language, cardTheme, themeStyles } =
    useSettingsStore();
  const { isAutoPlaying } = useUIStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  useEffect(() => {
    updateHeight();
    const timeoutId = setTimeout(updateHeight, 10);
    return () => clearTimeout(timeoutId);
  }, [currentCode, currentSlide, isAutoPlaying]);

  const updateHeight = () => {
    if (measureRef.current) {
      const height = measureRef.current.scrollHeight;
      const extraPadding = 20;
      setContainerHeight(height + extraPadding);
    }
  };
  // const limitations = useSubscriptionLimitations(subscriptionStatus);
  const limitations = {
    proUser: true,
  };

  return (
    <>
      <div className="hidden sm:block">
        <div
          ref={containerRef}
          className="relative mx-auto my-10 overflow-hidden transition-[height] duration-500 ease-in-out will-change-[height]"
          style={{
            width: width,
            borderRadius: radius,
            height: containerHeight > 0 ? `${containerHeight}px` : "auto",
          }}
        >
          <div
            className="p-1"
            style={{
              background: themeStyles?.bg,
              borderRadius: radius,
            }}
          >
            <CardHeader
              cardTheme={cardTheme}
              themeBorder={themeStyles?.border}
              themeText={themeStyles?.text}
            />
            <div className="overflow-hidden transition-[height] duration-500 ease-in-out will-change-[height]">
              <HighlightCode
                currentCode={currentCode}
                language={language}
                currentSlide={currentSlide}
                diffMap={diffMap}
              />
            </div>
            {!limitations.proUser && (
              <div className="absolute bottom-6 right-0">
                <Watermark />
              </div>
            )}
            <div className="py-2" />
          </div>

          {/* Hidden measurement div */}
          <div
            ref={measureRef}
            className="pointer-events-none absolute left-0 top-0 p-1 opacity-0"
            style={{ width: "100%" }}
          >
            <div style={{ height: "40px" }} /> {/* Estimate of header height */}
            <div>
              <pre className="pl-5 pt-4 text-sm">
                {currentCode.split("\n").map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </pre>
            </div>
            <div className="py-2" />
          </div>
        </div>
      </div>
      <div className="block sm:hidden">
        <p className="mx-2 my-6 max-w-2xl text-center text-base font-light tracking-tight dark:text-zinc-300">
          Flip your phone to see preview card.
        </p>
      </div>
    </>
  );
};
