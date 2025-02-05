import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { type DiffResult } from "types/code-presentation.type";
import { Button } from "../../../../components/ui/button";
import { MyEditor } from "../my-editor";
import { computeDiff } from "@/lib/code-diff";
import { useSettingsStore } from "@/zustand/useSettingsStore";
import { useUIStore } from "@/zustand/useUIStore";
import { Camera, PauseIcon, PlayIcon, Video } from "lucide-react";
import RecordableCodeCard from "./_components/recordable-code-card";
import { useRecording } from "@/hooks/use-recording";
import { cn } from "@/lib/utils";
import { useComponentScreenshot } from "@/hooks/use-component-screenshot";

type Props = {
  autoPlayInterval?: number;
};

export const CodePresentation = ({ autoPlayInterval = 1500 }: Props) => {
  const {
    slides,
    currentSlide,
    isEditing,
    isAutoPlaying,
    setCurrentSlide,
    setIsAutoPlaying,
    updateSlide,
    isRecordingMode,
    setIsRecordingMode
  } = useUIStore();

  const { background } = useSettingsStore();
  const componentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { recordingState, startRecording, stopRecording } = useRecording();
  const [containerHeight, setContainerHeight] = useState<number>(0);

  const [diffMap, setDiffMap] = useState<DiffResult>({
    lineDiff: {},
    oldTokens: [],
    newTokens: [],
  });

  const currentCode = useMemo(
    () => slides[currentSlide]?.code ?? "",
    [slides, currentSlide],
  );

  // Calculate max height across all slides
  useEffect(() => {
    if (isRecordingMode && containerRef.current) {
      const calculateMaxHeight = () => {
        let maxHeight = 0;
        const codeContainer = containerRef.current?.querySelector('.code-container');
        const containerWidth = codeContainer ? codeContainer.clientWidth : containerRef.current?.clientWidth || 0;

        slides.forEach((slide) => {
          const tempDiv = document.createElement('div');
          tempDiv.style.cssText = `position: absolute; visibility: hidden; width: ${containerWidth}px;`;
          tempDiv.className = 'code-container';
          tempDiv.innerHTML = `<pre>${slide.code}</pre>`;
          document.body.appendChild(tempDiv);
          maxHeight = Math.max(maxHeight, tempDiv.offsetHeight);
          document.body.removeChild(tempDiv);
        });
        setContainerHeight(maxHeight + 48); // Add padding
      };
      calculateMaxHeight();
    }
  }, [isRecordingMode, slides]);

  const handleSlideChange = useCallback(
    (direction: "next" | "prev") => {
      const newIndex =
        direction === "next"
          ? Math.min(currentSlide + 1, slides.length - 1)
          : Math.max(currentSlide - 1, 0);

      if (newIndex !== currentSlide) {
        if (slides[newIndex] && slides[currentSlide]) {
          const newDiff = computeDiff(
            slides[currentSlide].code,
            slides[newIndex].code,
          );
          setDiffMap(newDiff);
          setCurrentSlide(newIndex);
        }
      }
    },
    [currentSlide, slides, setCurrentSlide],
  );

  useEffect(() => {
    if (recordingState.status === 'recording') {
      const timer = setTimeout(() => {
        setCurrentSlide(0);
        setIsAutoPlaying(true);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setIsAutoPlaying(false);
    }
  }, [recordingState.status, setCurrentSlide, setIsAutoPlaying]);

  useEffect(() => {
    if (recordingState.status === 'recording' && !isAutoPlaying && currentSlide === slides.length - 1) {
      const timer = setTimeout(() => {
        setIsRecordingMode(false);
        stopRecording();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [recordingState.status, isAutoPlaying, currentSlide, slides.length, stopRecording, setIsRecordingMode]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        if (currentSlide < slides.length - 1) {
          handleSlideChange("next");
        } else {
          setIsAutoPlaying(false);
          setDiffMap({
            lineDiff: {},
            oldTokens: [],
            newTokens: [],
          });
        }
      }, autoPlayInterval);
    }

    return () => clearInterval(interval);
  }, [
    isAutoPlaying,
    currentSlide,
    slides.length,
    autoPlayInterval,
    handleSlideChange,
    setIsAutoPlaying,
  ]);
  const handleStartRecording = async () => {
    if (componentRef.current) {
      try {
        window.scrollTo({ top: 0, behavior: 'instant' });
        setIsRecordingMode(true);
        setCurrentSlide(0);
        setIsAutoPlaying(false);
        await new Promise(resolve => setTimeout(resolve, 1500));
        await startRecording(componentRef.current, () => {
          setIsRecordingMode(false);
          setIsAutoPlaying(false);
          setCurrentSlide(0);
          setContainerHeight(0);
          setDiffMap({
            lineDiff: {},
            oldTokens: [],
            newTokens: [],
          });
        });
      } catch (error) {
        console.error('Failed to start recording:', error);
      }
    }
  }
  const handleUpdateSlide = (value: string | undefined) => {
    if (value !== undefined) {
      const updatedSlide = { code: value, description: "Updated description" };
      updateSlide(currentSlide, updatedSlide);
    }
  };

  const { takeScreenshot } = useComponentScreenshot({
    fileName: 'code-presentation',
    background: background
  });

  const handleScreenshot = () => {
    takeScreenshot(componentRef.current);
  };

  return (
    <>
      <div
        style={{ background }}
        className={cn(
          'w-full flex flex-col items-center transition-all duration-200',
          isRecordingMode ? 'fixed inset-0 z-50 bg-background overflow-y-auto' : 'py-2'
        )}
      >
        <div
          ref={componentRef}
          className={cn(
            "w-full max-w-3xl mx-auto",
            isRecordingMode && "my-auto"
          )}
          style={isRecordingMode && containerHeight ? { height: containerHeight } : undefined}
        >
          <motion.div
            className="w-full space-y-4 rounded-lg"
          >
            <div className="flex justify-center items-center">
              <div className="w-full">
                {isEditing ? (
                  <MyEditor
                    value={currentCode}
                    handleUpdateSlide={handleUpdateSlide}
                  />
                ) : (
                  <RecordableCodeCard
                    currentCode={currentCode}
                    currentSlide={currentSlide}
                    diffMap={diffMap}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      {!isRecordingMode && (
        <div className="flex justify-center max-sm:hidden">
          <div className="mt-4 flex items-center space-x-4">
            <Button
              onClick={() => {
                setCurrentSlide(0);
                setIsAutoPlaying(!isAutoPlaying);
              }}
              aria-label={isAutoPlaying ? "Pause" : "Play"}
              disabled={isAutoPlaying || recordingState.status === 'recording' || isEditing}
              variant="ghost"
              size="icon"
            >
              {isAutoPlaying ? (
                <PauseIcon className="h-4 w-4" />
              ) : (
                <PlayIcon className="h-4 w-4" />
              )}
            </Button>
            <Button
              onClick={handleStartRecording}
              variant="ghost"
              size="icon"
              disabled={recordingState.status === 'recording' || isEditing}
            >
              <Video className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleScreenshot}
              variant="ghost"
              size="icon"
              disabled={recordingState.status === 'recording' || isEditing}
              aria-label="Take Screenshot"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};