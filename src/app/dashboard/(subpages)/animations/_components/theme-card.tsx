import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardContent, Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { type Theme } from "@/hooks/use-save-theme";
import { useSettingsStore } from "@/zustand/useSettingsStore";


type Props = {
    theme: Theme;
    onSelect: (theme: Theme) => void;
    onDelete: (id: string) => void;
}

export const ThemeCard = ({ theme, onSelect, onDelete }: Props) => {
    const selectedThemeId = useSettingsStore((state) => state.selectedThemeId);
    const isSelected = selectedThemeId === theme.id;

    return (
        <Card className={`overflow-hidden relative`}>
            <div className="h-24" style={{ background: theme.background }}></div>
            <CardHeader>
                <CardTitle>{theme.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <dt className="font-medium">Padding:</dt>
                        <dd>{theme.padding}px</dd>
                    </div>
                    <div>
                        <dt className="font-medium">Radius:</dt>
                        <dd>{theme.radius}px</dd>
                    </div>
                    <div>
                        <dt className="font-medium">Language:</dt>
                        <dd>{theme.language}</dd>
                    </div>
                    <div>
                        <dt className="font-medium">Line Numbers:</dt>
                        <dd>{theme.withLineIndex ? "Yes" : "No"}</dd>
                    </div>
                    <div>
                        <dt className="font-medium">Card Theme:</dt>
                        <dd>{theme.cardTheme}</dd>
                    </div>
                </dl>
                <div className="mt-4 space-y-2">
                    <Button
                        onClick={() => onSelect(theme)}
                        variant={isSelected ? "default" : "secondary"}
                        className="w-full"
                    >
                        {isSelected ? 'Selected' : 'Select Theme'}
                    </Button>
                </div>
            </CardContent>
            <Button
                className="absolute top-2 right-2"
                size="icon"
                variant="ghost"
                onClick={() => onDelete(theme.id!)}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </Card>
    );
};