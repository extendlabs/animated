'use client';

import { Button } from "@/components/ui/button";
import { useEngineSettingsSlidesStore } from "@/zustand/useEngineSlides";

export const EditButton = () => {
    const { isEditing, isAutoPlaying, setIsEditing } =
    useEngineSettingsSlidesStore();
    const handleEdit = () => setIsEditing(!isEditing);
    return (
        <Button
            onClick={handleEdit}
            disabled={isAutoPlaying}
            variant={"outline"}
        >
            {isEditing ? "Exit Edit" : "Edit"}
        </Button>
    );
};