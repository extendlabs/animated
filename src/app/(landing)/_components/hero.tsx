"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FadeUp from "@/components/fadeup";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import LandingPresentation from "./landing-presentation/landing-presentation";
import { Redo, Undo } from "lucide-react";

const INITIAL_SCALE = 1;
const MIN_SCALE = 0.8;
const SCROLL_FACTOR = 0.0005;

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
      const opacityThreshold = 0.85;
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
    <section id="hero" className="relative mt-32 space-y-10 px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center pt-12 text-center">
        <div className="relative mb-16 space-y-6">
          <FadeUp delay={0.3} duration={1}>
            <h1 className="text-center text-[2rem] font-bold leading-[2.5rem] tracking-tight md:text-6xl md:leading-[4rem]">
              Bring your code to life.
            </h1>
          </FadeUp>
          <FadeUp delay={0.6} duration={1.2}>
            <p className="mx-auto max-w-2xl text-base font-medium tracking-wide text-zinc-400 sm:text-lg">
              {`Create vivid, engaging recordings that
                showcase your code in motion. Perfect for tutorials,
                documentation, and those 'aha' moments that deserve to be
                shared.`}
            </p>
          </FadeUp>
          <FadeUp delay={0.9} duration={1.2}>
            <div className="flex items-center justify-center gap-3">
              <Link href="/dashboard">
                <Button
                  variant="default"
                  className="flex items-center justify-center gap-1 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-800 font-semibold text-zinc-100"
                >
                  Get started for free
                </Button>
              </Link>
            </div>
          </FadeUp>
          <FadeUp delay={1} duration={1.2}>
            <p className="text-xs text-muted-foreground">
              No credit card required.
            </p>
          </FadeUp>
        </div>

        <div className="relative max-w-full">
          <FadeUp delay={1.3} duration={1.3}>
            <div className="relative lg:hidden">
              <div className="relative rounded-lg shadow-lg">
                <div className="group relative z-10 rounded-xl bg-slate-500/20 p-2 ring-1 ring-slate-200/50">
                  <video
                    autoPlay
                    loop
                    playsInline
                    preload="auto"
                    muted
                    className="rounded-md border transition-all duration-200 ease-out"
                    poster="https://xvylq80vkq.ufs.sh/f/d0hpkByvvVRPntWJ8UshRk0CQS4IywLjO3lae16nDZTmqtGo"
                  >
                    <source
                      src={
                        "https://xvylq80vkq.ufs.sh/f/d0hpkByvvVRPnGTruaQshRk0CQS4IywLjO3lae16nDZTmqtG"
                      }
                      type="video/mp4"
                    />
                  </video>
                </div>
              </div>
            </div>
            <div className="relative mt-4 hidden lg:block">
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
                  <video
                    autoPlay
                    loop
                    playsInline
                    preload="auto"
                    muted
                    className="rounded-md border transition-all duration-200 ease-out"
                    poster="https://xvylq80vkq.ufs.sh/f/d0hpkByvvVRPntWJ8UshRk0CQS4IywLjO3lae16nDZTmqtGo"
                  >
                    <source
                      src={
                        "https://xvylq80vkq.ufs.sh/f/d0hpkByvvVRPnGTruaQshRk0CQS4IywLjO3lae16nDZTmqtG"
                      }
                      type="video/mp4"
                    />
                  </video>
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
                <div className="absolute -right-16 top-2 flex rotate-[15deg] flex-col items-center justify-center">
                  <span className="text-3xl font-bold">Play demo yourself</span>
                  <Redo
                    strokeWidth={2}
                    className="size-16 rotate-[115deg] text-emerald-500"
                  />
                </div>
              </motion.div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
