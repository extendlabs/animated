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
import { useState, useEffect } from "react";

type Props = {
  forceCreate?: boolean;
};

export function SaveCodeDialog({ forceCreate = false }: Props) {
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
    if (isCreating) {
      setName("");
      setDescription("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>{isCreating ? "Create" : "Update"}</Button>
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
            {slides.map((slide, index) => (
              <div key={slide.id} className="space-y-2">
                <h3 className="font-semibold">Slide {index + 1}</h3>
                <Input
                  placeholder="Name"
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
}
