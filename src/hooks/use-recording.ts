import { useState, useRef, useCallback } from "react";

export interface RecordingState {
  status: "idle" | "recording";
  recordedVideo: string | null;
}

export const useRecording = () => {
  const [state, setState] = useState<RecordingState>({
    status: "idle",
    recordedVideo: null,
  });
  const recorderRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const displayStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const selectedMimeTypeRef = useRef<string | null>(null);

  const selectBestSupportedMimeType = useCallback(() => {
    const candidates = [
      "video/mp4; codecs=h264",
      "video/webm; codecs=vp9",
      "video/webm; codecs=vp8",
      "video/webm",
    ];

    const isSupported = (type: string) => {
      try {
        // Prefer the browser's MediaRecorder support matrix if available
        if (
          typeof window !== "undefined" &&
          (window as any).MediaRecorder &&
          typeof (window as any).MediaRecorder.isTypeSupported === "function"
        ) {
          return (window as any).MediaRecorder.isTypeSupported(type);
        }
      } catch (_) {}
      // Fallback: let RecordRTC/UA handle it; return true to avoid blocking
      return true;
    };

    for (const type of candidates) {
      if (isSupported(type)) return type;
    }
    return candidates[candidates.length - 1];
  }, []);

  const cleanup = useCallback((animationFrameId?: number) => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (displayStreamRef.current) {
      displayStreamRef.current.getTracks().forEach((track) => track.stop());
      displayStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current = null;
    }
    recorderRef.current = null;
    setState((prev) => ({ ...prev, status: "idle" }));
  }, []);

  const startRecording = useCallback(
    async (elementToRecord: HTMLElement, onCancel?: () => void) => {
      try {
        const rect = elementToRecord.getBoundingClientRect();

        const mediaConfig = {
          video: {
            displaySurface: "browser",
            width: { ideal: 3840 },
            height: { ideal: 2160 },
            frameRate: { ideal: 60 },
            cursor: "never",
          },
          audio: false,
          preferCurrentTab: true,
          selfBrowserSurface: "include",
        };

        let displayStream;
        try {
          displayStream =
            await navigator.mediaDevices.getDisplayMedia(mediaConfig);
        } catch (err) {
          onCancel?.();
          return;
        }

        displayStreamRef.current = displayStream;
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const canvas = document.createElement("canvas");
        const targetWidth = Math.min(rect.width * 2, 3840);
        const targetHeight = Math.min(rect.height * 2, 2160);
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext("2d", {
          alpha: false,
          desynchronized: true,
        });
        if (!ctx) throw new Error("Failed to get canvas context");

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        const video = document.createElement("video");
        videoRef.current = video;
        video.srcObject = displayStream;
        await video.play();

        const canvasStream = canvas.captureStream(60);
        streamRef.current = canvasStream;

        let animationFrameId: number;
        const drawVideo = () => {
          if (video.paused || video.ended) return;

          const currentRect = elementToRecord.getBoundingClientRect();
          const sourceX = Math.round(window.scrollX + currentRect.left);
          const sourceY = Math.round(window.scrollY + currentRect.top);
          const sourceWidth = Math.round(currentRect.width);
          const sourceHeight = Math.round(currentRect.height);

          const scaleFactor = video.videoWidth / window.innerWidth;
          const scaledX = sourceX * scaleFactor;
          const scaledY = sourceY * scaleFactor;
          const scaledWidth = sourceWidth * scaleFactor;
          const scaledHeight = sourceHeight * scaleFactor;

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(
            video,
            scaledX,
            scaledY,
            scaledWidth,
            scaledHeight,
            0,
            0,
            canvas.width,
            canvas.height,
          );

          animationFrameId = requestAnimationFrame(drawVideo);
        };

        drawVideo();

        const { default: RecordRTC } = await import("recordrtc");
        const chosenMimeType: string =
          selectBestSupportedMimeType() || "video/webm";
        selectedMimeTypeRef.current = chosenMimeType ?? "video/webm";
        const recorder = new RecordRTC(canvasStream, {
          type: "video",
          mimeType: chosenMimeType,
          frameRate: 60,
          quality: 100,
          videoBitsPerSecond: 5000000,
          canvas: {
            width: targetWidth,
            height: targetHeight,
          },
        } as any);

        recorderRef.current = recorder;
        recorder.startRecording();
        setState({ status: "recording", recordedVideo: null });

        (displayStream as any).getVideoTracks()[0].onended = () => {
          stopRecording();
          cleanup(animationFrameId);
        };
      } catch (error) {
        console.error("Recording error:", error);
        cleanup();
        onCancel?.();
      }
    },
    [cleanup],
  );

  const stopRecording = useCallback(() => {
    if (!recorderRef.current) return;

    recorderRef.current.stopRecording(() => {
      const blob = recorderRef.current.getBlob();
      const url = URL.createObjectURL(blob);

      const inferredType =
        (blob && blob.type) || selectedMimeTypeRef.current || "video/mp4";
      let extension = "mp4";
      if (inferredType.includes("webm")) extension = "webm";
      else if (inferredType.includes("mp4")) extension = "mp4";
      else if (
        inferredType.includes("x-matroska") ||
        inferredType.includes("mkv")
      )
        extension = "mkv";

      const a = document.createElement("a");
      a.href = url;
      a.download = `recording-${Date.now()}.${extension}`;
      a.click();

      setState((prev) => ({ ...prev, recordedVideo: url }));
      cleanup();
    });
  }, [cleanup]);

  return {
    recordingState: state,
    startRecording,
    stopRecording,
  };
};
