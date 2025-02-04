import { ChevronRight, Star } from "lucide-react";
import Link from "next/link";

import FadeUp from "@/components/fadeup";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/app/_components/auth-dialog";

export default function HeroSection() {
  return (
    <section id="hero" className="space-y-10">
      <div className="min-h-[calc(100dvh-4rem)] md:h-[100dvh] md:space-y-24">
        <div className="mx-auto flex max-w-7xl flex-col items-center space-y-4 py-[32dvh] text-center">
          <div className="relative">
            <FadeUp delay={0.2} duration={0.8}>
              <h1 className="bg-gradient-to-br from-black via-zinc-600 to-zinc-400 bg-clip-text text-center text-3xl font-bold tracking-tight dark:from-white dark:via-neutral-200 dark:to-black/[0.6] sm:text-center sm:text-4xl md:text-6xl">
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
          </div>
        </div>
      </div>
    </section>
  );
}
