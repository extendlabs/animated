import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

export interface Animation {
  id: string;
  name: string;
  description: string;
  user_id: string;
  slides: {
    id: string;
    animation_id: string;
    file_name: string;
    code: string;
    description: string;
    created_at: string;
    updated_at: string;
  }[];
}

export function useAnimations() {
  const [animations, setAnimations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchAnimations = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // First, fetch the animations
      const { data: animationsData, error: animationsError } = await supabase
        .from("animations")
        .select(`*, animation_slides(*)`)
        .eq("user_id", user.id);

      if (animationsError) throw animationsError;

      // Transform the data to match your interface
      const transformedData = animationsData?.map((animation) => ({
        ...animation,
        slides: animation.animation_slides || [],
      }));

      setAnimations(transformedData || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch animations",
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteAnimation = async (id: string) => {
    try {
      const { error } = await supabase.from("animations").delete().eq("id", id);

      if (error) throw error;

      // Update local state
      setAnimations((prev) => prev.filter((animation) => animation.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete animation",
      );
      throw err;
    }
  };

  useEffect(() => {
    fetchAnimations();
  }, []);

  return {
    animations,
    loading,
    error,
    deleteAnimation,
    refreshAnimations: fetchAnimations,
  };
}
