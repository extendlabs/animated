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
          description="Intuitive yet powerful features designed to help you create professional code demonstrations effortlessly."
          features={features}
        />
      </FadeUp>
      <FadeUp delay={0.6} duration={1}>
        <Features
          title="Make It Your Own"
          description="Customize every detail of your code presentations with intuitive controls. From themes and backgrounds to card styles, shape your content exactly how you envision it."
          features={customization}
        />
      </FadeUp>
      <CTA />
    </main>
  );
}
