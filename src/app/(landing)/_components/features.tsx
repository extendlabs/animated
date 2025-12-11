"use client";

import { useState, useEffect, useRef } from "react";

type Feature = {
  name: string;
  description: string;
  videoUrl?: string;
  firstFrame?: string;
};

interface FeatureProps {
  title: string;
  description: string;
  features: Feature[];
}

export function Features({ title, description, features }: FeatureProps) {
  const [activeFeature, setActiveFeature] = useState<string>("");
  const [currentVideo, setCurrentVideo] = useState<string>("");
  const [currentPoster, setCurrentPoster] = useState<string>("");
  const [featureHeight, setFeatureHeight] = useState<number>(120);
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);
  const [, setLoadedImages] = useState<Set<string>>(new Set());

  const featuresContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (features.length === 0) return;

    const imagesToLoad = features
      .map((feature) => feature.firstFrame)
      .filter((url): url is string => !!url);

    if (imagesToLoad.length === 0) {
      setImagesLoaded(true);
      return;
    }

    let loadedCount = 0;
    const newLoadedImages = new Set<string>();

    imagesToLoad.forEach((imageUrl) => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        newLoadedImages.add(imageUrl);
        setLoadedImages((prev) => new Set([...prev, imageUrl]));

        if (loadedCount === imagesToLoad.length) {
          setImagesLoaded(true);
        }
      };

      img.onerror = () => {
        loadedCount++;
        console.error(`Failed to load image: ${imageUrl}`);

        if (loadedCount === imagesToLoad.length) {
          setImagesLoaded(true);
        }
      };

      img.src = imageUrl;
    });
  }, [features]);

  useEffect(() => {
    if (features.length > 0) {
      const firstFeature = features[0] as Feature;
      setActiveFeature(firstFeature.name);

      const firstVideoUrl =
        firstFeature.videoUrl ||
        features.find((f) => f.videoUrl)?.videoUrl ||
        "";

      const firstPoster =
        firstFeature.firstFrame ||
        features.find((f) => f.firstFrame)?.firstFrame ||
        "";

      setCurrentVideo(firstVideoUrl);
      setCurrentPoster(firstPoster);
    }
  }, [features]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && currentVideo) {
      videoElement.load();
    }
  }, [currentVideo]);

  const handleFeatureClick = (feature: Feature) => {
    setActiveFeature(feature.name);

    if (feature.videoUrl) {
      setCurrentVideo(feature.videoUrl);
    } else {
      const fallbackVideo = features.find((f) => f.videoUrl)?.videoUrl || "";
      setCurrentVideo(fallbackVideo);
    }

    if (feature.firstFrame) {
      setCurrentPoster(feature.firstFrame);
    } else {
      const fallbackPoster =
        features.find((f) => f.firstFrame)?.firstFrame || "";
      setCurrentPoster(fallbackPoster);
    }
  };

  const activeIndex = features.findIndex((f) => f.name === activeFeature);

  // Calculate dynamic transform based on feature height
  const calculateTransform = () => {
    if (features.length <= 1) return 0;

    const scalingFactor = 0.38;
    const totalRange = (features.length - 1) * featureHeight * scalingFactor;
    return (activeIndex / (features.length - 1)) * totalRange;
  };

  const transformPercentage = calculateTransform();

  useEffect(() => {
    const updateFeatureHeight = () => {
      if (featuresContainerRef.current) {
        const featureElements =
          featuresContainerRef.current.querySelectorAll(".feature-item");
        if (featureElements.length > 1) {
          const firstFeature = featureElements[0] as HTMLElement;
          const lastFeature = featureElements[
            featureElements.length - 1
          ] as HTMLElement;

          if (firstFeature && lastFeature) {
            const totalHeight =
              lastFeature.offsetTop +
              lastFeature.offsetHeight -
              firstFeature.offsetTop;
            const avgHeight = totalHeight / (featureElements.length - 1);
            setFeatureHeight(avgHeight);
          }
        }
      }
    };

    updateFeatureHeight();

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateFeatureHeight, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [features.length]);

  const LoadingScreen = () => (
    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gray-800">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-emerald-500"></div>
        <p className="text-gray-300">Loading assets...</p>
      </div>
    </div>
  );

  const VideoPlayer = () => {
    if (!imagesLoaded) {
      return <LoadingScreen />;
    }

    return (
      <div className="absolute inset-0">
        {currentVideo ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            playsInline
            preload="auto"
            muted
            poster={currentPoster}
            className="h-full w-full rounded-2xl bg-slate-900/20 object-cover p-2"
          >
            <source src={currentVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-2xl bg-slate-700/20 p-2 ring-slate-700/20">
            {currentPoster ? (
              <img
                src={currentPoster}
                alt="Feature preview"
                className="h-full w-full rounded-2xl object-cover"
              />
            ) : (
              <p className="text-gray-400">No video available</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="space-y-16 px-6 pb-12 sm:pb-24 md:pb-32">
      <div className="mx-auto max-w-[58rem] text-center">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-4xl text-base font-light tracking-wide text-zinc-400 sm:text-lg">
          {description}
        </p>
      </div>
      <div className="relative mx-auto flex max-w-5xl flex-col items-start justify-between gap-12 md:flex-row">
        <div className="scrollbar-hide flex w-full items-center gap-4 overflow-x-auto pb-4 md:w-auto md:flex-col md:pb-0">
          <div className="flex gap-4 md:flex-col" ref={featuresContainerRef}>
            {features.map((feature) => (
              <div
                key={feature.name}
                onClick={() => handleFeatureClick(feature)}
                className={`feature-item group relative flex min-w-[280px] cursor-pointer flex-col justify-center overflow-hidden rounded-lg p-6 transition-all duration-500 ease-out md:min-w-0 md:max-w-lg ${
                  activeFeature === feature.name
                    ? "bg-emerald-800/50"
                    : "hover:bg-emerald-900/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <h3 className="font-semibold text-white">{feature.name}</h3>
                </div>
                <p className="mt-2 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <figure
          className="relative hidden aspect-video w-full overflow-hidden rounded-2xl border border-slate-700/20 transition-all duration-300 ease-in-out md:block"
          style={{
            transform: `translateY(${transformPercentage}px)`,
          }}
        >
          <VideoPlayer />
        </figure>

        <figure className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-700/20 transition-all duration-300 ease-in-out md:hidden">
          <VideoPlayer />
        </figure>
      </div>

      <div className="hidden">
        {features.map((feature) =>
          feature.firstFrame ? (
            <img
              key={feature.firstFrame}
              src={feature.firstFrame}
              alt="Preloaded image"
              onLoad={() => {
                setLoadedImages(
                  (prev) => new Set([...prev, feature.firstFrame!])
                );
              }}
            />
          ) : null
        )}
      </div>
    </section>
  );
}
