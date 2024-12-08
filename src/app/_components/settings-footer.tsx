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

export default function SettingsFooter() {
  const {
    padding,
    radius,
    language,
    fileName,
    setPadding,
    setRadius,
    setLanguage,
    setFileName,
  } = useSettingsStore();

  return (
    <footer className={`bottom-0 border-t bg-background p-4`}>
      <div className="container mx-auto flex flex-col items-center justify-center gap-8 sm:flex-row">
        <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Radius</span>
            <Select value={radius} onValueChange={setRadius}>
              <SelectTrigger className="h-8 w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rounded-none">None</SelectItem>
                <SelectItem value="rounded-sm">Small</SelectItem>
                <SelectItem value="rounded-md">Medium</SelectItem>
                <SelectItem value="rounded-lg">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Padding</span>
            <div className="flex gap-2">
              {["4", "6", "12"].map((size) => (
                <Button
                  key={size}
                  variant={padding === `p-${size}` ? "secondary" : "ghost"}
                  className="h-8 px-2 text-xs"
                  onClick={() => setPadding(`p-${size}`)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">Language</span>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="h-8 w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jsx">JSX</SelectItem>
              <SelectItem value="tsx">TSX</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="swift">Swift</SelectItem>
              <SelectItem value="python">Python</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </footer>
  );
}
