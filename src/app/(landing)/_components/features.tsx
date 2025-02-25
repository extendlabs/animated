"use client";

import { useState } from "react";

type Feature = {
  name: string;
  description: string;
  videoUrl?: string;
};

interface FeatureProps {
  features: Feature[];
  defaultVideo: string;
}

export function FeaturesTools({ features, defaultVideo }: FeatureProps) {
  const [activeFeature, setActiveFeature] = useState<string>(
    features[0]?.name ?? "",
  );
  const [currentVideo, setCurrentVideo] = useState<string>(defaultVideo);

  const handleFeatureClick = (feature: Feature, index: number) => {
    setActiveFeature(feature.name);

    if (feature.videoUrl) {
      setCurrentVideo(feature.videoUrl);
    }
  };

  const activeIndex = features.findIndex((f) => f.name === activeFeature);

  const transformPercentage =
    features.length > 1 ? (activeIndex / (features.length - 1)) * 218 : 0;

  return (
    <section className="space-y-16 py-24 md:py-32">
      <div className="mx-auto max-w-[58rem] text-center">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
          Simple Tools, Powerful Results
        </h2>
        <p className="mt-4 sm:text-lg">
          {`We've simplified code recording down to its essence. Every feature is
          thoughtfully designed to be intuitive yet powerful, helping you create
          professional demonstrations with ease.`}
        </p>
      </div>
      <div className="relative mx-auto flex max-w-5xl items-start justify-between gap-12">
        <div className="flex flex-col gap-4">
          {features.map((feature, index) => (
            <div
              key={feature.name}
              onClick={() => handleFeatureClick(feature, index)}
              className={`group relative flex max-w-lg cursor-pointer flex-col justify-between overflow-hidden rounded-lg p-6 transition-all duration-500 ease-out ${
                activeFeature === feature.name
                  ? "bg-emerald-800/50"
                  : "hover:bg-emerald-900/50"
              }`}
            >
              <div>
                <div className="flex items-center gap-4">
                  <h3 className="font-semibold text-white">{feature.name}</h3>
                </div>
                <p className="mt-2 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <figure
          className="relative aspect-video w-full overflow-hidden rounded-2xl border transition-all duration-300 ease-in-out"
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
      </div>
    </section>
  );
}

export function FeaturesCustomization({
  features,
  defaultVideo,
}: FeatureProps) {
  const [activeFeature, setActiveFeature] = useState<string>(
    features[0]?.name ?? "",
  );
  const [currentVideo, setCurrentVideo] = useState<string>(defaultVideo);

  const handleFeatureClick = (feature: Feature, index: number) => {
    setActiveFeature(feature.name);

    if (feature.videoUrl) {
      setCurrentVideo(feature.videoUrl);
    }
  };

  const activeIndex = features.findIndex((f) => f.name === activeFeature);

  const transformPercentage =
    features.length > 1 ? (activeIndex / (features.length - 1)) * 50 : 0;

  return (
    <section className="space-y-16 py-24 md:py-32">
      <div className="mx-auto max-w-[58rem] text-center">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
          Make It Your Own
        </h2>
        <p className="mt-4 sm:text-lg">
          Customize every detail of your code presentations with intuitive
          controls. From themes and backgrounds to card styles, shape your
          content exactly how you envision it.
        </p>
      </div>
      <div className="relative mx-auto flex max-w-5xl items-start justify-between gap-12">
        <div className="flex flex-col gap-4">
          {features.map((feature, index) => (
            <div
              key={feature.name}
              onClick={() => handleFeatureClick(feature, index)}
              className={`group relative flex max-w-lg cursor-pointer flex-col justify-between overflow-hidden rounded-lg p-6 transition-all duration-500 ease-out ${
                activeFeature === feature.name
                  ? "bg-emerald-800/50"
                  : "hover:bg-emerald-900/50"
              }`}
            >
              <div>
                <div className="flex items-center gap-4">
                  <h3 className="font-semibold text-white">{feature.name}</h3>
                </div>
                <p className="mt-2 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <figure
          className="relative aspect-video w-full overflow-hidden rounded-2xl border transition-all duration-300 ease-in-out"
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
      </div>
    </section>
  );
}
