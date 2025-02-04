import ExtendUILogo from "@/app/_components/logo";
import { CardHeader } from "./card-header";
import { HighlightCode } from "./highlight-code";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/zustand/useAuthStore";
import { useSettingsStore } from "@/zustand/useSettingsStore";
import { type DiffResult } from "types/code-presentation.type";

type Props = {
  currentCode: string;
  currentSlide: number;
  diffMap: DiffResult | null;
};

export const CodeCard = ({
  currentCode,
  currentSlide,
  diffMap,
}: Props) => {
  const {
    padding,
    radius,
    language,
    background,
    cardTheme,
    themeStyles
  } = useSettingsStore();

  const { subscription } = useAuthStore();

  return (
    <>
      <div className="hidden sm:block">
        <div
          className={cn(
            "relative overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-in-out",
          )}
          style={{ background: background, padding: padding }}
        >
          {!subscription && (
            <div className="absolute bottom-2 right-2 text-white">
              <ExtendUILogo />
            </div>
          )}
          <div
            className={cn("p-1 shadow-xl")}
            style={{
              background: themeStyles?.bg,
              borderRadius: radius,
            }}
          >
            <CardHeader
              cardTheme={cardTheme}
              themeBorder={themeStyles?.border}
              themeText={themeStyles?.text}
            />

            <HighlightCode
              currentCode={currentCode}
              language={language}
              currentSlide={currentSlide}
              diffMap={diffMap}
            />
            <div className="py-2" />
          </div>
        </div>
      </div>
      <div className="block sm:hidden">
        <p className="mx-2 my-6 max-w-2xl text-base text-center font-light tracking-tight dark:text-zinc-300">
          Flip your phone to see preview card.
        </p>
      </div>
    </>
  );
};