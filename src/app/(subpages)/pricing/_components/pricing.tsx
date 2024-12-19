/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";

import FadeUp from "@/components/fadeup";
import { Button } from "@/components/ui/button";
import { getErrorRedirect } from "@/lib/helpers";
import { getStripe } from "@/lib/stripe/client";
import { checkoutWithStripe } from "@/lib/stripe/server";
import { type User } from "@supabase/supabase-js";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { type Tables } from "types_db";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Subscription = Tables<"subscriptions">;
type Product = Tables<"products">;
type Price = Tables<"prices">;
interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface Props {
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}

type BillingInterval = "lifetime" | "year" | "month";

const variants = {
  badge: {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 1.2 },
    },
  },
  card: {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  },
};

export default function Pricing({ user, products, subscription }: Props) {
  const router = useRouter();
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>("month");
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const currentPath = usePathname();

  const handleStripeCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);

    if (!user) {
      setPriceIdLoading(undefined);
      return router.push("/signin/signup");
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

  if (!products.length) {
    return (
      <section className="bg-black">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-24 lg:px-8">
          <div className="sm:align-center sm:flex sm:flex-col"></div>
          <p className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            No subscription pricing plans found. Create them in your{" "}
            <a
              className="text-pink-500 underline"
              href="https://dashboard.stripe.com/products"
              rel="noopener noreferrer"
              target="_blank"
            >
              Stripe Dashboard
            </a>
            .
          </p>
        </div>
      </section>
    );
  } else {
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
                  Start building for free, then add a site plan to go live.
                  Account plans unlock additional features.
                </p>
              </FadeUp>
              <div className="gradient pointer-events-none absolute inset-0 -z-10 block opacity-30 blur-3xl"></div>
            </div>
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4">
              <div
                className={cn(
                  "relative mt-12 flex h-full flex-col pb-2 text-start",
                )}
              >
                <motion.div
                  className={cn(
                    "z-10 flex w-full flex-grow flex-col rounded-3xl bg-background p-6",
                  )}
                  variants={variants.card}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-6">
                    <p className="text-xl font-medium">Free</p>
                    <p className="mt-4 text-zinc-300">Free of charge</p>
                  </div>
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">0</span>
                      <span className="ml-2 text-lg text-gray-400">
                        /{billingInterval}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
              {products.map((product) => {
                const price = product?.prices?.find(
                  (price) => price.interval === billingInterval,
                );
                if (!price) return null;
                const priceString = new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: price.currency!,
                  minimumFractionDigits: 0,
                }).format((price?.unit_amount ?? 0) / 100);
                return (
                  <div
                    key={product.id}
                    className={cn(
                      "relative mt-12 flex h-full flex-col pb-2 text-start",
                    )}
                  >
                    <motion.div
                      className="absolute -top-7 left-0"
                      variants={variants.badge}
                      initial="hidden"
                      animate="visible"
                      transition={{ duration: 1 }}
                    >
                      <div className="rounded-l-3xl rounded-r-xl bg-accent px-4 py-1.5 pb-12 pl-6 text-sm font-medium text-white">
                        Most Popular
                      </div>
                    </motion.div>
                    <motion.div
                      className={cn(
                        "z-10 flex w-full flex-grow flex-col justify-between rounded-3xl bg-gradient-to-b from-gray-800 to-gray-900 p-6 text-white",
                      )}
                      variants={variants.card}
                      initial="hidden"
                      animate="visible"
                      transition={{ duration: 0.5 }}
                    >
                      <div className="mb-6">
                        <p className="text-xl font-medium">{product.name}</p>
                        <p className="mt-4 text-zinc-300">
                          {product.description}
                        </p>
                      </div>
                      <div className="mb-6">
                        <div className="flex items-baseline">
                          <span className="text-4xl font-bold">
                            {priceString}
                          </span>
                          <span className="ml-2 text-lg text-gray-400">
                            /{billingInterval}
                          </span>
                        </div>
                      </div>
                      <div className="mt-auto">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5, duration: 0.3 }}
                        >
                          <Button
                            type="button"
                            disabled={priceIdLoading === price.id}
                            onClick={() => handleStripeCheckout(price)}
                            className="w-full"
                          >
                            {subscription ? "Manage" : "Subscribe"}
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }
}
