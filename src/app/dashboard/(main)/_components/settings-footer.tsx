"use client";

import { Fragment, useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/zustand/useSettingsStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { themes } from "prism-react-renderer";
import { backgroundOptions } from "@/constants/backgroundThemes";
import { Switch } from "@/components/ui/switch";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { GradientPicker } from "@/components/ui/gradient-picker";
import { parseGradient } from "@/helpers/parse-gradient";
import { AVAILABLE_CARD_THEMES, LANGUAGE_OPTIONS } from "@/constants/themes";
import { useUIStore } from "@/zustand/useUIStore";
import type { GradientStop } from "@/types/animated.type";
import { isPatternOrImage } from "@/helpers/isPatternOrImage";

const CUSTOM_GRADIENT = "custom";

export default function DraggableFooter() {
  const {
    width,
    radius,
    language,
    themeName,
    background,
    withLineIndex,
    cardTheme,
    autoPlayInterval,
    transitionDuration,
    transitionDelay,
    setWidth,
    setRadius,
    setLanguage,
    setThemeName,
    setBackground,
    setCardTheme,
    setWithLineIndex,
    setAutoPlayInterval,
    setTransitionDuration,
    setTransitionDelay,
  } = useSettingsStore();

  const [isExpanded, setExpanded] = useState(false);
  const [gradient, setGradient] = useState(() => {
    // Ensure gradient is always parsed correctly
    const parsedGradient = parseGradient(background);
    return parsedGradient.length > 0
      ? parsedGradient
      : [
          { color: "#FFFFFF", position: 0 },
          { color: "#000000", position: 100 },
        ];
  });

  const { isEditing } = useUIStore();

  const availableThemes = Object.keys(themes);
  const filteredThemes = availableThemes.filter(
    (theme) => theme !== "synthwave84"
  );

  const handleGradientChange = (newGradient: GradientStop[]) => {
    setGradient(newGradient);
    const newBackground = `linear-gradient(to right, ${newGradient
      .sort((a, b) => a.position - b.position)
      .map(({ color, position }) => `${color} ${position}%`)
      .join(", ")})`;
    setBackground(newBackground);
  };

  const handleBackgroundSelect = (value: string) => {
    setBackground(value);
    if (value.includes("linear-gradient") && !value.includes("url(")) {
      const parsedGradient = parseGradient(value);
      if (parsedGradient.length >= 2) {
        setGradient(parsedGradient);
      }
    }
  };

  const toggleFooterSize = () => setExpanded((prev) => !prev);

  const selectedOption = useMemo(() => {
    const allOptions = backgroundOptions.flatMap((group) => group.options);
    return (
      allOptions.find((option) => option.value === background)?.value ||
      CUSTOM_GRADIENT
    );
  }, [background]);

  useEffect(() => {
    if (isEditing) {
      setExpanded(false);
    }
  }, [isEditing]);

  return (
    <>
      <footer
        className={cn(
          "bottom-0 left-0 w-full border-t bg-background transition-[height] duration-500",
          isExpanded ? "h-full lg:h-80" : "h-12"
        )}
      >
        <div className="container m-1.5 mx-auto cursor-pointer text-center text-sm font-medium">
          <div className="mx-auto flex items-center justify-center">
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleFooterSize}
              disabled={isEditing}
            >
              {isExpanded ? <ChevronsDown /> : <ChevronsUp />}
            </Button>
          </div>
        </div>
        <div className="mx-auto max-w-5xl p-8 pt-2">
          <div className="flex flex-col">
            <div className="flex justify-end"></div>
            <div className="mt-4 items-center justify-center">
              <div className="grid grid-cols-2 gap-12 max-lg:gap-y-4 lg:grid-cols-5">
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      Card Theme
                    </span>
                    <Select value={cardTheme} onValueChange={setCardTheme}>
                      <SelectTrigger className="h-8 w-full sm:w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_CARD_THEMES.map(({ value, label }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">Theme</span>
                    <Select value={themeName} onValueChange={setThemeName}>
                      <SelectTrigger className="h-8 w-full sm:w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredThemes.map((themeName) => (
                          <SelectItem key={themeName} value={themeName}>
                            {themeName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      Background
                    </span>
                    <Select
                      value={selectedOption}
                      onValueChange={handleBackgroundSelect}
                    >
                      <SelectTrigger className="h-8 w-full sm:w-[140px]">
                        <SelectValue placeholder="Select background">
                          {selectedOption === CUSTOM_GRADIENT
                            ? "Custom"
                            : backgroundOptions
                                .flatMap((group) => group.options)
                                .find((opt) => opt.value === selectedOption)
                                ?.label}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {backgroundOptions.map(({ group, options }) => (
                          <Fragment key={group}>
                            <div className="px-2 py-1 text-sm font-medium text-muted-foreground">
                              {group}
                            </div>
                            {options.map(({ value, label }) => (
                              <SelectItem key={value} value={value}>
                                <div className="flex items-center gap-2">
                                  <span
                                    className="h-3 w-3 rounded-full"
                                    style={{ background: value }}
                                  />
                                  {label}
                                </div>
                              </SelectItem>
                            ))}
                          </Fragment>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      Gradient picker
                    </span>
                    <GradientPicker
                      value={gradient}
                      onChange={handleGradientChange}
                      direction="to right"
                      className="sm:w-[140px]"
                      disabled={isPatternOrImage(background)}
                    />
                    {isPatternOrImage(background) && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Pattern selected. Use the background dropdown to change.
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      Language
                    </span>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="h-8 w-full sm:w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGE_OPTIONS.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      Line index
                    </span>
                    <Switch
                      checked={withLineIndex}
                      onCheckedChange={setWithLineIndex}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-muted-foreground">
                        Width
                      </span>
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
                      <span className="text-sm text-muted-foreground">
                        Radius
                      </span>
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
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-muted-foreground">
                        Interval
                      </span>
                      <output className="text-sm tabular-nums text-muted-foreground">
                        {autoPlayInterval}
                      </output>
                    </div>
                    <Slider
                      min={0}
                      max={5}
                      step={0.1}
                      value={[autoPlayInterval]}
                      onValueChange={([value]) => setAutoPlayInterval(value!)}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-muted-foreground">
                        Line duration
                      </span>
                      <output className="text-sm tabular-nums text-muted-foreground">
                        {transitionDuration}
                      </output>
                    </div>
                    <Slider
                      min={0}
                      max={1}
                      step={0.01}
                      value={[transitionDuration]}
                      onValueChange={([value]) => setTransitionDuration(value!)}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-muted-foreground">
                        Token delay
                      </span>
                      <output className="text-sm tabular-nums text-muted-foreground">
                        {transitionDelay}
                      </output>
                    </div>
                    <Slider
                      min={0}
                      max={0.25}
                      step={0.01}
                      value={[transitionDelay]}
                      onValueChange={([value]) => setTransitionDelay(value!)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
