"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { User, Settings, UserCircle, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { handleRequest } from "@/lib/auth-helpers/client";
import { SignOut } from "@/lib/auth-helpers/server";
import { getRedirectMethod } from "@/lib/auth-helpers/settings";
import { AuthDialog } from "./auth-dialog";
import { useAuthStore } from "@/zustand/useAuthStore";
import { FormEvent } from "react";

type DesktopNavProps = {
  user: any;
};

export function DesktopNav({ user }: DesktopNavProps) {
  const router = useRouter();
  const { setSubscription, setPurchase, setPlan } = useAuthStore();
  const redirectMethod = getRedirectMethod();

  const handleSignOut = (e: FormEvent<HTMLFormElement>) => {
    handleRequest(e, SignOut, redirectMethod === "client" ? router : null);
    setSubscription(null);
    setPurchase(null);
    setPlan(null);
  };

  if (!user) {
    return <AuthDialog />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full outline-none hover:bg-accent/40"
        >
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex flex-col space-y-1 p-2 leading-none">
          <p className="font-medium">{user?.user_metadata?.full_name}</p>
          {user?.email && (
            <p className="text-sm font-medium text-muted-foreground">
              {user.email}
            </p>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/account" className="flex items-center gap-2">
            <UserCircle className="h-4 w-4" />
            Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Slides & Themes
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form onSubmit={handleSignOut}>
          <DropdownMenuItem asChild className="cursor-pointer">
            <button className="flex w-full items-center gap-2">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
