import { useCallback } from "react";
import * as htmlToImage from "html-to-image";

interface UseComponentScreenshotOptions {
  fileName?: string;
  quality?: number;
  padding?: number;
  background?: string;
  maxWidth?: number;
  scale?: number;
}

export const useComponentScreenshot = (
  options: UseComponentScreenshotOptions = {},
) => {
  const {
    fileName = "code-screenshot",
    quality = 1.0,
    padding = 32,
    background = "#ffffff",
    maxWidth = 1200,
    scale = 2,
  } = options;

  const takeScreenshot = useCallback(
    async (element: HTMLElement | null) => {
      if (!element) return;

      try {
        const originalScroll = window.scrollY;
        const wrapper = document.createElement("div");
        wrapper.style.position = "absolute";
        wrapper.style.top = "0";
        wrapper.style.left = "0";
        wrapper.style.width = `${maxWidth + padding * 2}px`;
        wrapper.style.background = background;
        wrapper.style.padding = `${padding}px`;
        wrapper.style.boxSizing = "border-box";
        wrapper.style.overflow = "hidden";

        const clone = element.cloneNode(true) as HTMLElement;

        const originalWidth = element.offsetWidth;
        const originalHeight = element.offsetHeight;
        const aspectRatio = originalHeight / originalWidth;
        const scaledWidth = Math.min(originalWidth, maxWidth);
        const scaledHeight = scaledWidth * aspectRatio;

        clone.style.width = `${scaledWidth}px`;
        clone.style.height = `${scaledHeight}px`;
        clone.style.position = "relative";
        clone.style.transform = "none";
        clone.style.margin = "0";
        clone.style.wordBreak = "break-word";
        clone.style.whiteSpace = "pre-wrap";

        const controls = clone.querySelector(".max-sm\\:hidden");
        if (controls) {
          controls.remove();
        }

        wrapper.appendChild(clone);
        wrapper.style.transform = "translateY(-99999px)";
        document.body.appendChild(wrapper);

        await new Promise((resolve) => setTimeout(resolve, 100));

        // Safe stylesheet copying
        const styleElement = document.createElement("style");
        Array.from(document.styleSheets).forEach((sheet) => {
          try {
            // Handle both same-origin and cross-origin stylesheets
            if (sheet.href) {
              const link = document.createElement("link");
              link.rel = "stylesheet";
              link.href = sheet.href;
              clone.appendChild(link);
            } else if (sheet.ownerNode instanceof HTMLStyleElement) {
              styleElement.textContent += sheet.ownerNode.textContent + "\n";
            }
          } catch (e) {
            console.warn("Skipping stylesheet:", e);
          }
        });
        clone.appendChild(styleElement);

        const dataUrl = await htmlToImage.toPng(wrapper, {
          quality,
          cacheBust: true,
          pixelRatio: scale,
          skipAutoScale: false,
          width: scaledWidth + padding * 2,
          height: scaledHeight + padding * 2,
          style: {
            transform: "none",
            "transform-origin": "center",
            overflow: "visible",
            "-webkit-print-color-adjust": "exact",
          } as any,
        });

        document.body.removeChild(wrapper);
        window.scrollTo(0, originalScroll);

        const link = document.createElement("a");
        link.download = `${fileName}-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();

        return dataUrl;
      } catch (error) {
        console.error("Screenshot failed:", error);
        throw error;
      }
    },
    [fileName, quality, padding, background, maxWidth, scale],
  );

  return { takeScreenshot };
};
