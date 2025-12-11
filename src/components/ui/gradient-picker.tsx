"use client";

import { forwardRef, useMemo, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useForwardedRef } from "@/hooks/use-forvard-ref";
import { Plus, Minus } from "lucide-react";

interface GradientStop {
  color: string;
  position: number;
}

interface GradientPickerProps {
  value: GradientStop[];
  onChange?: (value: GradientStop[]) => void;
  onBlur?: () => void;
  direction?: "to right" | "to bottom";
}

const GradientPicker = forwardRef<
  HTMLInputElement,
  Omit<React.ComponentProps<typeof Button>, "value" | "onChange" | "onBlur"> &
    GradientPickerProps
>(
  (
    {
      disabled,
      value,
      onChange,
      onBlur,
      name,
      className,
      direction = "to right",
      ...props
    },
    forwardedRef
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const [open, setOpen] = useState(false);
    const [activeStopIndex, setActiveStopIndex] = useState<number>(0);

    const gradientStops = useMemo(() => {
      return value.length > 0
        ? value
        : [
            { color: "#FFFFFF", position: 0 },
            { color: "#000000", position: 100 },
          ];
    }, [value]);

    const gradientStyle = useMemo(() => {
      const sortedStops = [...gradientStops].sort(
        (a, b) => a.position - b.position
      );
      const gradient = sortedStops
        .map((stop) => `${stop.color} ${stop.position}%`)
        .join(", ");
      return `linear-gradient(${direction}, ${gradient})`;
    }, [gradientStops, direction]);

    const handleColorChange = (color: string) => {
      const newStops = [...gradientStops];
      newStops[activeStopIndex] = {
        ...newStops[activeStopIndex],
        color,
      } as GradientStop;
      if (onChange) onChange(newStops);
    };

    const handlePositionChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      index: number
    ) => {
      const position = Math.min(100, Math.max(0, Number(e.target.value)));
      const newStops = [...gradientStops];
      newStops[index] = {
        ...newStops[index],
        position,
      } as GradientStop;
      if (onChange) onChange(newStops);
    };

    const addStop = () => {
      if (gradientStops.length < 5) {
        const newPosition = 50;
        const newColor = "#808080";
        const newStops = [
          ...gradientStops,
          { color: newColor, position: newPosition },
        ];
        if (onChange) onChange(newStops);
        setActiveStopIndex(newStops.length - 1);
      }
    };

    const removeStop = (index: number) => {
      if (gradientStops.length > 2) {
        const newStops = gradientStops.filter((_, i) => i !== index);
        if (onChange) onChange(newStops);
        setActiveStopIndex(Math.max(0, index - 1));
      }
    };

    return (
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild disabled={disabled} onBlur={onBlur}>
          <Button
            {...props}
            className={cn("h-8 w-full", className)}
            name={name}
            onClick={() => setOpen(true)}
            style={{
              background: gradientStyle,
            }}
            variant="outline"
          />
        </PopoverTrigger>
        <PopoverContent className="w-640">
          <div className="space-y-4">
            <div
              className="h-8 w-full cursor-pointer rounded-md"
              style={{ background: gradientStyle }}
            />

            <div className="space-y-2">
              {gradientStops.map((stop, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    style={{ backgroundColor: stop.color }}
                    onClick={() => setActiveStopIndex(index)}
                  />
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={stop.position}
                    onChange={(e) => handlePositionChange(e, index)}
                    className="w-20"
                  />
                  {gradientStops.length > 2 && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeStop(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {gradientStops.length < 5 && (
              <Button variant="outline" className="w-full" onClick={addStop}>
                <Plus className="mr-2 h-4 w-4" />
                Add Stop
              </Button>
            )}

            {activeStopIndex !== null && (
              <div className="space-y-2">
                <HexColorPicker
                  color={gradientStops[activeStopIndex]?.color}
                  onChange={handleColorChange}
                  style={{ width: "100%" }}
                />
                <Input
                  ref={ref}
                  value={gradientStops[activeStopIndex]?.color}
                  onChange={(e) => handleColorChange(e.target.value)}
                  maxLength={7}
                />
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

GradientPicker.displayName = "GradientPicker";

export { GradientPicker };
