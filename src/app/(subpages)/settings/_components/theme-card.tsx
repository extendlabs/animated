import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardContent, Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { type Theme } from "@/hooks/use-save-theme";
import { useSettingsStore } from "@/zustand/useSettingsStore";

type Props = {
  theme: Theme;
  onSelect: (theme: Theme) => void;
  onDelete: (id: string) => void;
};

export const ThemeCard = ({ theme, onSelect, onDelete }: Props) => {
  const selectedThemeId = useSettingsStore((state) => state.selectedThemeId);
  const isSelected = selectedThemeId === theme.id;

  return (
    <Card className={`relative overflow-hidden`}>
      <div className="h-24" style={{ background: theme.background }}></div>
      <CardHeader>
        <CardTitle>{theme.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p>Theme</p>
            <p className="font-extralight">{theme.themeName}</p>
          </div>
          <div>
            <p>Width</p>
            <p className="font-extralight">{theme.width}px</p>
          </div>
          <div>
            <p>Radius</p>
            <p className="font-extralight">{theme.radius}px</p>
          </div>
          <div>
            <p>Language</p>
            <p className="font-extralight">{theme.language}</p>
          </div>
          <div>
            <p>Interval</p>
            <p className="font-extralight">{theme.autoPlayInterval}</p>
          </div>
          <div>
            <p>Line duration</p>
            <p className="font-extralight">{theme.transitionDuration}</p>
          </div>
          <div>
            <p>Token delay</p>
            <p className="font-extralight">{theme.transitionDelay}</p>
          </div>
          <div>
            <p>Line Numbers</p>
            <p className="font-extralight">{theme.withLineIndex ? "Yes" : "No"}</p>
          </div>

        </div>
        <div className="mt-4 space-y-2">
          <Button
            onClick={() => onSelect(theme)}
            variant={isSelected ? "default" : "secondary"}
            className="w-full"
          >
            {isSelected ? "Selected" : "Select Theme"}
          </Button>
        </div>
      </CardContent>
      <Button
        className="absolute right-2 top-2"
        size="icon"
        variant="ghost"
        onClick={() => onDelete(theme.id!)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </Card>
  );
};
