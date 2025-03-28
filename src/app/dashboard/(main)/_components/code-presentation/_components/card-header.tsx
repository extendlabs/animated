"use client";

import type React from "react";

import { useState } from "react";
import {
  Minus,
  Square,
  X,
  Menu,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  Terminal,
  Code,
  FileText,
  Settings,
  Bookmark,
  Coffee,
  Command,
  Zap,
} from "lucide-react";
import { useUIStore } from "@/zustand/useUIStore";

type Props = {
  themeBorder?: string;
  themeText?: string;
  cardTheme: string;
};

export const CardHeader = ({ cardTheme, themeBorder, themeText }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const { fileName, setFileName, isAutoPlaying } = useUIStore();

  const headerStyles = {
    borderColor: themeBorder,
    color: themeText,
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
    }
  };

  const renderFileName = () => {
    if (isEditing) {
      return (
        <input
          type="text"
          value={fileName}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="border-none bg-transparent text-center text-sm focus:outline-none"
          style={{ color: themeText }}
        />
      );
    }
    return isAutoPlaying ? (
      <div className="text-sm" style={{ color: themeText }}>
        {fileName}
      </div>
    ) : (
      <div
        className="cursor-pointer text-sm"
        style={{ color: themeText }}
        onClick={() => setIsEditing(true)}
      >
        {fileName}
      </div>
    );
  };

  const renderHeaderContent = () => {
    switch (cardTheme) {
      case "minimal":
        return <div className="pt-[7px]" />;
      case "defaultColorLess":
        return (
          <div
            className="flex items-center justify-between border-b px-4 py-3"
            style={headerStyles}
          >
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((dot) => (
                <div
                  key={dot}
                  className="h-3 w-3 rounded-full bg-slate-500/50"
                />
              ))}
            </div>
            {renderFileName()}
            <div className="w-[62px]" />
          </div>
        );
      case "default":
        return (
          <div
            className="flex items-center justify-between border-b px-4 py-3"
            style={headerStyles}
          >
            {/* Left section with dots */}
            <div className="flex w-[62px] items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>

            {/* Center section with filename - now with flex-1 and proper centering */}
            <div className="flex flex-1 items-center justify-center">
              {renderFileName()}
            </div>

            {/* Right spacer matching left width */}
            <div className="w-[62px]" />
          </div>
        );
      case "leftName":
        return (
          <div
            className="flex items-center justify-start border-b px-4 py-3"
            style={headerStyles}
          >
            {renderFileName()}
          </div>
        );
      case "centerName":
        return (
          <div
            className="flex items-center justify-center border-b px-4 py-3"
            style={headerStyles}
          >
            {renderFileName()}
          </div>
        );
      case "rightName":
        return (
          <div
            className="flex items-center justify-end border-b px-4 py-3"
            style={headerStyles}
          >
            {renderFileName()}
          </div>
        );
      case "window":
        return (
          <div
            className="flex items-center justify-between border-b px-4 py-3"
            style={headerStyles}
          >
            <div className="w-[80px]" />
            {renderFileName()}
            <div className="flex items-center gap-3">
              <Minus className="h-3.5 w-3.5" style={{ color: themeText }} />
              <Square className="h-3.5 w-3.5" style={{ color: themeText }} />
              <X className="h-3.5 w-3.5" style={{ color: themeText }} />
            </div>
          </div>
        );

      case "terminal":
        return (
          <div
            className="flex items-center justify-between border-b px-4 py-2"
            style={headerStyles}
          >
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4" style={{ color: themeText }} />
              <div className="font-mono text-sm" style={{ color: themeText }}>
                {renderFileName()}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Minus className="h-3.5 w-3.5" style={{ color: themeText }} />
              <X className="h-3.5 w-3.5" style={{ color: themeText }} />
            </div>
          </div>
        );

      case "tabbed":
        return (
          <div className="border-b" style={headerStyles}>
            <div className="flex">
              <div className="relative rounded-t-md bg-slate-300 bg-opacity-20 px-4 py-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" style={{ color: themeText }} />
                  {renderFileName()}
                </div>
              </div>
              <div className="flex-1 border-b" style={headerStyles}></div>
            </div>
          </div>
        );

      case "modern":
        return (
          <div
            className="flex items-center justify-between border-b px-5 py-3.5"
            style={headerStyles}
          >
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
              <div className="h-2 w-2 rounded-full bg-green-500" />
            </div>
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4" style={{ color: themeText }} />
              {renderFileName()}
            </div>
            <div className="w-[62px]" />
          </div>
        );

      case "collapsible":
        return (
          <div className="border-b" style={headerStyles}>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <ChevronUp className="h-4 w-4" style={{ color: themeText }} />
                {renderFileName()}
              </div>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" style={{ color: themeText }} />
              </div>
            </div>
          </div>
        );

      case "toolbar":
        return (
          <div
            className="flex items-center justify-between border-b px-4 py-3"
            style={headerStyles}
          >
            <div className="flex items-center gap-3">
              <Menu className="h-4 w-4" style={{ color: themeText }} />
              {renderFileName()}
            </div>
            <div className="flex items-center gap-3">
              <Bookmark className="h-4 w-4" style={{ color: themeText }} />
              <MoreHorizontal
                className="h-4 w-4"
                style={{ color: themeText }}
              />
            </div>
          </div>
        );

      case "pill":
        return (
          <div className="px-4 pb-2 pt-4">
            <div
              className="flex items-center justify-center rounded-full bg-slate-200 bg-opacity-10 px-4 py-2 dark:bg-slate-700"
              style={headerStyles}
            >
              {renderFileName()}
            </div>
          </div>
        );

      case "gradient":
        return (
          <div
            className="flex items-center justify-between rounded-t-md border-b bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-4 py-3 dark:from-blue-500/20 dark:to-purple-500/20"
            style={headerStyles}
          >
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" style={{ color: themeText }} />
            </div>
            {renderFileName()}
            <div className="w-[24px]" />
          </div>
        );
      case "none":
        return <div className="pt-2" />;

      default:
        return null;
    }
  };

  return renderHeaderContent();
};
