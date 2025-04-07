"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { type Tables } from "types_db";
import {
  cancelStripeSubscription,
  redirectToCustomerPortalsubscriptionId,
  resumeUserSubscription,
} from "@/lib/stripe/server";
import { Button } from "@/components/ui/button";
import Card from "@/components/card";
import { getErrorRedirect, getStatusRedirect } from "@/lib/helpers";
import { useAuthStore } from "@/zustand/useAuthStore";
import { format } from "date-fns";
import {
  LifetimePurchaseWithProduct,
  SubscriptionWithPriceAndProduct,
} from "@/types/pricing.type";

type Props = {
  subscription: SubscriptionWithPriceAndProduct | null;
  lifetimePurchase?: LifetimePurchaseWithProduct | null;
};

export const CustomerPortalForm = ({
  subscription,
  lifetimePurchase,
}: Props) => {
  const router = useRouter();
  const currentPath = usePathname();
  const { setSubscription } = useAuthStore();

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: subscription?.prices?.currency!,
      minimumFractionDigits: 0,
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  const handleCancelSubscription = async (subscriptionId: string) => {
    const result = await cancelStripeSubscription(subscriptionId);
    let redirectPath;
    if (result.success) {
      setSubscription(null);
      redirectPath = getStatusRedirect(currentPath, "Success!", result.message);
    } else {
      redirectPath = getErrorRedirect(currentPath, "Error", result.message);
    }
    return setTimeout(() => router.push(redirectPath), 1000);
  };

  const handleRedirectToCustomerPortal = async (subscriptionId: string) => {
    const result = await redirectToCustomerPortalsubscriptionId(subscriptionId);
    let redirectPath;

    if (result.success) {
      redirectPath = getStatusRedirect(
        result.path as string,
        "Success!",
        result.message,
      );
    } else {
      redirectPath = getErrorRedirect(currentPath, "Error", result.message);
    }

    return setTimeout(() => router.push(redirectPath), 1000);
  };

  const handleResumeSubscription = async (subscriptionId: string) => {
    const result = await resumeUserSubscription(subscriptionId);
    let redirectPath;

    if (result.success) {
      if (result.subscription) {
        setSubscription(result.subscription);
      }
      redirectPath = getStatusRedirect(currentPath, "Success!", result.message);
    } else {
      redirectPath = getErrorRedirect(currentPath, "Error", result.message);
    }

    return setTimeout(() => router.push(redirectPath), 1000);
  };

  const getSubscriptionStatusText = () => {
    if (lifetimePurchase) {
      return;
    }

    if (!subscription) return null;

    if (subscription.current_period_end && subscription.canceled_at) {
      return (
        <div className="mt-2 text-zinc-300">
          Your subscription will end on{" "}
          {format(new Date(subscription.current_period_end), "MMMM d, yyyy")}.
        </div>
      );
    } else {
      return (
        <div className="mt-2 text-zinc-300">
          Next payment will be on{" "}
          {format(new Date(subscription.current_period_end), "MMMM d, yyyy")}.
        </div>
      );
    }
  };

  const getPlanDescription = () => {
    if (lifetimePurchase) {
      return `You have lifetime access to Animated Pro.`;
    }

    return subscription
      ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
      : "You are not currently subscribed.";
  };

  return (
    <Card
      title="Your Plan"
      description={getPlanDescription()}
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          {!lifetimePurchase ? (
            <p className="pb-4 sm:pb-0">Manage your subscription.</p>
          ) : (
            <p className="pb-4 sm:pb-0">
              Bought{" "}
              {format(new Date(lifetimePurchase.created_at), "MMMM d, yyyy")}
            </p>
          )}
          {subscription ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-2 border-zinc-600 bg-zinc-900 text-primary"
                onClick={() => handleRedirectToCustomerPortal(subscription.id)}
              >
                Manage Plan
              </Button>
              {subscription.canceled_at ? (
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-2 border-zinc-600 bg-zinc-900 text-primary"
                  onClick={() => handleResumeSubscription(subscription.id)}
                >
                  Resume Subscription
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-2 border-zinc-600 bg-zinc-900 text-primary"
                  onClick={() => handleCancelSubscription(subscription.id)}
                >
                  Cancel Subscription
                </Button>
              )}
            </div>
          ) : !lifetimePurchase ? (
            <Link href="/pricing">
              <Button disabled>Choose your plan</Button>
            </Link>
          ) : null}
        </div>
      }
    >
      <div className="mb-4 mt-8">
        {subscription && (
          <div className="text-xl font-semibold">
            {subscriptionPrice}/{subscription?.prices?.interval}
          </div>
        )}
        {getSubscriptionStatusText()}
      </div>
    </Card>
  );
};
