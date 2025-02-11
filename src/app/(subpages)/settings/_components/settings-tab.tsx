import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";

import { FilmIcon, Trash2 } from "lucide-react";
import { SlideCard } from "./slide-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import EmptyTab from "./empty-tab";

type Props = {
  animations: any[];
  loading: boolean;
  onSelectSlides: (animation: any) => void;
  onDelete: (id: string) => void;
};

export const SettingsTab = ({
  animations,
  loading,
  onSelectSlides,
  onDelete,
}: Props) => {
  if (loading) return <LoadingSpinner />;
  if (!animations.length) return (
    <EmptyTab
      title={"No Animations"}
      description={"Create a new animation to get started."}
      icon={<FilmIcon className="h-20 w-20 text-zinc-700 mb-6" />}
    />);

  return (
    <Accordion type="single" collapsible className="w-full">
      {animations.map((animation) => (
        <AccordionItem key={animation.id} value={`animation-${animation.id}`}>
          <AccordionTrigger>{animation.name}</AccordionTrigger>
          <AccordionContent className="relative">
            <SlideCard animation={animation} onSelectSlides={onSelectSlides} />
            <Button
              className="absolute right-2 top-2"
              size="icon"
              variant="ghost"
              onClick={() => onDelete(animation.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
