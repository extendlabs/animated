import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

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
  return (
    <div
      key={slide.id}
      onClick={() => setCurrentSlide(slide.id)}
      className={cn(
        "relative cursor-pointer rounded-lg p-4 transition-colors hover:bg-muted/50",
        currentSlide === slide.id && "bg-muted",
      )}
    >
      <div className="group flex items-center justify-between">
        <div className="font-mono text-sm">Slide {index + 1}</div>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteSlide(slide.id);
          }}
          className="opacity-0 transition-opacity duration-200 hover:bg-transparent hover:text-red-500 group-hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
