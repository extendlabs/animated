import React, { useState } from "react";
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
  const [hoveredSlide, setHoveredSlide] = useState<number | null>(null);
  const isCurrent = currentSlide === slide.id;

  return (
    <div
      key={slide.id}
      onClick={() => setCurrentSlide(slide.id)}
      onMouseEnter={() => setHoveredSlide(slide.id)}
      onMouseLeave={() => setHoveredSlide(null)}
      className={cn("group relative cursor-pointer transition-colors")}
    >
      <div className="relative aspect-[16/9] w-full">
        <CodePreview currentSlide={index} isCurrent={isCurrent} />

        {hoveredSlide === slide.id && ( // Show button only when hovered
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSlide(slide.id);
            }}
            asChild
            className="transi absolute right-2 top-2 size-[16px] text-slate-300 duration-200 hover:bg-transparent hover:text-red-500"
          >
            <Trash className="size-[14px]" />
          </Button>
        )}
      </div>
    </div>
  );
};
