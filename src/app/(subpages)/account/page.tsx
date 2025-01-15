
import { redirect } from 'next/navigation';

import { getSubscription, getUser, getUserDetails } from '@/lib/supabase/queries';
import { createClient } from '@/lib/supabase/server';
import CustomerPortalForm from './_components/AccountForms/CustomerPortalForm';
import EmailForm from './_components/AccountForms/EmailForm';
import FadeUp from '@/components/fadeup';


export default async function Account() {
    const supabase = await createClient();
    const [user, subscription] = await Promise.all([
        getUser(supabase),
        getUserDetails(supabase),
        getSubscription(supabase)
    ]);

    if (!user) {
        return redirect('/signin');
    }

    return (
        <section id="account" className="space-y-4 overflow-hidden mb-8">
            <div className="mx-auto flex max-w-7xl flex-col items-center space-y-4 px-8 pt-[6dvh] text-center">
                <div className="relative mx-auto max-w-2xl text-center lg:max-w-4xl">
                    <FadeUp delay={0.2} duration={0.8}>
                        <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                            Account
                        </h1>
                    </FadeUp>
                </div>
            </div>
            <div className="p-4">
                <FadeUp delay={0.4} duration={0.8}>
                    <CustomerPortalForm subscription={subscription} />
                </FadeUp>
                <FadeUp delay={0.6} duration={0.8}>
                    <EmailForm userEmail={user.email} />
                </FadeUp>
            </div>
        </section>
    );
}