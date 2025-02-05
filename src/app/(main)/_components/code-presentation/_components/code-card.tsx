import { CardHeader } from "./card-header";
import { HighlightCode } from "./highlight-code";
import { useSettingsStore } from "@/zustand/useSettingsStore";
import { type DiffResult } from "types/code-presentation.type";

type Props = {
  currentCode: string;
  currentSlide: number;
  diffMap: DiffResult | null;
};

export const CodeCard = ({ currentCode, currentSlide, diffMap }: Props) => {
  const { width, radius, language, cardTheme, themeStyles } = useSettingsStore();


  return (
    <>
      <div className="hidden sm:block">
        <div className="relative overflow-hidden will-change-[height] my-10 shadow-lg mx-auto transition-all duration-500 ease-in-out"
          style={{ width: width, borderRadius: radius, }}>

          <div className="p-1   will-change-[height] transition-[height] duration-500 ease-in-out"
            style={{
              background: themeStyles?.bg,
              borderRadius: radius,
            }}>
            <CardHeader
              cardTheme={cardTheme}
              themeBorder={themeStyles?.border}
              themeText={themeStyles?.text}
            />
            <div className="will-change-[height] transition-[height] duration-500 ease-in-out">
              <HighlightCode
                currentCode={currentCode}
                language={language}
                currentSlide={currentSlide}
                diffMap={diffMap}
              />
            </div>
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