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

export default function SettingsFooter() {
  const {
    padding,
    radius,
    language,
    theme,
    background,
    setPadding,
    setRadius,
    setLanguage,
    setTheme,
    setBackground,
  } = useSettingsStore();

  const availableThemes = Object.keys(themes);

  return (
    <footer className="bottom-0 border-t bg-background p-4">
      <div className="container mx-auto flex flex-col items-center justify-center gap-8 sm:flex-row">
        <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Background</span>
            <Select value={background} onValueChange={setBackground}>
              <SelectTrigger className="h-8 w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transparent">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full border-2 border-gray-500 bg-transparent"></span>
                    None
                  </div>
                </SelectItem>
                <SelectItem value="linear-gradient(to right, #3b82f6, #9333ea, #ec4899)">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{
                        background:
                          "linear-gradient(to right, #3b82f6, #9333ea, #ec4899)",
                      }}
                    ></span>
                    Default
                  </div>
                </SelectItem>
                <SelectItem value="linear-gradient(to right, #9333ea, #ec4899, #3b82f6)">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{
                        background:
                          "linear-gradient(to right, #9333ea, #ec4899, #3b82f6)",
                      }}
                    ></span>
                    Default2
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Radius</span>
            <Select value={radius} onValueChange={setRadius}>
              <SelectTrigger className="h-8 w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rounded-none">None</SelectItem>
                <SelectItem value="rounded-[10px]">Small</SelectItem>
                <SelectItem value="rounded-[14px]">Medium</SelectItem>
                <SelectItem value="rounded-[18px]">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Language</span>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="h-8 w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="markup">Markup</SelectItem>
                <SelectItem value="jsx">JSX</SelectItem>
                <SelectItem value="tsx">TSX</SelectItem>
                <SelectItem value="swift">Swift</SelectItem>
                <SelectItem value="kotlin">Kotlin</SelectItem>
                <SelectItem value="objectivec">Objective-C</SelectItem>
                <SelectItem value="js-extras">JS-Extras</SelectItem>
                <SelectItem value="reason">Reason</SelectItem>
                <SelectItem value="rust">Rust</SelectItem>
                <SelectItem value="graphql">GraphQL</SelectItem>
                <SelectItem value="yaml">YAML</SelectItem>
                <SelectItem value="go">GO</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="markdown">Markdown</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
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

          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Padding</span>
            <div className="flex gap-2">
              {["4", "6", "12"].map((size) => (
                <Button
                  key={size}
                  variant={padding == `p-${size}` ? "secondary" : "ghost"}
                  className="h-8 px-2 text-xs"
                  onClick={() => setPadding(`p-${size}`)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
