import { useCallback } from 'react';
import * as htmlToImage from 'html-to-image';

interface UseComponentScreenshotOptions {
  fileName?: string;
  quality?: number;
  padding?: number;
  background?: string;
  maxWidth?: number;
  scale?: number;
}

export const useComponentScreenshot = (options: UseComponentScreenshotOptions = {}) => {
  const { 
    fileName = 'code-screenshot',
    quality = 1.0,
    padding = 32,
    background = '#ffffff',
    maxWidth = 1200,
    scale = 2
  } = options;

  const takeScreenshot = useCallback(async (element: HTMLElement | null) => {
    if (!element) return;

    try {
      // Store original scroll position
      const originalScroll = window.scrollY;

      // Create wrapper with absolute positioning
      const wrapper = document.createElement('div');
      wrapper.style.position = 'absolute';
      wrapper.style.top = '0';
      wrapper.style.left = '0';
      wrapper.style.width = `${maxWidth + (padding * 2)}px`;
      wrapper.style.background = background;
      wrapper.style.padding = `${padding}px`;
      wrapper.style.boxSizing = 'border-box';
      wrapper.style.overflow = 'hidden';

      // Clone the element
      const clone = element.cloneNode(true) as HTMLElement;
      
      // Calculate dimensions
      const originalWidth = element.offsetWidth;
      const originalHeight = element.offsetHeight;
      const aspectRatio = originalHeight / originalWidth;
      const scaledWidth = Math.min(originalWidth, maxWidth);
      const scaledHeight = scaledWidth * aspectRatio;

      // Set clone styles
      clone.style.width = `${scaledWidth}px`;
      clone.style.height = `${scaledHeight}px`;
      clone.style.position = 'relative';
      clone.style.transform = 'none';
      clone.style.margin = '0';

      // Remove screenshot controls
      const controls = clone.querySelector('.max-sm\\:hidden');
      if (controls) {
        controls.remove();
      }

      // Add to DOM outside viewport
      wrapper.appendChild(clone);
      wrapper.style.transform = 'translateY(-99999px)';
      document.body.appendChild(wrapper);

      // Ensure proper rendering
      await new Promise(resolve => setTimeout(resolve, 100));

      // Workaround for stylesheet access issues
      const cloneStylesheets = async () => {
        const stylesheets = document.styleSheets;
        const styleElements = document.createElement('style');
        
        for (let i = 0; i < stylesheets.length; i++) {
          try {
            const stylesheet = stylesheets[i];
            const rules = Array.from(stylesheet?.cssRules || []);
            
            rules.forEach(rule => {
              try {
                styleElements.textContent += rule.cssText + '\n';
              } catch (ruleError) {
                console.warn('Could not copy rule:', ruleError);
              }
            });
          } catch (stylesheetError) {
            console.warn('Could not access stylesheet:', stylesheetError);
          }
        }
        
        clone.appendChild(styleElements);
      };

      // Attempt to copy stylesheets
      await cloneStylesheets();

      // Take the screenshot
      const dataUrl = await htmlToImage?.toPng(wrapper, {
        quality,
        cacheBust: true,
        pixelRatio: scale,
        skipAutoScale: false,
        width: scaledWidth + (padding * 2),
        height: scaledHeight + (padding * 2),
        style: {
          'transform': 'none',
          'transform-origin': 'center',
          'overflow': 'visible',
          '-webkit-print-color-adjust': 'exact'
        } as any
      });

      // Clean up
      document.body.removeChild(wrapper);

      // Restore scroll position
      window.scrollTo(0, originalScroll);

      // Create and trigger download
      const link = document.createElement('a');
      link.download = `${fileName}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      return dataUrl;
    } catch (error) {
      console.error('Screenshot failed:', error);
      throw error;
    }
  }, [fileName, quality, padding, background, maxWidth, scale]);

  return { takeScreenshot };
};