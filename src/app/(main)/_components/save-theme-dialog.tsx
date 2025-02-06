import { useState, useEffect } from "react";
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

type Props = {
  forceCreate?: boolean;
};

export function SaveThemeDialog({ forceCreate = false }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const { saveTheme, isLoading } = useSaveTheme();
  const settings = useSettingsStore();
  const { themes } = useThemes();

  const selectedTheme = !forceCreate
    ? themes.find((theme) => theme.id === settings.selectedThemeId)
    : null;

  const isCreating = forceCreate || !selectedTheme;

  useEffect(() => {
    if (!forceCreate && selectedTheme?.name) {
      setName(selectedTheme.name);
    } else {
      setName("");
    }
  }, [forceCreate, selectedTheme]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveTheme(name, !isCreating ? selectedTheme?.id : undefined);
      setIsOpen(false);
      if (isCreating) {
        setName("");
      }
    } catch (error) {
      // Error is handled in the hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="mb-2">
          {isCreating ? "Create" : "Update"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isCreating ? "Create New Theme" : "Update Theme"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="name"
              placeholder="Theme name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-medium">Background:</p>
                <div
                  className="h-6 w-full rounded"
                  style={{ background: settings.background }}
                />
              </div>
              <div>
                <p className="font-medium">Theme:</p>
                <p>{settings.themeName}</p>
              </div>
              <div>
                <p className="font-medium">Width:</p>
                <p>{settings.width}px</p>
              </div>
              <div>
                <p className="font-medium">Radius:</p>
                <p>{settings.radius}px</p>
              </div>
              <div>
                <p className="font-medium">Language:</p>
                <p>{settings.language}</p>
              </div>
              <div>
                <p className="font-medium">Line Numbers:</p>
                <p>{settings.withLineIndex ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="font-medium">Card Theme:</p>
                <p>{settings.cardTheme}</p>
              </div>
            </div>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Saving..." : isCreating ? "Create" : "Update"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
