// hooks/use-subscription-limitation.ts
import { UserSubscriptionStatus } from "@/types/pricing.type";
import { useMemo } from "react";

function useSubscriptionLimitations(status: UserSubscriptionStatus | null) {
  return useMemo(
    () => ({
      // Pro user can be either subscription or lifetime purchase
      proUser: Boolean(
        (status?.isSubscribed || status?.hasLifetimePurchase) &&
          (status?.plan === "Animated Pro" || status?.plan === "For life"),
      ),
    }),
    [status],
  );
}

export default useSubscriptionLimitations;
