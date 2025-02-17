'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { handleRequest } from "@/lib/auth-helpers/client";
import { SignOut } from "@/lib/auth-helpers/server";
import { getRedirectMethod } from "@/lib/auth-helpers/settings";
import { AuthDialog } from "./auth-dialog";
import { useAuthStore } from "@/zustand/useAuthStore";
import { cn } from "@/lib/utils";
import { FormEvent } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

type Props = {
  user: any;
  className?: string;
  variant?: 'default' | 'dropdown';
}

export const NavLinks = ({ user, className, variant = 'default' }: Props) => {
  const router = getRedirectMethod() === "client" ? useRouter() : null;
  const pathname = usePathname();
  const { setSubscription, setPurchase, setPlan } = useAuthStore();

  const handleSignOut = (e: FormEvent<HTMLFormElement>) => {
    handleRequest(e, SignOut, router);
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
    <div className={cn("flex items-center gap-5", className)}>
      {!user && <AuthDialog />}
    </div>
  );
};