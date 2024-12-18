import { Minus, Square, X } from "lucide-react";
import { type CardTheme } from "types/code-presentation.type";

type Props = {
  themeBorder?: string;
  themeText?: string;
  fileName: string;
  cardTheme: CardTheme;
};

export const CardHeader = ({
  cardTheme,
  themeBorder,
  themeText,
  fileName,
}: Props) => {
  const headerStyles = {
    borderColor: themeBorder,
    color: themeText,
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
            <div className="text-sm" style={{ color: themeText }}>
              {fileName}
            </div>
            <div className="w-[62px]" />
          </div>
        );
      case "default":
        return (
          <div
            className="flex items-center justify-between border-b px-4 py-3"
            style={headerStyles}
          >
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
            <div className="text-sm" style={{ color: themeText }}>
              {fileName}
            </div>
            <div className="w-[62px]" />
          </div>
        );
      case "leftName":
        return (
          <div
            className="flex items-center justify-start border-b px-4 py-3"
            style={headerStyles}
          >
            <div className="text-sm" style={{ color: themeText }}>
              {fileName}
            </div>
          </div>
        );
      case "centerName":
        return (
          <div
            className="flex items-center justify-center border-b px-4 py-3"
            style={headerStyles}
          >
            <div className="text-sm" style={{ color: themeText }}>
              {fileName}
            </div>
          </div>
        );
      case "rightName":
        return (
          <div
            className="flex items-center justify-end border-b px-4 py-3"
            style={headerStyles}
          >
            <div className="text-sm" style={{ color: themeText }}>
              {fileName}
            </div>
          </div>
        );
      case "window":
        return (
          <div
            className="flex items-center justify-between border-b px-4 py-3"
            style={headerStyles}
          >
            <div className="w-[80px]" />
            <div className="text-sm" style={{ color: themeText }}>
              {fileName}
            </div>
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
