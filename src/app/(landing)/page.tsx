import HeroSection from "./_components/hero";
import CTA from "./_components/cta";
import { Features } from "./_components/features";
import { customization, features } from "@/constants/features";
import FadeUp from "@/components/fadeup";
import Customers from "./_components/customers";

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <FadeUp delay={0.2} duration={1}>
        <Customers />
      </FadeUp>
      <FadeUp delay={0.4} duration={1}>
        <Features
          title="Simple Tools, Powerful Results"
          description="We've simplified code recording down to its essence. Every feature is thoughtfully designed to be intuitive yet powerful, helping you create professional demonstrations with ease."
          features={features}
          defaultVideo="https://xvylq80vkq.ufs.sh/f/d0hpkByvvVRPJ94VhKZdoSVxuY6UW8X2KsL4HanzvlmbEt0I"
        />
      </FadeUp>
      <FadeUp delay={0.6} duration={1}>
        <Features
          title="Make It Your Own"
          description="Customize every detail of your code presentations with intuitive controls. From themes and backgrounds to card styles, shape your content exactly how you envision it."
          features={customization}
          defaultVideo="https://xvylq80vkq.ufs.sh/f/d0hpkByvvVRPJ94VhKZdoSVxuY6UW8X2KsL4HanzvlmbEt0I"
        />
      </FadeUp>
      <CTA />
    </main>
  );
}
