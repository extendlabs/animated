"use client";

import { Button } from "@/components/ui/button";
import { useUIStore } from "@/zustand/useUIStore";

export const EditButton = () => {
  const { isEditing, isAutoPlaying, setIsEditing } = useUIStore();
  const handleEdit = () => setIsEditing(!isEditing);
  return (
    <Button onClick={handleEdit} disabled={isAutoPlaying} variant={"outline"}>
      {isEditing ? "Exit Edit" : "Edit"}
    </Button>
  );
};
