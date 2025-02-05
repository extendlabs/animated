import { useState } from "react";
import { Minus, Square, X } from "lucide-react";
import { useUIStore } from "@/zustand/useUIStore";

type Props = {
  themeBorder?: string;
  themeText?: string;
  cardTheme: string;
};

export const CardHeader = ({ cardTheme, themeBorder, themeText }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const { fileName, setFileName } = useUIStore();

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
    return (
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
            <div className="flex items-center gap-2 w-[62px]">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>

            {/* Center section with filename - now with flex-1 and proper centering */}
            <div className="flex-1 flex items-center justify-center">
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
            <div className="flex items-center gap-4">
              <Minus className="h-4 w-4" style={{ color: themeText }} />
              <Square className="h-4 w-4" style={{ color: themeText }} />
              <X className="h-4 w-4" style={{ color: themeText }} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return renderHeaderContent();
};
