import { useState, useEffect, useCallback } from "react";

import { createClient } from "@/lib/supabase/client";
import { type Theme } from "./use-save-theme";

export function useThemes() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchThemes = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error: themesError } = await supabase
        .from("themes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (themesError) throw themesError;
      setThemes(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch themes");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTheme = async (id: string) => {
    try {
      const { error } = await supabase.from("themes").delete().eq("id", id);

      if (error) throw error;

      // Optimistic update
      setThemes((prev) => prev.filter((theme) => theme.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete theme");
      throw err;
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("themes_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "themes",
        },
        () => {
          fetchThemes();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchThemes]);

  // Initial fetch
  useEffect(() => {
    fetchThemes();
  }, [fetchThemes]);

  return {
    themes,
    loading,
    error,
    deleteTheme,
    refreshThemes: fetchThemes,
  };
}
