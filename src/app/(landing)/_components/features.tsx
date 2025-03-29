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
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const featuresContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Preload all images
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

  // Initialize the component with the first feature
  useEffect(() => {
    if (features.length > 0) {
      const firstFeature = features[0] as Feature;
      setActiveFeature(firstFeature.name);

      // Find the first valid video URL
      const firstVideoUrl =
        firstFeature.videoUrl ||
        features.find((f) => f.videoUrl)?.videoUrl ||
        "";

      // Set the poster image
      const firstPoster =
        firstFeature.firstFrame ||
        features.find((f) => f.firstFrame)?.firstFrame ||
        "";

      setCurrentVideo(firstVideoUrl);
      setCurrentPoster(firstPoster);
    }
  }, [features]);

  // Reload video when source changes
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && currentVideo) {
      // Force reload when source changes
      videoElement.load();
    }
  }, [currentVideo]);

  const handleFeatureClick = (feature: Feature) => {
    setActiveFeature(feature.name);

    // Set video with fallback logic
    if (feature.videoUrl) {
      setCurrentVideo(feature.videoUrl);
    } else {
      // Find first feature with a valid video URL as fallback
      const fallbackVideo = features.find((f) => f.videoUrl)?.videoUrl || "";
      setCurrentVideo(fallbackVideo);
    }

    // Set poster image
    if (feature.firstFrame) {
      setCurrentPoster(feature.firstFrame);
    } else {
      // Find first feature with a valid poster as fallback
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

  // Update feature height based on actual DOM measurements
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

    // Debounce resize event for better performance
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

  // Loading component shown while images preload
  const LoadingScreen = () => (
    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gray-800">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-emerald-500"></div>
        <p className="text-gray-300">Loading assets...</p>
      </div>
    </div>
  );

  // Video player component to avoid duplication
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
            className="h-full w-full rounded-2xl object-cover p-1"
          >
            <source src={currentVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gray-800 p-1">
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
        <p className="mt-4 sm:text-lg">{description}</p>
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

        {/* Desktop video player with transform animation */}
        <figure
          className="relative hidden aspect-video w-full overflow-hidden rounded-2xl border transition-all duration-300 ease-in-out md:block"
          style={{
            transform: `translateY(${transformPercentage}px)`,
          }}
        >
          <VideoPlayer />
        </figure>

        {/* Mobile video player */}
        <figure className="relative aspect-video w-full overflow-hidden rounded-2xl border transition-all duration-300 ease-in-out md:hidden">
          <VideoPlayer />
        </figure>
      </div>

      {/* Hidden div to preload all images */}
      <div className="hidden">
        {features.map((feature) =>
          feature.firstFrame ? (
            <img
              key={feature.firstFrame}
              src={feature.firstFrame}
              alt="Preloaded image"
              onLoad={() => {
                setLoadedImages(
                  (prev) => new Set([...prev, feature.firstFrame!]),
                );
              }}
            />
          ) : null,
        )}
      </div>
    </section>
  );
}
