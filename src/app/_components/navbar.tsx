import { createClient } from "@/lib/supabase/server";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { getUser, getUserSubscriptionStatus } from "@/lib/supabase/queries";
import Logo from "@/components/logo";
import { AuthDialog } from "./auth-dialog";

export default async function Navbar() {
  const supabase = await createClient();
  const [user, subscriptionStatus] = await Promise.all([
    getUser(supabase),
    getUserSubscriptionStatus(supabase),
  ]);

  return (
    <nav className="flex h-16 items-center border-b bg-background px-4 lg:px-6">
      <div className="flex items-center">
        <div className="hidden items-center sm:flex">
          <SidebarTrigger />
        </div>
      </div>

      <div className="flex items-center justify-start sm:flex-1 sm:justify-center">
        <Logo />
      </div>

      <div className="ml-auto flex items-center gap-4">
        {subscriptionStatus?.hasLifetimePurchase === true ||
          (subscriptionStatus?.isSubscribed === true && (
            <Button
              asChild
              variant="secondary"
              className="hidden bg-emerald-700 font-semibold hover:bg-emerald-800 sm:flex"
            >
              <Link href="/pricing">
                <Zap className="mr-1 size-4 fill-white" /> Upgrade Now
              </Link>
            </Button>
          ))}
        {/* <div className="hidden sm:block">
          <DesktopNav user={user} />
        </div> */}

        {/* <div className="sm:hidden">
          {user ? <MobileNav user={user} /> : <AuthDialog />}
        </div> */}
      </div>
    </nav>
  );
}
