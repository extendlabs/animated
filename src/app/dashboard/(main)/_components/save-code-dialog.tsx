// save-animation-dialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSaveAnimation } from "@/hooks/use-save-animation";
import { useUIStore } from "@/zustand/useUIStore";
import { Save, Wrench } from "lucide-react";
import { useState, useEffect } from "react";

type Props = {
  forceCreate?: boolean;
};

export const SaveCodeDialog = ({ forceCreate = false }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { saveAnimation, isLoading } = useSaveAnimation();
  const {
    slides,
    updateSlide,
    id: animationId,
    name: existingName,
    description: existingDescription,
    isEditing,
    isAutoPlaying,
  } = useUIStore();
  const isCreating = forceCreate || !animationId;

  useEffect(() => {
    if (!forceCreate && animationId && existingName && existingDescription) {
      setName(existingName);
      setDescription(existingDescription);
    }
  }, [forceCreate, animationId, existingName, existingDescription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveAnimation(name, description, forceCreate);
    setIsOpen(false);
    setName("");
    setDescription("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          size="icon"
          className={"bg-secondary/60 hover:bg-secondary/90"}
          disabled={isEditing || isAutoPlaying}
        >
          {" "}
          {isCreating ? (
            <Save className="h-4 w-4" />
          ) : (
            <Wrench className="h-4 w-4" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isCreating ? "Create New Animation" : "Update Animation"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="name"
              placeholder="Animation name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Textarea
              id="description"
              placeholder="Animation description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Slides</h3>
            {slides.map((slide) => (
              <div key={slide.id} className="space-y-2">
                <Input
                  placeholder={`Slide ${slide.id + 1} name`}
                  value={slide.file_name || ""}
                  onChange={(e) =>
                    updateSlide(slide.id, { file_name: e.target.value })
                  }
                />
              </div>
            ))}
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Saving..." : isCreating ? "Create" : "Update"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
