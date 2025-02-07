// use-save-animation.ts
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "./use-toast";
import { useUIStore } from "@/zustand/useUIStore";
import {
  createAnimationWithSlides,
  updateAnimationWithSlides,
} from "@/lib/supabase/queries";

export function useSaveAnimation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const { toast } = useToast();
  const slides = useUIStore((state) => state.slides);
  const animationId = useUIStore((state) => state.id);
  const setAnimationDetails = useUIStore((state) => state.setAnimationDetails);

  const saveAnimation = async (
    name: string,
    description: string,
    forceCreate = false,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      if (!forceCreate && animationId) {
        const updateError = await updateAnimationWithSlides(
          supabase,
          animationId,
          name,
          description,
          user,
          slides,
        );

        if (updateError) throw updateError;
        setAnimationDetails(animationId, name, description);
        toast({
          title: "Success",
          description: "Animation updated successfully",
        });
      } else {
        const { data, error: createError } = await createAnimationWithSlides(
          supabase,
          name,
          description,
          user,
          slides,
        );
        if (createError) throw createError;
          setAnimationDetails(data, name, description);
        
        toast({
          title: "Success",
          description: "Animation created successfully",
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save animation";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveAnimation,
    isLoading,
    error,
  };
}
