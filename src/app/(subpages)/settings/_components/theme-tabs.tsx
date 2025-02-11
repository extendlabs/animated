import { LoadingSpinner } from "@/components/loading-spinner";
import { ThemeCard } from "./theme-card";
import { useSettingsStore } from "@/zustand/useSettingsStore";
import { type Theme } from "@/hooks/use-save-theme";
import { toast } from "@/hooks/use-toast";
import EmptyTab from "./empty-tab";
import { Paintbrush } from "lucide-react";

type Props = {
  themes: Theme[];
  loading: boolean;
  onDelete: (id: string) => void;
};

export const ThemeTab = ({ themes, loading, onDelete }: Props) => {
  const setSettings = useSettingsStore((state) => state.setSettings);
  const setSelectedThemeId = useSettingsStore(
    (state) => state.setSelectedThemeId,
  );

  const handleSelectTheme = (theme: Theme) => {
    setSettings({
      name: theme.name,
      background: theme.background,
      cardTheme: theme.cardTheme,
      language: theme.language,
      width: theme.width,
      radius: theme.radius,
      theme: theme.theme,
      themeName: theme.themeName,
      withLineIndex: theme.withLineIndex,
    });
    toast({
      title: "Theme Applied",
      description: `${theme.name} settings are now active.`,
    });
    setSelectedThemeId(theme.id!);
  };

  if (loading) return <LoadingSpinner />;
  if (!themes.length) return (
    <EmptyTab
      title={"No Themes"}
      description={"Create a new theme to get started."}
      icon={<Paintbrush className="h-20 w-20 text-zinc-700 mb-6" />}
    />);

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {themes.map((theme) => (
        <ThemeCard
          key={theme.id}
          theme={theme}
          onSelect={handleSelectTheme}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
