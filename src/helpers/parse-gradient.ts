import { GradientStop } from "@/types/animated.type";

export const parseGradient = (gradientString: string) => {
  const content = gradientString.match(/linear-gradient\((.*?)\)/)?.[1];
  if (!content) return [];

  const stopsContent = content.replace(/^(to right|to bottom),\s*/, "");

  const stops = stopsContent.split(",").map((stop) => stop.trim());
  const parsedGradient: GradientStop[] = [];
  const colorRegex = /#(?:[0-9a-fA-F]{3}){1,2}/;

  stops.forEach((stop, index) => {
    const colorMatch = stop.match(colorRegex);
    if (colorMatch) {
      const color = colorMatch[0];
      const positionMatch = stop
        .replace(color, "")
        .trim()
        .match(/(\d+)%/);

      let position: number;
      if (positionMatch && positionMatch[1]) {
        position = parseFloat(positionMatch[1]);
      } else {
        // If no position specified, distribute evenly
        position =
          index === 0
            ? 0
            : index === stops.length - 1
              ? 100
              : (index / (stops.length - 1)) * 100;
      }

      position = Number(position.toFixed(2));
      parsedGradient.push({ color, position });
    }
  });

  // Ensure at least two stops
  if (parsedGradient.length === 0) {
    parsedGradient.push(
      { color: "#FFFFFF", position: 0 },
      { color: "#000000", position: 100 }
    );
  } else if (parsedGradient.length === 1 && parsedGradient[0]) {
    // If only one stop, add a second stop
    parsedGradient.push({
      color: parsedGradient[0].color === "#FFFFFF" ? "#000000" : "#FFFFFF",
      position: 100,
    });
  }

  return parsedGradient;
};
