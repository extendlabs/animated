import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PauseIcon, PlayIcon, Trash } from "lucide-react";
import { CardTheme, DiffResult } from "types/code-presentation.type";
import { cn } from "@/lib/utils";
import { HighlightCode } from "@/app/dashboard/(main)/_components/code-presentation/_components/highlight-code";
import { getThemeStyles } from "@/helpers/get-theme-styles";
import { computeDiff } from "@/helpers/code-diff";
import { CodePreview } from "@/app/dashboard/(main)/_components/code-preview";
import { Slide } from "@/types/animated.type";
import { PreviewCardHeader } from "@/app/dashboard/(main)/_components/preview-card-header";

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
    code: "function counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <h1>Count: {count}</h1>\n      <h1>Count: {count}</h1>\n    </div>\n  );\n}",
    file_name: "",
    description: "",
  },
];

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

export default function LandingPresentation({
  autoPlayInterval = 1500,
}: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [radius, setRadius] = useState(10);
  const [width, setWidth] = useState(500);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

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
    <div className="z-50 flex h-full rounded border">
      <div className="h-full w-[15%] rounded-l bg-sidebar">
        <div className="z-50 flex h-full flex-col">
          <div className="space-y-1.5 p-2 pr-3 pt-2 text-left">
            {slides.map((slide, index) => (
              <SidebarCardLanding
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
      <div className="flex w-full flex-1 flex-col justify-between overflow-auto rounded-r bg-background">
        <div className="p-4 lg:p-6">
          <div className="text-left">
            <div className="mx-auto w-full max-w-3xl">
              <motion.div className="space-y-4 rounded-lg p-4">
                <div
                  className="relative flex items-center justify-center overflow-hidden rounded-md"
                  style={{ background: initialState.background }}
                >
                  <div className="hidden sm:block">
                    <div
                      className="relative mx-auto my-10 overflow-hidden shadow-lg transition-all duration-500 ease-in-out will-change-[height]"
                      style={{ width: width, borderRadius: radius }}
                    >
                      <div
                        className="p-1 transition-[height] duration-500 ease-in-out will-change-[height]"
                        style={{
                          background: initialState.themeStyles?.bg,
                          borderRadius: radius,
                        }}
                      >
                        <div className="flex items-center justify-between border-b px-4 py-3">
                          {/* Left section with dots */}
                          <div className="flex w-[62px] items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-red-500" />
                            <div className="h-3 w-3 rounded-full bg-yellow-500" />
                            <div className="h-3 w-3 rounded-full bg-green-500" />
                          </div>

                          {/* Center section with filename - now with flex-1 and proper centering */}
                          <div className="flex flex-1 items-center justify-center">
                            demo.tsx
                          </div>

                          {/* Right spacer matching left width */}
                          <div className="w-[62px]" />
                        </div>

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
                  min={400}
                  max={700}
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

function SidebarCardLanding({
  slide,
  index,
  currentSlide,
  setCurrentSlide,
  handleDeleteSlide,
}: {
  slide: Slide;
  index: number;
  currentSlide: number;
  setCurrentSlide: (id: number) => void;
  handleDeleteSlide: (id: number) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isCurrent = currentSlide === slide.id;

  return (
    <div
      key={slide.id}
      onClick={() => setCurrentSlide(slide.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative cursor-pointer overflow-hidden rounded-md transition-all duration-200"
    >
      <div
        className="relative aspect-[16/9] w-full"
        style={{ background: initialState.background }}
      >
        <CodePreviewLanding currentSlide={index} />
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-200",
            !isCurrent && "bg-black/50",
            isHovered && "bg-slate-300/30",
          )}
        />
        <div
          className={cn(
            "absolute right-0 top-0 p-2 transition-opacity duration-200",
            isHovered ? "opacity-100" : "opacity-0",
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSlide(slide.id);
            }}
            className="size-6 bg-transparent text-slate-300 transition-colors duration-200 hover:bg-transparent hover:text-red-500"
          >
            <Trash className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

const CodePreviewLanding = ({ currentSlide }: { currentSlide: number }) => {
  const themeStyles = getThemeStyles(initialState.themeName);

  const currentCode = useMemo(
    () => slides[currentSlide]?.code ?? "",
    [slides, currentSlide],
  );

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative h-[80px] w-full overflow-hidden rounded-md px-2 py-1 xl:h-[90px]">
        <div
          className="h-full rounded-sm"
          style={{ background: themeStyles.styles?.bg }}
        >
          <PreviewCardHeader
            cardTheme={initialState.cardTheme as CardTheme}
            themeBorder={themeStyles.styles?.border}
            themeText={themeStyles.styles?.text}
            fileName={"demo.tsx"}
          />
          <HighlightCode
            currentCode={currentCode}
            language={initialState.language}
            currentSlide={currentSlide}
            thumbnail
            diffMap={null}
          />
        </div>
      </div>
    </div>
  );
};
