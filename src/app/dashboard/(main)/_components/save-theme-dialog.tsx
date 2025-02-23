import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSaveTheme } from "@/hooks/use-save-theme";
import { useSettingsStore } from "@/zustand/useSettingsStore";
import { useThemes } from "@/hooks/use-themes";
import { Save, Wrench } from "lucide-react";

type Props = {
  variant: "create" | "edit";
};

export const SaveThemeDialog = ({ variant }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { saveTheme, isLoading } = useSaveTheme();
  const settings = useSettingsStore();
  const { themes } = useThemes();
  const selectedTheme = themes.find(
    (theme) => theme.id === settings.selectedThemeId,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const savedTheme = await saveTheme(
      settings.name,
      variant === "edit" ? selectedTheme?.id : undefined,
    );
    if (savedTheme) {
      settings.setSelectedThemeId(savedTheme.id);
      settings.setName((savedTheme as any).name);
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          {variant === "create" ? (
            <Save className="h-4 w-4" />
          ) : (
            <Wrench className="h-4 w-4" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {variant === "create" ? "Create New Theme" : "Update Theme"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="name"
              placeholder="Theme name"
              value={settings.name}
              onChange={(e) => settings.setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="font-medium">Background</p>
                <div
                  className="h-6 w-full rounded"
                  style={{ background: settings.background }}
                />
              </div>
              <div>
                <p className="font-medium">Theme</p>
                <p>{settings.themeName}</p>
              </div>
              <div>
                <p className="font-medium">Card Theme</p>
                <p>{settings.cardTheme}</p>
              </div>
              <div>
                <p className="font-medium">Width</p>
                <p>{settings.width}px</p>
              </div>
              <div>
                <p className="font-medium">Radius</p>
                <p>{settings.radius}px</p>
              </div>
              <div>
                <p className="font-medium">Language</p>
                <p>{settings.language}</p>
              </div>
              <div>
                <p className="font-medium">Interval</p>
                <p>{settings.autoPlayInterval}</p>
              </div>
              <div>
                <p className="font-medium">Line duration</p>
                <p>{settings.transitionDuration}</p>
              </div>
              <div>
                <p className="font-medium">Token delay</p>
                <p>{settings.transitionDelay}</p>
              </div>
              <div>
                <p className="font-medium">Line Numbers</p>
                <p>{settings.withLineIndex ? "Yes" : "No"}</p>
              </div>
            </div>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading
              ? "Saving..."
              : variant === "create"
                ? "Create"
                : "Update"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
