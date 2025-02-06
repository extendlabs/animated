"use client";

import React, { Fragment, useState, useMemo } from "react";
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
import { useAuthStore } from "@/zustand/useAuthStore";
import { GradientPicker } from "@/components/ui/gradient-picker";
import { parseGradient } from "@/helpers/parse-gradient";
import { AVAILABLE_CARD_THEMES, LANGUAGE_OPTIONS } from "@/constants/themes";
import useSubscriptionLimitations from "@/hooks/use-subscription-limitation";
import { SaveThemeDialog } from "./save-theme-dialog";

const CUSTOM_GRADIENT = "custom";

export type GradientStop = {
  color: string;
  position: number;
};

export default function DraggableFooter() {
  const {
    width,
    radius,
    language,
    name,
    themeName,
    background,
    withLineIndex,
    cardTheme,
    setWidth,
    setRadius,
    setLanguage,
    setThemeName,
    setBackground,
    setCardTheme,
    setWithLineIndex,
  } = useSettingsStore();

  const { subscription } = useAuthStore();
  const [isExpanded, setExpanded] = useState(false);
  const [gradient, setGradient] = useState(() => parseGradient(background));
  const availableThemes = Object.keys(themes);

  const handleGradientChange = (newGradient: GradientStop[]) => {
    setGradient(newGradient);
    const newBackground = `linear-gradient(to right, ${newGradient.map(({ color }) => color).join(", ")})`;
    setBackground(newBackground);
  };

  const handleBackgroundSelect = (value: string) => {
    setBackground(value);
    if (value.includes("linear-gradient")) {
      const colors = value.match(/#[a-fA-F0-9]{6}/g) || [];
      const maxColors = Math.min(colors.length, 5);
      if (colors.length >= 2) {
        const gradientColors = colors
          .slice(0, maxColors)
          .map((color: any, index: number) => {
            const position = Math.floor((index / (maxColors - 1)) * 100);
            return { color, position };
          });
        setGradient(gradientColors);
      }
    }
  };

  const toggleFooterSize = () => setExpanded((prev) => !prev);

  const limitations = useSubscriptionLimitations(subscription);

  const selectedOption = useMemo(() => {
    const allOptions = backgroundOptions.flatMap((group) => group.options);
    return (
      allOptions.find((option) => option.value === background)?.value ||
      CUSTOM_GRADIENT
    );
  }, [background]);

  return (
    <>
      <footer
        className={cn(
          "bottom-0 left-0 w-full border-t bg-background transition-[height] duration-500",
          isExpanded ? "h-full lg:h-64" : "h-12",
        )}
      >
        <div className="container m-1.5 mx-auto cursor-pointer text-center text-sm font-medium">
          <div className="mx-auto flex items-center justify-center">
            <Button size="icon" variant="ghost" onClick={toggleFooterSize}>
              {isExpanded ? <ChevronsDown /> : <ChevronsUp />}
            </Button>
          </div>
        </div>
        <div className="container mx-auto p-8 pt-2">
          {(limitations.proUser === true || limitations.subUser === true) && (
            <div className="mb-2 flex gap-2">
              <SaveThemeDialog />
              {name && <SaveThemeDialog forceCreate />}
            </div>
          )}
          <div className="flex flex-col items-center justify-center">
            <div className="grid grid-cols-2 gap-12 max-lg:gap-y-4 lg:grid-cols-4">
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">
                    Card Theme
                  </span>
                  <Select
                    value={cardTheme}
                    onValueChange={setCardTheme}
                    disabled={!limitations.subUser}
                  >
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
                  <Select
                    value={themeName}
                    onValueChange={setThemeName}
                    disabled={!limitations.subUser}
                  >
                    <SelectTrigger className="h-8 w-full sm:w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableThemes.map((themeName) => (
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
                    disabled={!limitations.subUser}
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
                    disabled={!limitations.proUser}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">
                    Language
                  </span>
                  <Select
                    value={language}
                    onValueChange={setLanguage}
                    disabled={!limitations.subUser}
                  >
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
                    disabled={!limitations.subUser}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
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
                    disabled={!limitations.subUser}
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
                    disabled={!limitations.subUser}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
