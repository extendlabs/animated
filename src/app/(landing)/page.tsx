import MouseMoveEffect from "@/components/mouse-move-effect";
import HeroSection from "./_components/hero";
import CTA from "./_components/cta";
import Footer from "../_components/footer";
import Features from "./_components/features";

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <Features />
      <CTA />
      <MouseMoveEffect />
    </main>
  );
}
