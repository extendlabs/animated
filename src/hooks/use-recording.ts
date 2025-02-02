import { useState, useRef, useCallback } from 'react';

export interface RecordingState {
  status: 'idle' | 'recording';
  recordedVideo: string | null;
}

export const useRecording = () => {
  const [state, setState] = useState<RecordingState>({
    status: 'idle',
    recordedVideo: null
  });
  const recorderRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async (elementToRecord: HTMLElement) => {
    try {
      const rect = elementToRecord.getBoundingClientRect();
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const absoluteLeft = rect.left + scrollLeft;
      const absoluteTop = rect.top + scrollTop;

      const cursorStyle = document.createElement('style');
      cursorStyle.textContent = `.recording-in-progress * { cursor: none !important; }`;
      document.head.appendChild(cursorStyle);
      
      elementToRecord.classList.add('recording-in-progress');

      const mediaConfig = {
        video: {
          displaySurface: 'browser',
          width: { ideal: 15360 },
          height: { ideal: 8640 },
          frameRate: { ideal: 240 },
          cursor: 'never',
          resizeMode: 'none',
          contentHint: 'detail',
          mouseCursor: 'never',
          showMouseCursor: false
        },
        audio: false,
        preferCurrentTab: true,
        selfBrowserSurface: 'include',
      };

      const stream = await navigator.mediaDevices.getDisplayMedia(mediaConfig);
      
      const canvas = document.createElement('canvas');
      canvas.width = rect.width * 4;
      canvas.height = rect.height * 4;
      
      const ctx = canvas.getContext('2d', {
        alpha: false,
        desynchronized: true,
        willReadFrequently: false
      });
      
      if (!ctx) throw new Error('Failed to get canvas context');
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      const canvasStream = canvas.captureStream(240);
      streamRef.current = canvasStream;

      const getScaleFactor = () => {
        return video.videoWidth / window.screen.width;
      };

      const drawVideo = () => {
        if (video.paused || video.ended) return;
        
        const scaleFactor = getScaleFactor();
        const scaledLeft = absoluteLeft * scaleFactor;
        const scaledTop = absoluteTop * scaleFactor;
        const scaledWidth = rect.width * scaleFactor;
        const scaledHeight = rect.height * scaleFactor;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.drawImage(
          video,
          Math.round(scaledLeft),
          Math.round(scaledTop),
          Math.round(scaledWidth),
          Math.round(scaledHeight),
          0,
          0,
          canvas.width,
          canvas.height
        );
        
        requestAnimationFrame(drawVideo);
      };

      drawVideo();

      const { default: RecordRTC } = await import('recordrtc');
      const recorder: any = new RecordRTC(canvasStream, {
        type: 'video',
        mimeType: 'video/webm;codecs=vp9',
        frameRate: 240,
        quality: 100,
        videoBitsPerSecond: 800000,
        videoConstraints: {
          width: canvas.width,
          height: canvas.height,
          frameRate: 240
        },
        bitsPerSecond: 800000,
        frameInterval: 1,
        numberOfAudioChannels: undefined,
        disableLogs: true,
        checkForInactiveTracks: false,
        timeSlice: 250
      } as any);

      recorderRef.current = recorder;
      recorder.startRecording();
      setState({ status: 'recording', recordedVideo: null });

      (stream as any).getVideoTracks()[0].onended = () => {
        stopRecording();
        stream.getTracks().forEach(track => track.stop());
      };
    } catch (error) {
      console.error('Recording error:', error);
      cleanup();
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (!recorderRef.current) return;

    recorderRef.current.stopRecording(() => {
      const blob = recorderRef.current.getBlob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `recording-${Date.now()}-uhd.webm`;
      a.click();

      setState({ status: 'idle', recordedVideo: url });
      cleanup();
    });
  }, []);

  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    recorderRef.current = null;
    
    const cursorStyle = document.querySelector('style');
    if (cursorStyle?.textContent?.includes('recording-in-progress')) {
      cursorStyle.remove();
    }
    document.querySelectorAll('.recording-in-progress').forEach(el => {
      el.classList.remove('recording-in-progress');
    });
  }, []);

  return {
    recordingState: state,
    startRecording,
    stopRecording
  };
};