import { SidebarCard } from "@/app/dashboard/(main)/_components/sidebar-card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PauseIcon, PlayIcon } from "lucide-react";
import { DiffResult } from "types/code-presentation.type";
import { cn } from "@/lib/utils";
import { HighlightCode } from "@/app/dashboard/(main)/_components/code-presentation/_components/highlight-code";
import { getThemeStyles } from "@/helpers/get-theme-styles";
import { CardHeader } from "@/app/dashboard/(main)/_components/code-presentation/_components/card-header";
import { computeDiff } from "@/helpers/code-diff";

const slides = [
  {
    id: 0,
    code: "function counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      Count: {count}\n    </div>\n  );\n}",
    file_name: "",
    description: "",
  },
  {
    id: 1,
    code: "function counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <h1>Count: {count}</h1>\n    </div>\n  );\n}",
    file_name: "",
    description: "",
  },
  {
    id: 2,
    code: "function counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <h1>Count: {count}</h1>\n <button>+1</button>\n   </div>\n  );\n}",
    file_name: "",
    description: "",
  },
];

const name = "";
const description = "";
const DEFAULT_THEME_NAME = "vsDark";
const initialThemeStyles = getThemeStyles(DEFAULT_THEME_NAME);

interface Settings {
  name: string;
  background: string;
  width: number;
  radius: number;
  language: string;
  withLineIndex: boolean;
  cardTheme: string;
  themeName: string;
  theme: any;
  themeStyles?: {
    bg: string;
    border: string;
    text: string;
  };
  selectedThemeId: string | null;
}
type Props = {
  autoPlayInterval?: number;
};

export default function LandingPresentation({
  autoPlayInterval = 1500,
}: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [radius, setRadius] = useState(10);
  const [width, setWidth] = useState(500);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const initialState: Settings = {
    background: "linear-gradient(to right, #3b82f6, #9333ea, #ec4899)",
    width: 500,
    radius: 10,
    language: "tsx",
    withLineIndex: true,
    cardTheme: "default",
    themeName: DEFAULT_THEME_NAME,
    theme: initialThemeStyles.theme,
    themeStyles: initialThemeStyles.styles,
    name: "",
    selectedThemeId: null,
  };

  const [diffMap, setDiffMap] = useState<DiffResult>({
    lineDiff: {},
    oldTokens: [],
    newTokens: [],
  });
  const currentCode = useMemo(
    () => slides[currentSlide]?.code ?? "",
    [slides, currentSlide],
  );
  const handleDeleteSlide = (id: number) => {
    console.log(id);
    const handleSlideChange = useCallback(
      (direction: "next" | "prev") => {
        const newIndex =
          direction === "next"
            ? Math.min(currentSlide + 1, slides.length - 1)
            : Math.max(currentSlide - 1, 0);

        if (newIndex !== currentSlide) {
          if (slides[newIndex] && slides[currentSlide]) {
            const newDiff = computeDiff(
              slides[currentSlide].code,
              slides[newIndex].code,
            );
            setDiffMap(newDiff);
            setCurrentSlide(newIndex);
          }
        }
      },
      [currentSlide, slides, setCurrentSlide],
    );

    useEffect(() => {
      let interval: NodeJS.Timeout;
      if (isAutoPlaying) {
        interval = setInterval(() => {
          if (currentSlide < slides.length - 1) {
            handleSlideChange("next");
          } else {
            setIsAutoPlaying(false);
            setDiffMap({
              lineDiff: {},
              oldTokens: [],
              newTokens: [],
            });
          }
        }, autoPlayInterval);
      }

      return () => clearInterval(interval);
    }, [
      isAutoPlaying,
      currentSlide,
      slides.length,
      autoPlayInterval,
      handleSlideChange,
      setIsAutoPlaying,
    ]);
  };
  return (
    <div className="z-50 flex h-full border border-primary">
      <div className="h-full w-36">
        <div className="z-50 flex h-full flex-col">
          <div className="space-y-2 p-2 text-left">
            {slides.map((slide, index) => (
              <SidebarCard
                key={slide.id}
                slide={slide}
                index={index}
                currentSlide={currentSlide}
                setCurrentSlide={setCurrentSlide}
                handleDeleteSlide={handleDeleteSlide}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex w-3/4 flex-1 flex-col justify-between overflow-auto bg-background">
        <div className="p-4 lg:p-6">
          <div className="text-left">
            <div>
              <div className="mx-auto w-full max-w-3xl">
                <motion.div className="space-y-4 rounded-lg p-4">
                  {name && (
                    <div className="mb-4 space-y-2">
                      <h2 className="text-2xl font-bold">{name}</h2>
                      {description && (
                        <p className="text-muted-foreground">{description}</p>
                      )}
                    </div>
                  )}
                  <div className="relative flex items-center justify-center overflow-hidden rounded-sm">
                    <div className="hidden sm:block">
                      <div
                        className={cn(
                          "relative overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-12 transition-all duration-300 ease-in-out",
                        )}
                        style={{
                          background: initialState.background,
                          width: width,
                        }}
                      >
                        <div
                          className={cn("p-1 shadow-xl")}
                          style={{
                            background: initialState.themeStyles?.bg,
                            borderRadius: radius,
                          }}
                        >
                          <CardHeader
                            cardTheme={initialState.cardTheme}
                            themeBorder={initialState.themeStyles?.border}
                            themeText={initialState.themeStyles?.text}
                          />

                          <HighlightCode
                            currentCode={currentCode}
                            language={initialState.language}
                            currentSlide={currentSlide}
                            diffMap={diffMap}
                          />
                          <div className="py-2" />
                        </div>
                      </div>
                    </div>
                    <div className="block sm:hidden">
                      <p className="mx-2 my-6 max-w-2xl text-center text-base font-light tracking-tight dark:text-zinc-300">
                        Flip your phone to see preview card.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center max-sm:hidden">
                    <div className="mt-4 flex items-center space-x-4">
                      <Button
                        onClick={() => {
                          setCurrentSlide(0);
                          setIsAutoPlaying(!isAutoPlaying);
                        }}
                        aria-label={isAutoPlaying ? "Pause" : "Play"}
                        disabled={isAutoPlaying}
                        variant="ghost"
                        size="icon"
                      >
                        {isAutoPlaying ? (
                          <PauseIcon className="h-4 w-4" />
                        ) : (
                          <PlayIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <footer className="bottom-0 left-0 w-full border-t bg-background transition-[height] duration-500">
          <div className="container mx-auto p-8 pt-2">
            <div className="flex items-center justify-center gap-12 py-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-evenly gap-2">
                  <span className="text-sm text-muted-foreground">Width</span>
                  <output className="text-sm tabular-nums text-muted-foreground">
                    {width}
                  </output>
                </div>
                <Slider
                  min={0}
                  max={1500}
                  step={1}
                  value={[Number(width)]}
                  onValueChange={([value]) => setWidth(value!)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-muted-foreground">Radius</span>
                  <output className="text-sm tabular-nums text-muted-foreground">
                    {radius}
                  </output>
                </div>
                <Slider
                  min={0}
                  max={35}
                  step={1}
                  value={[Number(radius)]}
                  onValueChange={([value]) => setRadius(value!)}
                />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
