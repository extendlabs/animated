"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FadeUp from "@/components/fadeup";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import LandingPresentation from "./landing-presentation";
import { Redo, Undo } from "lucide-react";

const INITIAL_SCALE = 1.1;
const MIN_SCALE = 0.8;
const SCROLL_FACTOR = 0.001;

interface ScaleState {
  scale: number;
  opacity: number;
}

export default function HeroSection() {
  const [scaleState, setScaleState] = useState<ScaleState>({
    scale: INITIAL_SCALE,
    opacity: 1,
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const newScale = Math.max(
        MIN_SCALE,
        INITIAL_SCALE - scrollPosition * SCROLL_FACTOR,
      );
      const opacityThreshold = 0.9;
      const opacityRange = opacityThreshold - MIN_SCALE;
      const opacity =
        newScale <= opacityThreshold
          ? Math.max(0, (newScale - MIN_SCALE) / opacityRange)
          : 1;

      setScaleState({
        scale: newScale,
        opacity,
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="hero" className="mb-44 space-y-10">
      <div className="min-h-[calc(100dvh-4rem)] md:h-[100dvh] md:space-y-24">
        <div className="mx-auto flex max-w-7xl flex-col items-center space-y-4 py-[15dvh] text-center">
          <div className="relative mb-24">
            <FadeUp delay={0.2} duration={0.8}>
              <h1 className="bg-gradient-to-br from-black via-zinc-600 to-zinc-400 bg-clip-text text-center text-3xl font-bold tracking-wide dark:from-white dark:via-neutral-200 dark:to-black/[0.6] sm:text-center sm:text-4xl md:text-6xl">
                Bring your code to life.
              </h1>
            </FadeUp>
            <FadeUp delay={0.4} duration={0.8}>
              <p className="mx-2 mt-6 max-w-2xl text-base font-light tracking-tight dark:text-zinc-300 sm:text-lg">
                Create vivid, engaging{" "}
                <span className="inline font-semibold">recordings</span>{" "}
                {`that
                showcase your code in motion. Perfect for tutorials,
                documentation, and those 'aha' moments that deserve to be
                shared.`}
              </p>
            </FadeUp>
            <FadeUp delay={0.6} duration={1}>
              <div className="mt-6 flex items-center justify-center gap-3">
                <Link href="/dashboard">
                  <Button
                    variant="default"
                    className="flex items-center justify-center gap-1 bg-emerald-500 hover:bg-emerald-600"
                  >
                    Get started for free
                  </Button>
                </Link>
              </div>
            </FadeUp>
            <FadeUp delay={0.8} duration={1}>
              <p className="mt-2 text-xs text-muted-foreground">
                No credit card required.
              </p>
            </FadeUp>
          </div>

          <div className="relative mx-auto w-full">
            <FadeUp delay={1} duration={1.2}>
              <div className="relative mt-16">
                <motion.div
                  className="relative rounded-lg shadow-lg"
                  style={{
                    scale: scaleState.scale,
                  }}
                  animate={{
                    opacity: scaleState.opacity,
                  }}
                  transition={{
                    opacity: { duration: 0.3, ease: "easeOut" },
                    scale: { duration: 0.1, ease: "easeOut" },
                  }}
                >
                  <div className="group relative z-10 rounded-xl bg-slate-500/20 p-2 ring-1 ring-slate-200/50">
                    <Image
                      src="https://xvylq80vkq.ufs.sh/f/d0hpkByvvVRPSffPdKz4crUtnskQM6JR0f94vmwAdeE7WBpY"
                      alt="screen"
                      width={3818}
                      height={2160}
                      className="rounded-md border transition-all duration-200 ease-out"
                    />
                  </div>
                </motion.div>
                <motion.div
                  className="absolute inset-0 rounded-lg shadow-lg"
                  style={{
                    scale: scaleState.scale,
                  }}
                  animate={{
                    opacity: 1 - scaleState.opacity,
                  }}
                  transition={{
                    opacity: { duration: 0.3, ease: "easeOut" },
                    scale: { duration: 0.1, ease: "easeOut" },
                  }}
                >
                  <div className="z-50 h-full w-full rounded-xl bg-slate-500/20 p-2 ring-1 ring-slate-200/50">
                    <LandingPresentation />
                  </div>
                  <div className="absolute -right-16 -top-4 flex rotate-12 flex-col items-center justify-center">
                    <span className="text-3xl font-bold">
                      Try demo yourself
                    </span>
                    <Redo
                      strokeWidth={3}
                      className="size-16 rotate-[120deg] text-emerald-500"
                    />
                  </div>
                </motion.div>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
