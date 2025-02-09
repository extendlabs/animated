import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { motion } from "framer-motion";
import { type DiffResult } from "types/code-presentation.type";
import { Button } from "../../../../../components/ui/button";
import { MyEditor } from "../my-editor";
import { computeDiff } from "@/lib/code-diff";
import { useUIStore } from "@/zustand/useUIStore";
import { PauseIcon, PlayIcon, Video, StopCircle } from "lucide-react";
import RecordableCodeCard from "./_components/recordable-code-card";
import { useRecording } from "@/hooks/use-recording";
import { usePathname } from "next/navigation";

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
    name,
    description,
  } = useUIStore();

  const pathname = usePathname();

  const componentRef = useRef<HTMLDivElement>(null);
  const { recordingState, startRecording, stopRecording } = useRecording();

  const [diffMap, setDiffMap] = useState<DiffResult>({
    lineDiff: {},
    oldTokens: [],
    newTokens: [],
  });

  const currentCode = useMemo(
    () => slides[currentSlide]?.code ?? "",
    [slides, currentSlide],
  );

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

  // Effect to auto-start animation after recording begins
  useEffect(() => {
    if (recordingState.status === "recording") {
      const timer = setTimeout(() => {
        setCurrentSlide(0);
        setIsAutoPlaying(true);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setIsAutoPlaying(false);
    }
  }, [recordingState.status, setCurrentSlide, setIsAutoPlaying]);

  // Effect to stop recording after animation ends
  useEffect(() => {
    if (
      recordingState.status === "recording" &&
      !isAutoPlaying &&
      currentSlide === slides.length - 1
    ) {
      const timer = setTimeout(() => {
        stopRecording();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [
    recordingState.status,
    isAutoPlaying,
    currentSlide,
    slides.length,
    stopRecording,
  ]);

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
      setCurrentSlide(0);
      setIsAutoPlaying(false);
      await startRecording(componentRef.current);
    }
  };

  const handleUpdateSlide = (value: string | undefined) => {
    if (value !== undefined) {
      const updatedSlide = { code: value, description: "Updated description" };
      updateSlide(currentSlide, updatedSlide);
    }
  };

  return (
    <div>
      <div className="mx-auto w-full max-w-3xl">
        <motion.div className="space-y-4 rounded-lg p-4">
          {name && (
            <div className="mb-4 space-y-2">
              <h2 className="text-2xl font-bold">{name}</h2>
              {description && (
                <p className="text-muted-foreground">{description}</p>
              )}
            </div>
          )}
          <div className="relative overflow-hidden rounded-sm">
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
                containerRef={componentRef}
              />
            )}
          </div>
          <div className="flex justify-center max-sm:hidden">
            <div className="mt-4 flex items-center space-x-4">
              <Button
                onClick={() => {
                  setCurrentSlide(0);
                  setIsAutoPlaying(!isAutoPlaying);
                }}
                aria-label={isAutoPlaying ? "Pause" : "Play"}
                disabled={
                  isAutoPlaying || recordingState.status === "recording"
                }
                variant="ghost"
                size="icon"
              >
                {isAutoPlaying ? (
                  <PauseIcon className="h-4 w-4" />
                ) : (
                  <PlayIcon className="h-4 w-4" />
                )}
              </Button>

              {recordingState.status === "idle" ? (
                <Button
                  onClick={handleStartRecording}
                  variant="ghost"
                  size="icon"
                  disabled={isAutoPlaying}
                  aria-label="Start Recording"
                >
                  <Video className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={stopRecording}
                  variant="ghost"
                  size="icon"
                  aria-label="Stop Recording"
                >
                  <StopCircle className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
