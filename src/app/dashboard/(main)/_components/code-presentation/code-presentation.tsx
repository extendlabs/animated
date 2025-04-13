import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { motion } from "framer-motion";
import { type DiffResult } from "types/code-presentation.type";
import { Button } from "@/components/ui/button";
import { MyEditor } from "../my-editor";
import { computeDiff } from "@/helpers/code-diff";
import { useSettingsStore } from "@/zustand/useSettingsStore";
import { useUIStore } from "@/zustand/useUIStore";
import { Camera, PauseIcon, PlayIcon, Video } from "lucide-react";
import { RecordableCodeCard } from "./_components/recordable-code-card";
import { useRecording } from "@/hooks/use-recording";
import { cn } from "@/lib/utils";
import { useComponentScreenshot } from "@/hooks/use-component-screenshot";
import { EditButton } from "../edit-button";
import { SaveCodeDialog } from "../save-code-dialog";
import useSubscriptionLimitations from "@/hooks/use-subscription-limitation";
import { useAuthStore } from "@/zustand/useAuthStore";

export const CodePresentation = () => {
  const {
    slides,
    currentSlide,
    isEditing,
    isAutoPlaying,
    setCurrentSlide,
    setIsAutoPlaying,
    updateSlide,
    isRecordingMode,
    setIsRecordingMode,
  } = useUIStore();

  const { background, withLineIndex } = useSettingsStore();
  const componentRef = useRef<HTMLDivElement>(null);
  const { recordingState, startRecording, stopRecording } = useRecording();
  const [containerHeight, setContainerHeight] = useState<number>(0);

  const currentCode = useMemo(
    () => slides[currentSlide]?.code ?? "",
    [slides, currentSlide],
  );

  const { autoPlayInterval } = useSettingsStore((state) => state);

  const [diffMap, setDiffMap] = useState<DiffResult>({
    lineDiff: {},
    oldTokens: [],
    newTokens: [],
  });

  const calculateMaxHeight = useCallback(() => {
    if (!componentRef.current) return 0;

    // Create virtual container
    const container = document.createElement("div");
    container.style.cssText = `
      position: absolute;
      visibility: hidden;
      width: ${componentRef.current.clientWidth}px;
      padding: 0;
      margin: 0;
    `;
    document.body.appendChild(container);

    // Create card mock
    const card = document.createElement("div");
    card.style.cssText = `
      width: 100%;
      padding: 4px;
      margin: 40px 0;
    `;
    container.appendChild(card);

    // Create header mock (40px fixed height)
    const header = document.createElement("div");
    header.style.height = "40px";
    card.appendChild(header);

    // Create code container
    const codeContainer = document.createElement("pre");
    codeContainer.style.cssText = `
      margin: 0;
      padding: 16px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 14px;
      line-height: 21px;
      white-space: pre;
      tab-size: 2;
    `;
    card.appendChild(codeContainer);

    // Find max height across all slides
    const maxHeight = slides.reduce((max, slide) => {
      codeContainer.textContent = slide.code;

      if (withLineIndex) {
        const lineCount = slide.code.split("\n").length;
        const lineNumberWidth = String(lineCount).length * 8 + 32;
        codeContainer.style.paddingLeft = `${lineNumberWidth}px`;
      }

      const totalHeight = container.offsetHeight + (isRecordingMode ? 32 : 0);
      return Math.max(max, totalHeight);
    }, 0);

    document.body.removeChild(container);
    return maxHeight;
  }, [slides, withLineIndex, isRecordingMode]);

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

  useEffect(() => {
    if (
      recordingState.status === "recording" &&
      !isAutoPlaying &&
      currentSlide === slides.length - 1
    ) {
      const timer = setTimeout(() => {
        handleRecordingComplete();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [recordingState.status, isAutoPlaying, currentSlide, slides.length]);

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
      }, autoPlayInterval * 1000);
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
    if (!componentRef.current) return;

    try {
      window.scrollTo({ top: 0, behavior: "instant" });
      const height = calculateMaxHeight();
      setContainerHeight(height);
      setIsRecordingMode(true);
      setCurrentSlide(0);
      setIsAutoPlaying(false);

      await startRecording(componentRef.current, handleRecordingCancel);
    } catch (error) {
      console.error("Recording failed:", error);
      handleRecordingCancel();
    }
  };

  const handleRecordingCancel = () => {
    setContainerHeight(0);
    setIsRecordingMode(false);
    setIsAutoPlaying(false);
    setCurrentSlide(0);
  };

  const handleRecordingComplete = () => {
    setIsRecordingMode(false);
    setContainerHeight(0);
    stopRecording();
    setDiffMap({
      lineDiff: {},
      oldTokens: [],
      newTokens: [],
    });
  };

  const handleUpdateSlide = (value: string | undefined) => {
    if (value !== undefined) {
      const updatedSlide = { code: value, description: "Updated description" };
      updateSlide(currentSlide, updatedSlide);
    }
  };

  const { takeScreenshot } = useComponentScreenshot({
    fileName: "code-presentation",
    background: background,
  });

  const handleScreenshot = () => {
    takeScreenshot(componentRef.current);
  };

  const { subscriptionStatus } = useAuthStore();
  const animationId = useUIStore((state) => state.id);
  const limitations = useSubscriptionLimitations(subscriptionStatus);

  return (
    <>
      <div
        style={{ background }}
        className={cn(
          "relative flex flex-col items-center rounded-md transition-all duration-200",
          isRecordingMode
            ? "fixed inset-0 z-50 overflow-y-auto bg-background"
            : "mx-auto mt-4 max-w-3xl py-12",
        )}
      >
        {!isRecordingMode && (
          <div className="absolute right-4 top-4 max-sm:hidden">
            <div className="flex items-center gap-2">
              <EditButton />
              {limitations.proUser === true && (
                <>
                  <SaveCodeDialog key={animationId ? "update" : "create"} />
                  {animationId && (
                    <SaveCodeDialog key="create-new" forceCreate />
                  )}
                </>
              )}
            </div>
          </div>
        )}
        <div
          ref={componentRef}
          className={cn(
            "mx-auto w-full max-w-3xl",
            isRecordingMode && "my-auto",
          )}
          style={{ height: containerHeight || "auto" }}
        >
          <motion.div className="w-full space-y-4 rounded-lg">
            <div className="flex items-center justify-center">
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
              disabled={
                isAutoPlaying ||
                recordingState.status === "recording" ||
                isEditing
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
            <Button
              onClick={handleStartRecording}
              variant="ghost"
              size="icon"
              disabled={recordingState.status === "recording" || isEditing}
            >
              <Video className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleScreenshot}
              variant="ghost"
              size="icon"
              disabled={recordingState.status === "recording" || isEditing}
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
