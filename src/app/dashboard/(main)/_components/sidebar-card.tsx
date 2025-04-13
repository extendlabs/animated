import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";
import { CodePreview } from "./code-preview";
import { useSettingsStore } from "@/zustand/useSettingsStore";
import { useState } from "react";
import { type Slide } from "@/types/animated.type";

type Props = {
  slide: Slide;
  index: number;
  currentSlide: number;
  setCurrentSlide: (id: number) => void;
  handleDeleteSlide: (id: number) => void;
};

export const SidebarCard = ({
  slide,
  index,
  currentSlide,
  setCurrentSlide,
  handleDeleteSlide,
}: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const isCurrent = currentSlide === slide.id;

  const { background } = useSettingsStore();

  return (
    <div
      key={slide.id}
      onClick={() => setCurrentSlide(slide.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative cursor-pointer overflow-hidden rounded-md transition-all duration-200"
    >
      <div
        className="relative aspect-[16/9] w-full"
        style={{ background: background }}
      >
        <CodePreview currentSlide={index} />
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-200",
            !isCurrent && "bg-black/50",
            isHovered && "bg-slate-300/30",
          )}
        />
        <div
          className={cn(
            "absolute right-0 top-0 p-2 transition-opacity duration-200",
            isHovered ? "opacity-100" : "opacity-0",
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSlide(slide.id);
            }}
            className="size-6 bg-transparent text-slate-300 transition-colors duration-200 hover:bg-transparent hover:text-red-500"
          >
            <Trash className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
