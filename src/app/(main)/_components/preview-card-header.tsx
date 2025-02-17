import React from "react";
import { Minus, Square, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { type CardTheme } from "types/code-presentation.type";

type Props = {
  cardTheme?: CardTheme;
  themeBorder?: string;
  themeText?: string;
  fileName?: string;
};

export const PreviewCardHeader = ({
  cardTheme = "default",
  themeBorder,
  themeText,
  fileName,
}: Props) => {
  const headerStyles = {
    borderColor: themeBorder,
    color: themeText,
  };

  const renderContent = () => {
    switch (cardTheme) {
      case "minimal":
        return <div className="pt-[3px]" />;

      case "defaultColorLess":
        return (
          <div
            className="flex items-center justify-between border-b px-2 py-0"
            style={headerStyles}
          >
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((dot) => (
                <div
                  key={dot}
                  className="h-1 w-1 rounded-full bg-slate-500/50"
                />
              ))}
            </div>
            <div className="text-[4px]">{fileName}</div>
            <div className="w-[20px]" />
          </div>
        );

      case "window":
        return (
          <div
            className="flex items-center justify-between border-b px-2 py-0"
            style={headerStyles}
          >
            <div className="w-[20px]" />
            <div className="text-[4px]">{fileName}</div>
            <div className="flex items-center gap-1">
              <Minus className="h-1 w-1" style={{ color: themeText }} />
              <Square className="h-1 w-1" style={{ color: themeText }} />
              <X className="h-1 w-1" style={{ color: themeText }} />
            </div>
          </div>
        );

      case "leftName":
        return (
          <div
            className="flex items-center justify-start border-b px-2 py-0"
            style={headerStyles}
          >
            <div className="text-[4px]">{fileName}</div>
          </div>
        );

      case "centerName":
        return (
          <div
            className="flex items-center justify-center border-b px-2 py-0"
            style={headerStyles}
          >
            <div className="text-[4px]">{fileName}</div>
          </div>
        );

      case "rightName":
        return (
          <div
            className="flex items-center justify-end border-b px-2 py-0"
            style={headerStyles}
          >
            <div className="text-[4px]">{fileName}</div>
          </div>
        );

      case "default":
      default:
        return (
          <div
            className="flex items-center justify-between border-b px-2 py-0"
            style={headerStyles}
          >
            <div className="flex items-center gap-1">
              <div className="h-1 w-1 rounded-full bg-red-500" />
              <div className="h-1 w-1 rounded-full bg-yellow-500" />
              <div className="h-1 w-1 rounded-full bg-green-500" />
            </div>
            <div className="text-[4px]">{fileName}</div>
            <div className="w-[20px]" />
          </div>
        );
    }
  };

  return (
    <div className={cn("leading-3")} style={headerStyles}>
      {renderContent()}
    </div>
  );
};
