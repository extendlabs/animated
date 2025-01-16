import { type SubscriptionPlans } from '@/types/pricing.type';
import { useMemo } from 'react';

function useSubscriptionLimitations(subscription: SubscriptionPlans) {
  return useMemo(() => ({
    subUser: subscription === 'Hobby' || subscription === 'Premium',
    proUser: subscription === 'Premium',
  }), [subscription]);
}

export default useSubscriptionLimitations;
