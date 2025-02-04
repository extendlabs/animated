/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { handleRequest } from "@/lib/auth-helpers/client";
import { useRouter } from "next/navigation";
import { SignOut } from "@/lib/auth-helpers/server";
import { Button } from "@/components/ui/button";
import { getRedirectMethod } from "@/lib/auth-helpers/settings";
import Link from "next/link";
import { AuthDialog } from "./auth-dialog";
import { useAuthStore } from "@/zustand/useAuthStore";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = {
  user: any;
};

export default function Navlinks({ user }: Props) {
  const router = getRedirectMethod() === "client" ? useRouter() : null;
  const pathname = usePathname();
  const { setSubscription } = useAuthStore();

  return (
    <div className="flex items-center gap-5">
      <Link
        href="/dashboard/pricing"
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
    </div>
  );
}
