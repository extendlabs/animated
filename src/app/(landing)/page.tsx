import MouseMoveEffect from "@/components/mouse-move-effect";
import HeroSection from "./_components/hero";
import CTA from "./_components/cta";
import Features from "./_components/features";
import Presentation from "./_components/presentation";

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <Features />
      <Presentation />
      <CTA />
      {/* <MouseMoveEffect /> */}
    </main>
  );
}
