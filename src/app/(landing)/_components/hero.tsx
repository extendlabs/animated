"use client";
import FadeUp from "@/components/fadeup";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [scale, setScale] = useState(1.1);

  useEffect(() => {
    const handleScroll = () => {
      // Get scroll position
      const scrollPosition = window.scrollY;

      // Calculate scale based on scroll position
      // You can adjust these values to control the scaling effect
      const minScale = 0.8; // Minimum scale
      const scrollFactor = 0.001; // How fast it scales down

      const newScale = Math.max(minScale, 1.1 - scrollPosition * scrollFactor);
      setScale(newScale);
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <section id="hero" className="mb-44 space-y-10">
      <div className="min-h-[calc(100dvh-4rem)] md:h-[100dvh] md:space-y-24">
        <div className="mx-auto flex max-w-7xl flex-col items-center space-y-4 py-[20dvh] text-center">
          <div className="relative">
            <FadeUp delay={0.2} duration={0.8}>
              <h1 className="bg-gradient-to-br from-black via-zinc-600 to-zinc-400 bg-clip-text text-center text-3xl font-bold tracking-wide dark:from-white dark:via-neutral-200 dark:to-black/[0.6] sm:text-center sm:text-4xl md:text-6xl">
                Bring your code to life.
              </h1>
            </FadeUp>
            <FadeUp delay={0.4} duration={0.8}>
              <p className="mx-2 mt-6 max-w-2xl text-base font-light tracking-tight dark:text-zinc-300 sm:text-lg">
                Create vivid, engaging{" "}
                <span className="inline font-semibold">recordings</span> that
                showcase your code in motion. Perfect for tutorials,
                documentation, and those 'aha' moments that deserve to be
                shared.
              </p>
            </FadeUp>
            <FadeUp delay={0.6} duration={1}>
              <div className="mt-6 flex items-center justify-center gap-3">
                <Button
                  variant="default"
                  className="flex items-center justify-center gap-1"
                >
                  Get started for free
                </Button>
              </div>
            </FadeUp>
            <FadeUp delay={0.8} duration={1}>
              <p className="mt-2 text-xs text-muted-foreground">
                No credit card required.
              </p>
            </FadeUp>
          </div>

          <div
            className="relative mx-auto flex w-full items-center justify-center"
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.1s ease-out",
            }}
          >
            <FadeUp delay={1} duration={1.2}>
              <div className="relative mt-16 max-w-screen-lg rounded-lg shadow-lg">
                <div className="group relative cursor-pointer rounded-xl bg-slate-500/20 p-2 ring-1 ring-slate-200/50 backdrop-blur-md dark:bg-gray-900/70 dark:ring-white/10">
                  <Image
                    src="/screen.png"
                    alt="screen"
                    width={1000}
                    height={1000}
                    className="rounded-md border transition-all duration-200 ease-out group-hover:brightness-[0.8]"
                  />
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
