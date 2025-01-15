'use client';


import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Tables } from 'types_db';
import { cancelStripeSubscription } from '@/lib/stripe/server';
import { Button } from '@/components/ui/button';
import Card from '@/components/card';
import { getErrorRedirect, getStatusRedirect } from '@/lib/helpers';
import { useAuthStore } from '@/zustand/useAuthStore';

type Subscription = Tables<'subscriptions'>;
type Price = Tables<'prices'>;
type Product = Tables<'products'>;

type SubscriptionWithPriceAndProduct = Subscription & {
  prices:
  | (Price & {
    products: Product | null;
  })
  | null;
};

interface Props {
  subscription: SubscriptionWithPriceAndProduct | null;
}

export default function CustomerPortalForm({ subscription }: Props) {
  const router = useRouter();
  const currentPath = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setSubscribed } = useAuthStore()

  console.log(subscription)

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency!,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  const handleCancelSubscription = async (subscriptionId: string) => {
    const result = await cancelStripeSubscription(subscriptionId);
    let redirectPath
    if (result.success) {
      setSubscribed(false)
      redirectPath = getStatusRedirect(
        '/',
        "Success!",
        result.message,
      )
    } else {
      redirectPath = getErrorRedirect(
        currentPath,
        "Error",
        result.message
      )
    }
    return router.push(redirectPath);
  };

  return (
    <Card
      title="Your Plan"
      description={
        subscription
          ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
          : 'You are not currently subscribed.'
      }
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 sm:pb-0">Manage your subscription.</p>
          {subscription && (
            <Button
              onClick={() => handleCancelSubscription(subscription?.id!)}
              loading={isSubmitting}
            >
              Cancel Subscription
            </Button>
          )}
        </div>
      }
    >
      <div className="mt-8 mb-4 text-xl font-semibold">
        {subscription ? (
          `${subscriptionPrice}/${subscription?.prices?.interval}`
        ) : (
          <Link href="/pricing">Choose your plan</Link>
        )}
      </div>
    </Card>
  );
}
