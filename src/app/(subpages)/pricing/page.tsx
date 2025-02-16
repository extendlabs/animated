import { getProducts, getSubscription, getUser, getUserSubscriptionStatus } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import Pricing from "./_components/pricing";

export default async function PricingPage() {
  const supabase = await createClient();
  const [user, products, subscriptionStatus] = await Promise.all([
    getUser(supabase),
    getProducts(supabase),
    getUserSubscriptionStatus(supabase),
  ]);

  return (
    <Pricing
      user={user}
      products={products ?? []}
      subscriptionStatus={subscriptionStatus}
    />
  );
}
