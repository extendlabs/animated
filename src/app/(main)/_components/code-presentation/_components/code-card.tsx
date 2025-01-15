import { cn } from "@/lib/utils";
import { HighlightCode } from "./highlight-code";
import { type DiffResult } from "types/code-presentation.type";
import { CardHeader } from "./card-header";
import { useSettingsStore } from "@/zustand/useSettingsStore";
import ExtendUILogo from "@/app/_components/logo";
import { useAuthStore } from "@/zustand/useAuthStore";
import FadeUp from "@/components/fadeup";

type Props = {
  currentCode: string;
  currentSlide: number;
  diffMap: DiffResult | null;
  themeBackground?: string;
  themeBorder?: string;
  themeText?: string;
};

export const CodeCard = ({
  currentCode,
  currentSlide,
  diffMap,
  themeBackground,
  themeBorder,
  themeText,
}: Props) => {
  const { padding, radius, language, theme, background, cardTheme } =
    useSettingsStore();

  const { subscribed } = useAuthStore()

  console.log(subscribed)

  return (
    <>
      <div className="hidden sm:block">
        <div
          className={cn(
            "relative overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-in-out",
          )}
          style={{ background: background, padding: padding }}
        >
          {!subscribed && (
            <div className="absolute bottom-2 right-2 text-white">
              <ExtendUILogo />
            </div>
          )}
          <div
            className={cn("p-1 shadow-xl")}
            style={{
              background: themeBackground,
              borderRadius: radius,
            }}
          >
            <CardHeader
              cardTheme={cardTheme}
              themeBorder={themeBorder}
              themeText={themeText}
            />

            <HighlightCode
              theme={theme}
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
