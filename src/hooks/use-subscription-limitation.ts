// hooks/use-subscription-limitation.ts
import { UserSubscriptionStatus } from "@/types/pricing.type";
import { useMemo } from "react";

function useSubscriptionLimitations(status: UserSubscriptionStatus | null) {
  return useMemo(
    () => ({
      // For now, set proUser to true for everyone
      proUser: status === null ? false : true,
      // Original logic commented out:
      // proUser: Boolean(
      //   (status?.isSubscribed || status?.hasLifetimePurchase) &&
      //     (status?.plan === "Animated Pro" || status?.plan === "For life"),
      // ),
    }),
    [status],
  );
}

export default useSubscriptionLimitations;