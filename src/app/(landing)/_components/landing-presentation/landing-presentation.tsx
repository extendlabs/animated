import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PauseIcon, PlayIcon } from "lucide-react";
import { type DiffResult } from "types/code-presentation.type";
import { HighlightCode } from "@/app/dashboard/(main)/_components/code-presentation/_components/highlight-code";
import { getThemeStyles } from "@/helpers/get-theme-styles";
import { computeDiff } from "@/helpers/code-diff";
import { CardHeader } from "@/app/dashboard/(main)/_components/code-presentation/_components/card-header";
import { SidebarCardLanding } from "./_components/landing-sidebar-card";
import SelectTrigger, {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { GradientPicker } from "@/components/ui/gradient-picker";
import { Switch } from "@/components/ui/switch";
import { parseGradient } from "@/helpers/parse-gradient";

export const slides = [
  {
    id: 0,
    code: "function Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <>\n      Count: {count}\n    </>\n  );\n}",
    file_name: "",
    description: "",
  },
  {
    id: 1,
    code: "function Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <>\n      <h1>Count: {count}</h1>\n    </>\n  );\n}",
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

export const initialState: Settings = {
  background: "linear-gradient(to right, #11998e, #38ef7d)",
  width: 800,
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
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const [diffMap, setDiffMap] = useState<DiffResult>({
    lineDiff: {},
    oldTokens: [],
    newTokens: [],
  });

  const currentCode = useMemo(
    () => slides[currentSlide]?.code ?? "",
    [slides, currentSlide]
  );

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
            slides[newIndex].code
          );
          setDiffMap(newDiff);
          setCurrentSlide(newIndex);
        }
      }
    },
    [currentSlide, slides, setCurrentSlide]
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

  return (
    <div className="z-50 flex h-full rounded border">
      <div className="h-full w-[15%] rounded-l-xl bg-sidebar">
        <div className="z-50 flex h-full flex-col">
          <div className="space-y-1.5 p-2 pr-3 pt-2 text-left">
            {slides.map((slide, index) => (
              <SidebarCardLanding
                key={slide.id}
                slide={slide}
                index={index}
                currentSlide={currentSlide}
                setCurrentSlide={setCurrentSlide}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex h-full w-[85%] flex-col rounded-r-xl border-b bg-background">
        <div className="flex-1 pt-8 text-left">
          <div className="mx-auto pl-1">
            <motion.div className="space-y-4 rounded-lg p-4">
              <div
                className="relative mx-auto w-[56%] items-center justify-center overflow-hidden rounded-md"
                style={{ background: initialState.background }}
              >
                <div className="hidden sm:block">
                  <div className="scale-80 relative mx-auto overflow-hidden rounded-md transition-all duration-500 ease-in-out will-change-[height]">
                    <div
                      className="m-12 rounded-md p-1 transition-[height] duration-500 ease-in-out will-change-[height]"
                      style={{
                        background: initialState.themeStyles?.bg,
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
                        isAutoPlayingProp={isAutoPlaying}
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
            </motion.div>
          </div>
        </div>
        <div className="mt-auto scale-75 items-center justify-center px-10 pb-4 text-left">
          <div className="mb-4 flex justify-center max-sm:hidden">
            <div className="flex items-center space-x-4">
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
          <div className="grid grid-cols-2 gap-12 max-lg:gap-y-4 lg:grid-cols-5">
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">
                  Card Theme
                </span>
                <Select value={"default"} disabled={true}>
                  <SelectTrigger className="h-8 w-full sm:w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Theme</span>
                <Select value={"vsDark"} disabled={true}>
                  <SelectTrigger className="h-8 w-full sm:w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vsDark">vsDark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">
                  Background
                </span>
                <Select value={"Emerald"} disabled={true}>
                  <SelectTrigger className="h-8 w-full sm:w-[140px]">
                    Emerald
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Emerald">Emerald</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">
                  Gradient picker
                </span>
                <GradientPicker
                  value={parseGradient(initialState.background)}
                  direction="to right"
                  className="sm:w-[140px]"
                  disabled={true}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Language</span>
                <Select value={"tsx"} disabled={true}>
                  <SelectTrigger className="h-8 w-full sm:w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tsx">tsx</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">
                  Line index
                </span>
                <Switch checked={true} disabled={true} />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-muted-foreground">Width</span>
                  <output className="text-sm tabular-nums text-muted-foreground">
                    500
                  </output>
                </div>
                <Slider
                  min={400}
                  max={700}
                  step={1}
                  value={[500]}
                  disabled={true}
                  className="cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-muted-foreground">Radius</span>
                  <output className="text-sm tabular-nums text-muted-foreground">
                    10
                  </output>
                </div>
                <Slider
                  min={0}
                  max={35}
                  step={1}
                  value={[10]}
                  disabled={true}
                  className="cursor-not-allowed"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-muted-foreground">
                    Interval
                  </span>
                  <output className="text-sm tabular-nums text-muted-foreground">
                    2
                  </output>
                </div>
                <Slider
                  min={0}
                  max={5}
                  step={0.1}
                  value={[2]}
                  disabled={true}
                  className="cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-muted-foreground">
                    Line duration
                  </span>
                  <output className="text-sm tabular-nums text-muted-foreground">
                    0.6
                  </output>
                </div>
                <Slider
                  min={0}
                  max={1}
                  step={0.01}
                  disabled={true}
                  value={[0.6]}
                  className="cursor-not-allowed"
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-muted-foreground">
                    Token delay
                  </span>
                  <output className="text-sm tabular-nums text-muted-foreground">
                    0.1
                  </output>
                </div>
                <Slider
                  min={0}
                  max={0.25}
                  step={0.01}
                  value={[0.1]}
                  disabled={true}
                  className="cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
