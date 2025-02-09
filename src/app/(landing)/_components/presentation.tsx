"use client";
import { CodePresentation } from "@/app/dashboard/(main)/_components/code-presentation/code-presentation";
import { Redo } from "lucide-react";

export default function Presentation() {
  return (
    <section className="py-20">
      <div className="flex flex-col items-center justify-center gap-4 py-24 md:py-32">
        <div className="relative mx-auto max-w-[58rem] text-center">
          <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
            Try it <span className="italic"> yourself</span>
          </h2>
          <Redo className="absolute -right-12 top-8 z-10 size-16 rotate-90 text-emerald-500" />
        </div>
        <CodePresentation />
      </div>
    </section>
  );
}
