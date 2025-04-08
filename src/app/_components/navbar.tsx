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
      {/* Container for the left side - logo on mobile, sidebar trigger on desktop */}
      <div className="flex items-center">
        {/* Sidebar trigger only on desktop - vertically centered */}
        <div className="hidden items-center sm:flex">
          <SidebarTrigger />
        </div>

        {/* Logo - left on mobile, will be centered via container on desktop */}
        <div className="sm:hidden">
          <Logo />
        </div>
      </div>

      {/* Logo centered for desktop only */}
      <div className="hidden flex-1 items-center justify-center sm:flex">
        <Logo />
      </div>

      {/* Navigation container */}
      <div className="ml-auto flex items-center gap-4">
        {/* Upgrade button */}
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

        {/* Desktop Navigation */}
        <div className="hidden sm:block">
          <DesktopNav user={user} />
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden">
          {user ? (
            <MobileNav user={user} />
          ) : (
            <AuthDialog />
          )}
        </div>
      </div>
    </nav>
  );
}