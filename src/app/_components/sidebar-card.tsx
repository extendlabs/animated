import React from "react";
import CodePreview from "@/components/code-preview";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";

type Slide = {
  id: number;
  code: string;
  description?: string;
};

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
  const [hoveredSlide, setHoveredSlide] = React.useState<number | null>(null);
  const isCurrent = currentSlide === slide.id;

  return (
    <div
      key={slide.id}
      onClick={() => setCurrentSlide(slide.id)}
      onMouseEnter={() => setHoveredSlide(slide.id)}
      onMouseLeave={() => setHoveredSlide(null)}
      className={cn(
        "relative cursor-pointer overflow-hidden rounded-md",
        "group transition-all duration-200",
      )}
    >
      <div className="relative aspect-[16/9] w-full">
        <CodePreview currentSlide={index} />
        <div
          className={cn(
            "absolute inset-0 bg-black bg-opacity-0 transition-opacity duration-200 hover:bg-slate-300/30",
            !isCurrent && "bg-opacity-50",
          )}
        />
        <div
          className={cn(
            "absolute right-0 top-0 p-2 opacity-0 transition-opacity duration-200",
            hoveredSlide !== null && hoveredSlide >= 0 && "opacity-100",
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
