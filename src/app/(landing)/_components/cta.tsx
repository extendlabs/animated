import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="mb-20 px-6 md:mb-32">
      <div className="flex flex-col items-center justify-center gap-4 text-center md:py-32">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
          Ready to elevate your code sharing?
        </h2>
        <p className="mx-auto mb-4 max-w-2xl text-base font-light tracking-wide text-zinc-400 sm:text-lg">
          {`Join developers worldwide who've transformed their code sharing,
          documentation, and teaching through engaging visual demonstrations.`}
        </p>
        <Link href={"/dashboard"}>
          <Button
            variant="outline"
            className="mt-4 flex items-center justify-center gap-1 rounded-lg border-emerald-600 font-semibold text-white drop-shadow-[0_0_8px_rgba(16,185,129,0.6)] transition-all duration-300 hover:scale-105 hover:bg-emerald-600 hover:text-zinc-100"
          >
            Get Started Today
          </Button>
        </Link>
      </div>
    </section>
  );
}
