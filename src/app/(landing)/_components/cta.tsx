import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="py-20">
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center md:py-32">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
          Ready to elevate your code sharing?
        </h2>
        <p className="max-w-[42rem] leading-normal sm:text-xl sm:leading-8">
          Join developers worldwide who've transformed their code sharing,
          documentation, and teaching through engaging visual demonstrations.
        </p>
        <Button size="lg" className="mt-4">
          Get Started Today
        </Button>
      </div>
    </section>
  );
}
