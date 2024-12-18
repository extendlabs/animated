/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";

import * as React from "react";
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

export default function SettingsFooter() {
  const {
    padding,
    radius,
    language,
    theme,
    background,
    withLineIndex,
    cardTheme,
    setPadding,
    setRadius,
    setLanguage,
    setTheme,
    setBackground,
    setCardTheme,
    setWithLineIndex,
  } = useSettingsStore();

  const availableThemes = Object.keys(themes);

  const availableCardThemes = [
    { value: "default", label: "Default" },
    { value: "minimal", label: "Minimal" },
    { value: "defaultColorLess", label: "Color Less" },
    { value: "leftName", label: "Left Name" },
    { value: "centerName", label: "Center Name" },
    { value: "rightName", label: "Right Name" },
    { value: "window", label: "Window" },
  ];

  const radiusOptions = [
    { value: "rounded-none", label: "None" },
    { value: "rounded-[10px]", label: "Small" },
    { value: "rounded-[14px]", label: "Medium" },
    { value: "rounded-[18px]", label: "Large" },
  ];

  const languageOptions = [
    "markup",
    "jsx",
    "tsx",
    "swift",
    "kotlin",
    "objectivec",
    "js-extras",
    "reason",
    "rust",
    "graphql",
    "yaml",
    "go",
    "cpp",
    "markdown",
    "python",
    "json",
  ];

  const paddingOptions = ["4", "6", "12", "20"];

  return (
    <footer className="bottom-0 border-t bg-background p-8">
      <div className="container mx-auto flex flex-col items-center justify-center gap-8 sm:flex-row">
        <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-8">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">
                  Background
                </span>
                <Select value={background} onValueChange={setBackground}>
                  <SelectTrigger className="h-8 w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {backgroundOptions.map(({ group, options }) => (
                      <React.Fragment key={group}>
                        <div className="px-2 py-1 text-sm font-medium text-muted-foreground">
                          {group}
                        </div>
                        {options.map(({ value, label }) => (
                          <SelectItem key={value} value={value}>
                            <div className="flex items-center gap-2">
                              {value !== "transparent" && (
                                <span
                                  className="h-3 w-3 rounded-full"
                                  style={{ background: value }}
                                ></span>
                              )}
                              {label}
                            </div>
                          </SelectItem>
                        ))}
                      </React.Fragment>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-2 flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Radius</span>
                <Select value={radius} onValueChange={setRadius}>
                  <SelectTrigger className="h-8 w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {radiusOptions.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Language</span>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="h-8 w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-2 flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">
                  Card Theme
                </span>
                <Select value={cardTheme} onValueChange={setCardTheme}>
                  <SelectTrigger className="h-8 w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCardThemes.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Theme</span>
                <Select
                  value={
                    Object.keys(themes).find(
                      (key) => themes[key as keyof typeof themes] === theme,
                    ) ?? "vsDark"
                  }
                  onValueChange={(themeName: keyof typeof themes) =>
                    setTheme(themes[themeName])
                  }
                >
                  <SelectTrigger className="h-8 w-[140px]">
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
            <div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Padding</span>
                <div className="flex gap-2">
                  {paddingOptions.map((size) => (
                    <Button
                      key={size}
                      variant={padding == `p-${size}` ? "secondary" : "ghost"}
                      className="h-8 px-2 text-xs"
                      onClick={() => setPadding(`p-${size}`)}
                      size={"icon"}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mt-2 flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">
                  Line index
                </span>
                <div className="flex gap-2">
                  <Switch
                    id="line-index"
                    checked={withLineIndex}
                    onCheckedChange={setWithLineIndex}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
