import { type GradientStop } from "@/app/(main)/_components/settings-footer";

export const parseGradient = (gradientString: string) => {
  const content = gradientString.match(/linear-gradient\((.*?)\)/)?.[1];
  if (!content) return [];

  const stops = content.split(",").map((stop) => stop.trim());
  const parsedGradient: GradientStop[] = [];
  const colorRegex = /#(?:[0-9a-fA-F]{3}){1,2}/;
  let lastPosition = 0;

  stops.forEach((stop, index) => {
    const colorMatch = stop.match(colorRegex);
    if (colorMatch) {
      const color = colorMatch[0];
      const positionMatch = stop
        .replace(color, "")
        .trim()
        .match(/(\d+)%/);
      let position = positionMatch?.[1] ? parseFloat(positionMatch[1]) : null;

      if (position === null) {
        position =
          index === 0
            ? 0
            : index === stops.length - 1
              ? 100
              : lastPosition + 100 / (stops.length - 1);
      }
      position = Number(position.toFixed(2));
      lastPosition = position;
      parsedGradient.push({ color, position });
    }
  });

  return parsedGradient;
};
