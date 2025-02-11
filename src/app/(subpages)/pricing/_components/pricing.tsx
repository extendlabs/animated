"use client";

import FadeUp from "@/components/fadeup";
import { getErrorRedirect, getStatusRedirect } from "@/lib/helpers";
import { getStripe } from "@/lib/stripe/client";
import {
  cancelStripeSubscription,
  checkoutWithStripe,
} from "@/lib/stripe/server";
import { type User } from "@supabase/supabase-js";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { PRICING_FREE_DATA } from "@/constants/pricing";
import { useLoginStore } from "@/zustand/useLoginStore";
import { useAuthStore } from "@/zustand/useAuthStore";
import {
  type BillingInterval,
  type Price,
  type ProductWithPrices,
  type SubscriptionWithProduct,
} from "@/types/pricing.type";
import { PricingCard } from "./pricing-card";
import { type Json } from "types_db";
import BillingToggle from "./billing-toggle";

type Props = {
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
};

export default function Pricing({ user, products, subscription }: Props) {
  const router = useRouter();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("month");
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const currentPath = usePathname();
  const { setIsDialogOpen } = useLoginStore();
  const { setSubscription } = useAuthStore();

  const handleIntervalChange = (interval: BillingInterval) => {
    setBillingInterval(interval);
  };
  const handleStripeCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);

    if (!user) {
      setPriceIdLoading(undefined);
      setIsDialogOpen(true);
      return;
    }

    const { errorRedirect, sessionId } = await checkoutWithStripe(
      price,
      currentPath,
    );

    if (errorRedirect) {
      setPriceIdLoading(undefined);
      return router.push(errorRedirect);
    }

    if (!sessionId) {
      setPriceIdLoading(undefined);
      return router.push(
        getErrorRedirect(
          currentPath,
          "An unknown error occurred.",
          "Please try again later or contact a system administrator.",
        ),
      );
    }

    const stripe = await getStripe();
    await stripe?.redirectToCheckout({ sessionId });
    setPriceIdLoading(undefined);
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    const result = await cancelStripeSubscription(subscriptionId);
    const redirectPath = result.success
      ? getStatusRedirect(currentPath, "Success!", result.message)
      : getErrorRedirect(currentPath, "Error", result.message);

    if (result.success) {
      setSubscription(null);
    }
    router.push(redirectPath);
  };

  if (!products.length) {
    return (
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
  }

  const sortedProducts = [...products].sort((a, b) => {
    const aPopular =
      (a.metadata as Record<string, Json | undefined>)?.most_popular === "true";
    const bPopular =
      (b.metadata as Record<string, Json | undefined>)?.most_popular === "true";
    return bPopular ? 1 : aPopular ? -1 : 0;
  });

  return (
    <section id="pricing" className="mb-8 space-y-4 overflow-hidden">
      <div className="mx-auto flex max-w-7xl flex-col items-center space-y-4 px-8 py-[6dvh] text-center">
        <div className="relative mx-auto max-w-2xl text-center lg:max-w-4xl">
          <FadeUp delay={0.2} duration={0.8}>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Pricing Plans
            </h1>
          </FadeUp>
          <FadeUp delay={0.4} duration={0.8}>
            <p className="mx-2 my-6 max-w-2xl text-base font-light tracking-tight dark:text-zinc-300 sm:text-xl">
              Start animating for free, then choose a subscription plan to unlock additional features.
            </p>
          </FadeUp>
          <BillingToggle
            billingInterval={billingInterval}
            onChange={handleIntervalChange}
          />
          <div className="gradient pointer-events-none absolute inset-0 -z-10 block opacity-30 blur-3xl"></div>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 lg:grid-cols-3">
          <PricingCard
            name={PRICING_FREE_DATA.name}
            description={PRICING_FREE_DATA.description}
            price={PRICING_FREE_DATA.price}
            interval={billingInterval}
            features={PRICING_FREE_DATA.features}
            buttonText="Get started"
            onButtonClick={() => router.push("/")}
          />
          {sortedProducts.map((product) => {
            const price = product?.prices?.find(
              (price) => price.interval === billingInterval
            );
            if (!price) return null;

            const priceString = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: price.currency!,
              minimumFractionDigits: 0,
            }).format((price?.unit_amount ?? 0) / 100);

            const productFeatures = (product?.metadata as any)?.features?.split(",") ?? [];
            const isPopular = (product.metadata as any)?.most_popular === "true";

            return (
              <PricingCard
                key={product.id}
                isPopular={isPopular}
                name={product.name}
                description={product.description}
                price={priceString}
                interval={billingInterval}
                features={productFeatures}
                buttonText={subscription?.prices?.id === price.id ? "Cancel" : "Subscribe"}
                buttonDisabled={
                  priceIdLoading === price.id ||
                  (subscription?.prices?.id === price.id
                    ? false
                    : !subscription
                      ? false
                      : true)
                }
                onButtonClick={() =>
                  subscription?.prices?.id === price.id
                    ? handleCancelSubscription(subscription?.id as string)
                    : handleStripeCheckout(price)
                }
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
