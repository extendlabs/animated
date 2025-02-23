'use client'

import { LogOut } from "lucide-react";
import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { handleRequest } from "@/lib/auth-helpers/client";
import { SignOut } from "@/lib/auth-helpers/server";
import { getRedirectMethod } from "@/lib/auth-helpers/settings";
import { AuthDialog } from "./auth-dialog";
import { useAuthStore } from "@/zustand/useAuthStore";
<<<<<<< HEAD
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
=======
>>>>>>> main
import { cn } from "@/lib/utils";
import { FormEvent } from "react";

type NavLinksProps = {
  user: any;
  className?: string;
  variant?: 'default' | 'dropdown';
}

export const NavLinks = ({ user, className, variant = 'default' }: NavLinksProps) => {
  const router = useRouter();
  const { setSubscription, setPurchase, setPlan } = useAuthStore();
  const redirectMethod = getRedirectMethod();


  const handleSignOut = (e: FormEvent<HTMLFormElement>) => {
    handleRequest(e, SignOut, redirectMethod === "client" ? router : null);
    setSubscription(null);
    setPurchase(null);
    setPlan(null);
  };

  if (variant === 'dropdown' && user) {
    return (
      <form onSubmit={handleSignOut}>
        <DropdownMenuItem asChild className="cursor-pointer">
          <button className="w-full flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </DropdownMenuItem>
      </form>
    );
  }

  return (
<<<<<<< HEAD
    <div className="flex items-center gap-5">
      <Link
        href="/pricing"
        className={cn(
          "transition-colors duration-200 hover:text-accent",
          pathname === "/pricing" && "text-accent",
        )}
      >
        Pricing
      </Link>
      {user && (
        <>
          <Link
            href="/dashboard/animations"
            className={cn(
              "transition-colors duration-200 hover:text-accent",
              pathname === "/animations" && "text-accent",
            )}
          >
            Animations
          </Link>
          <Link
            href="/dashboard/account"
            className={cn(
              "transition-colors duration-200 hover:text-accent",
              pathname === "/account" && "text-accent",
            )}
          >
            Account
          </Link>
        </>
      )}
      {user ? (
        <form
          onSubmit={(e) => {
            handleRequest(e, SignOut, router);
            setSubscription(null);
          }}
        >
          <Button variant="ghost" size="icon" type="submit">
            <LogOut size={20} />
          </Button>
        </form>
      ) : (
        <AuthDialog />
      )}
=======
    <div className={cn("flex items-center gap-5", className)}>
      {!user && <AuthDialog />}
>>>>>>> main
    </div>
  );
};