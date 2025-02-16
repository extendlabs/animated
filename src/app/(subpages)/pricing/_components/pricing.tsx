"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import FadeUp from "@/components/fadeup";
import { getErrorRedirect } from "@/lib/helpers";
import { getStripe } from "@/lib/stripe/client";
import { PRICING_FREE_DATA } from "@/constants/pricing";
import { useLoginStore } from "@/zustand/useLoginStore";
import { BillingInterval, UserSubscriptionStatus } from "@/types/pricing.type";
import { PricingCard } from "./pricing-card";
import BillingToggle from "./billing-toggle";
import { User } from "@supabase/supabase-js";
import { Tables } from "types_db";
import { checkoutWithStripe } from "@/lib/stripe/server";

type Price = Tables<"prices">;

type Props = {
  user: User | null | undefined;
  products: any[];
  subscriptionStatus: UserSubscriptionStatus | null;
};

export default function Pricing({ user, products, subscriptionStatus }: Props) {
  const router = useRouter();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("month");
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const currentPath = usePathname();
  const { setIsDialogOpen } = useLoginStore();

  const handleIntervalChange = (interval: BillingInterval) => {
    setBillingInterval(interval);
  };

  const handleStripeCheckout = async (price: Price) => {
    try {
      setPriceIdLoading(price.id);

      if (!user) {
        setPriceIdLoading(undefined);
        setIsDialogOpen(true);
        return;
      }

      // Check if user already has access
      if (subscriptionStatus?.hasLifetimePurchase) {
        // toast.error("You already have lifetime access");
        setPriceIdLoading(undefined);
        return;
      }

      if (price.type === 'recurring' && subscriptionStatus?.isSubscribed) {
        // toast.error("You already have an active subscription");
        setPriceIdLoading(undefined);
        return;
      }

      console.log('Starting checkout with price:', {
        id: price.id,
        type: price.type,
        amount: price.unit_amount,
        interval: price.interval,
        currency: price.currency
      });

      const { errorRedirect, sessionId } = await checkoutWithStripe(price, currentPath);

      if (errorRedirect) {
        console.error('Checkout error redirect:', errorRedirect);
        setPriceIdLoading(undefined);
        return router.push(errorRedirect);
      }

      if (!sessionId) {
        setPriceIdLoading(undefined);
        return router.push(
          getErrorRedirect(
            currentPath,
            "An unknown error occurred.",
            "Please try again later or contact support.",
          ),
        );
      }

      const stripe = await getStripe();
      if (!stripe) {
        throw new Error("Stripe not initialized");
      }

      await stripe.redirectToCheckout({ sessionId });

    } catch (error) {
      console.error('Checkout error:', error);
      // toast.error(error instanceof Error ? error.message : "Failed to process checkout");
      router.push(
        getErrorRedirect(
          currentPath,
          "Checkout failed",
          "Please try again later or contact support.",
        ),
      );
    } finally {
      setPriceIdLoading(undefined);
    }
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

  // Separate products by type
  const subscriptionProducts = products.filter(product =>
    product.prices.some((price: any) => price.type === 'recurring')
  );

  const lifetimeProducts = products.filter(product =>
    product.prices.some((price: any) => price.type === 'one_time')
  );

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
              Start for free, then choose a plan that fits your needs.
            </p>
          </FadeUp>
          {subscriptionProducts.length > 0 && (
            <BillingToggle
              billingInterval={billingInterval}
              onChange={handleIntervalChange}
            />
          )}
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 lg:grid-cols-3">
          {/* Free Plan */}
          <PricingCard
            name={PRICING_FREE_DATA.name}
            description={PRICING_FREE_DATA.description}
            price={PRICING_FREE_DATA.price}
            interval="month"
            features={PRICING_FREE_DATA.features}
            buttonText="Get started"
            onButtonClick={() => router.push("/")}
          />

          {/* Subscription Plans */}
          {subscriptionProducts.map((product) => {
            const price = product.prices.find(
              (price: any) => price.type === 'recurring' && price.interval === billingInterval
            );

            if (!price) return null;

            const priceString = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: price.currency!,
              minimumFractionDigits: 0,
            }).format((price?.unit_amount ?? 0) / 100);

            const productFeatures = product.metadata?.features?.split(",") ?? [];
            const isPopular = product.metadata?.most_popular === "true";

            const isCurrentPlan = subscriptionStatus?.subscription?.prices?.id === price.id;

            return (
              <PricingCard
                key={product.id}
                isPopular={isPopular}
                name={product.name}
                description={product.description}
                price={priceString}
                interval={billingInterval}
                features={productFeatures}
                buttonText={isCurrentPlan ? "Current Plan" : "Subscribe"}
                buttonDisabled={
                  priceIdLoading === price.id ||
                  isCurrentPlan ||
                  subscriptionStatus?.hasLifetimePurchase
                }
                onButtonClick={() => handleStripeCheckout(price)}
              />
            );
          })}

          {/* Lifetime Plans */}
          {lifetimeProducts.map((product) => {
            const price = product.prices.find(
              (price: any) => price.type === 'one_time'
            );

            if (!price) return null;

            const priceString = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: price.currency!,
              minimumFractionDigits: 0,
            }).format((price?.unit_amount ?? 0) / 100);

            const productFeatures = product.metadata?.features?.split(",") ?? [];
            const isCurrentPlan = subscriptionStatus?.lifetimePurchase?.price_id === price.id;

            return (
              <PricingCard
                key={product.id}
                name={product.name}
                description={product.description}
                price={priceString}
                interval="lifetime"
                features={productFeatures}
                buttonText={isCurrentPlan ? "Purchased" : "Buy Lifetime"}
                buttonDisabled={priceIdLoading === price.id || isCurrentPlan}
                onButtonClick={() => handleStripeCheckout(price)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}