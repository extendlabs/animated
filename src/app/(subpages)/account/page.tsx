import { redirect } from "next/navigation";
import { getSubscription, getUser, getLifetimePurchase } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import CustomerPortalForm from "./_components/customer-form";
import EmailForm from "./_components/email-form";
import InvoicesForm from "./_components/invoices-form";
import DeleteAccountForm from "./_components/delete-account-form";
import FadeUp from "@/components/fadeup";

export default async function Account() {
  const supabase = await createClient();
  const [user, subscription, lifetimePurchase] = await Promise.all([
    getUser(supabase),
    getSubscription(supabase),
    getLifetimePurchase(supabase),
  ]);

  if (!user) {
    return redirect("/");
  }

  const hasActiveSubscription = subscription?.status === 'active' ||
    subscription?.status === 'trialing';

  return (
    <section id="account" className="mb-8 space-y-4 overflow-hidden">
      <div className="mx-auto flex max-w-7xl flex-col items-center space-y-4 px-8 pt-[6dvh] text-center">
        <div className="relative mx-auto max-w-2xl text-center lg:max-w-4xl">
          <FadeUp delay={0.2} duration={0.8}>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Account
            </h1>
          </FadeUp>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <FadeUp delay={0.4} duration={0.8}>
          <CustomerPortalForm
            subscription={subscription}
            lifetimePurchase={lifetimePurchase}
          />
        </FadeUp>
        <FadeUp delay={0.5} duration={0.8}>
          <EmailForm userEmail={user.email} />
        </FadeUp>
        <FadeUp delay={0.6} duration={0.8}>
          <InvoicesForm />
        </FadeUp>
        <FadeUp delay={0.7} duration={0.8}>
          <DeleteAccountForm
            hasActiveSubscription={hasActiveSubscription}
          />
        </FadeUp>
      </div>
    </section>
  );
}