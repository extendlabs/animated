import HeroSection from "./_components/hero";

import CTA from "./_components/cta";
import { FeaturesCustomization, FeaturesTools } from "./_components/features";
import { customization, features } from "@/constants/features";
import FadeUp from "@/components/fadeup";

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <FadeUp delay={0.4} duration={0.8}>
        <FeaturesTools
          features={features}
          defaultVideo="https://xvylq80vkq.ufs.sh/f/d0hpkByvvVRPJ94VhKZdoSVxuY6UW8X2KsL4HanzvlmbEt0I"
        />
      </FadeUp>
      <FadeUp delay={0.6} duration={0.8}>
        <FeaturesCustomization
          features={customization}
          defaultVideo="https://xvylq80vkq.ufs.sh/f/d0hpkByvvVRPJ94VhKZdoSVxuY6UW8X2KsL4HanzvlmbEt0I"
        />
      </FadeUp>
      <CTA />
    </main>
  );
}
