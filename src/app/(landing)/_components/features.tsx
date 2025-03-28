"use client";

import { useState, useEffect, useRef } from "react";

type Feature = {
  name: string;
  description: string;
  videoUrl?: string;
};

interface FeatureProps {
  title: string;
  description: string;
  features: Feature[];
  defaultVideo: string;
}

export function Features({
  title,
  description,
  features,
  defaultVideo,
}: FeatureProps) {
  const [activeFeature, setActiveFeature] = useState<string>(
    features[0]?.name ?? "",
  );
  const [currentVideo, setCurrentVideo] = useState<string>(defaultVideo);
  const [featureHeight, setFeatureHeight] = useState<number>(120); // Default estimate
  const featuresContainerRef = useRef<HTMLDivElement>(null);

  const handleFeatureClick = (feature: Feature, index: number) => {
    setActiveFeature(feature.name);

    if (feature.videoUrl) {
      setCurrentVideo(feature.videoUrl);
    }
  };

  const activeIndex = features.findIndex((f) => f.name === activeFeature);

  // Calculate dynamic transform based on viewport height and number of features
  const calculateTransform = () => {
    if (features.length <= 1) return 0;

    // Calculate total movement range based on actual feature height
    // Apply a scaling factor to reduce the amount of movement (0.6 = 60% of original movement)
    const scalingFactor = 0.38;
    const totalRange = (features.length - 1) * featureHeight * scalingFactor;

    // Calculate current position percentage
    return (activeIndex / (features.length - 1)) * totalRange;
  };

  // Calculate the transform dynamically
  const transformPercentage = calculateTransform();

  // Update feature height based on actual DOM measurements
  useEffect(() => {
    const updateFeatureHeight = () => {
      if (featuresContainerRef.current) {
        const featureElements =
          featuresContainerRef.current.querySelectorAll(".feature-item");
        if (featureElements.length > 0) {
          // Calculate average height of feature items including gap
          const firstFeature = featureElements[0] as HTMLElement;
          const lastFeature = featureElements[
            featureElements.length - 1
          ] as HTMLElement;

          if (firstFeature && lastFeature && featureElements.length > 1) {
            // Get total height and divide by number of features minus 1 to get average height with gap
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

    // Update immediately and on window resize
    updateFeatureHeight();
    window.addEventListener("resize", updateFeatureHeight);

    return () => {
      window.removeEventListener("resize", updateFeatureHeight);
    };
  }, [features.length]);

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
            {features.map((feature, index) => (
              <div
                key={feature.name}
                onClick={() => handleFeatureClick(feature, index)}
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
          className="relative hidden aspect-video w-full overflow-hidden rounded-2xl border transition-all duration-300 ease-in-out md:block"
          style={{
            transform: `translateY(${transformPercentage}px)`,
          }}
        >
          <div className="absolute inset-0">
            <video
              autoPlay
              loop
              playsInline
              preload="auto"
              muted
              className="h-full w-full rounded-2xl object-cover p-1"
            >
              <source src={currentVideo} type="video/mp4" />
            </video>
          </div>
        </figure>
        <figure className="relative aspect-video w-full overflow-hidden rounded-2xl border transition-all duration-300 ease-in-out md:hidden">
          <div className="absolute inset-0">
            <video
              autoPlay
              loop
              playsInline
              preload="auto"
              muted
              className="h-full w-full rounded-2xl object-cover p-1"
            >
              <source src={currentVideo} type="video/mp4" />
            </video>
          </div>
        </figure>
      </div>
    </section>
  );
}
