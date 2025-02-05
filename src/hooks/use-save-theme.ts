export interface Theme {
  id?: string;
  name: string;
  themeName: string;
  background: string;
  width: number;
  radius: number;
  language: string;
  withLineIndex: boolean;
  cardTheme: string;
  theme: any;
  user_id: string;
  created_at?: string;
}

// hooks/use-save-theme.ts
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "./use-toast";
import { useSettingsStore } from "@/zustand/useSettingsStore";


export function useSaveTheme() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();
  const settings = useSettingsStore();

  const saveTheme = async (name: string, themeId?: string) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const themeData: Omit<Theme, 'id' | 'created_at'> = {
        name,
        themeName: settings.themeName,
        background: settings.background,
        width: settings.width,
        radius: settings.radius,
        language: settings.language,
        withLineIndex: settings.withLineIndex,
        cardTheme: settings.cardTheme,
        theme: settings.theme,
        user_id: user.id,
      };

      if (themeId) {
        const { data, error } = await supabase
          .from('themes')
          .update({ 
            ...themeData
          })
          .eq('id', themeId)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        toast({ 
          title: "Success", 
          description: "Theme updated successfully"
        });
        return data;
      } else {
        const { data, error } = await supabase
          .from('themes')
          .insert({ 
            ...themeData, 
            created_at: new Date().toISOString() 
          })
          .select()
          .single();

        if (error) throw error;
        toast({ 
          title: "Success", 
          description: "Theme saved successfully"
        });
        return data;
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to save theme',
        variant: "destructive"
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { saveTheme, isLoading };
}