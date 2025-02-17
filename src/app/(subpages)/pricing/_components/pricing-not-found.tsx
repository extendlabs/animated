import FadeUp from "@/components/fadeup";

export const PricingNotFound = () => (
  <section id="pricing" className="space-y-4">
    <div className="min-h-dvh">
      <div className="mx-auto flex max-w-7xl flex-col items-center space-y-4 px-8 py-[6dvh] text-center">
        <div className="relative mx-auto max-w-2xl text-center lg:max-w-4xl">
          <FadeUp delay={0.2} duration={0.8}>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Pricing Plans
            </h1>
          </FadeUp>
          <FadeUp delay={0.4} duration={0.8}>
            <p className="mx-2 my-6 max-w-2xl text-base font-light tracking-tight dark:text-zinc-300 sm:text-xl">
              No pricing plans found.
            </p>
          </FadeUp>
        </div>
      </div>
    </div>
  </section>
);
