"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/zustand/useUIStore";
import { Pencil, PenOff } from "lucide-react";

export const EditButton = () => {
  const { isEditing, isAutoPlaying, setIsEditing } = useUIStore();
  const handleEdit = () => setIsEditing(!isEditing);
  return (

    <Button
      onClick={handleEdit}
      disabled={isAutoPlaying}
      variant="ghost"
      size="icon"
      className={'bg-secondary/60 hover:bg-secondary/90'}
    >
      {!isEditing ? (
        <Pencil className="h-4 w-4" />
      ) : (
        <PenOff className="h-4 w-4" />
      )}
    </Button>
  );
};
