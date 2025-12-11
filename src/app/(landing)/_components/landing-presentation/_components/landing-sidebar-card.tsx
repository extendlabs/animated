import { cn } from "@/lib/utils";
import { CodePreviewLanding } from "./landing-code-preview";
import { useState } from "react";
import { type Slide } from "@/types/animated.type";
import { initialState } from "../landing-presentation";

interface SidebarCardLandingProps {
  slide: Slide;
  index: number;
  currentSlide: number;
  setCurrentSlide: (id: number) => void;
}

export function SidebarCardLanding({
  slide,
  index,
  currentSlide,
  setCurrentSlide,
}: SidebarCardLandingProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isCurrent = currentSlide === slide.id;

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
        style={{ background: initialState.background }}
      >
        <CodePreviewLanding currentSlide={index} />
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-200",
            !isCurrent && "bg-black/50",
            isHovered && "bg-slate-300/30"
          )}
        />
      </div>
    </div>
  );
}
