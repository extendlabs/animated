import { PulsatingOutlineShadowButton } from "@/components/extendui/pulsating-shadow-button";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="px-6 pb-20">
      <div className="flex flex-col items-center justify-center gap-4 text-center md:py-32">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
          Ready to elevate your code sharing?
        </h2>
        <p className="mb-4 max-w-[42rem] leading-normal sm:text-xl sm:leading-8">
          {`Join developers worldwide who've transformed their code sharing,
          documentation, and teaching through engaging visual demonstrations.`}
        </p>
        <Link href={"/dashboard"}>
          <PulsatingOutlineShadowButton size="lg">
            Get Started Today
          </PulsatingOutlineShadowButton>
        </Link>
      </div>
    </section>
  );
}
