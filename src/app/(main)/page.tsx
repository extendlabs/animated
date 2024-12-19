import { ProtectedContent } from "@/components/protected-content";

import { createClient } from "@/lib/supabase/server";
import { getProducts, getSubscription, getUser } from "@/lib/supabase/queries";
import { CodePresentation } from "../_components/code-presentation/code-presentation";

export default async function Home() {
  const supabase = await createClient();
  const [user, products, subscription] = await Promise.all([
    getUser(supabase),
    getProducts(supabase),
    getSubscription(supabase),
  ]);

  return (
    <div className="h-full p-4 lg:p-6">
      <ProtectedContent />
      <CodePresentation />
    </div>
  );
}
