<<<<<<< HEAD
"use client";
interface NavigationProps {
  user?: User | null;
}

interface NavLink {
  href: string;
  label: string;
  isExternal?: boolean;
}

const navLinks: NavLink[] = [
  { href: "/", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "#", label: "Showcase" },
  {
    href: "https://github.com/extend-ui/animated",
    label: "Twitter",
    isExternal: true,
  },
];

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { User } from "@supabase/supabase-js";

export const MobileNav = ({ user }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <Button
        className="p-2 sm:hidden"
        size="icon"
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="size-6 text-white" />
        ) : (
          <Menu className="size-6" />
        )}
      </Button>

      {/* Mobile navigation overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <nav className="fixed inset-y-0 right-0 w-full bg-background p-6 shadow-lg">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.isExternal ? "_blank" : undefined}
                  className="text-lg transition-colors duration-200 hover:text-accent"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <Link
                  href="/dashboard"
                  className={cn(
                    "rounded-3xl bg-emerald-400/10 px-3.5 py-1.5 text-sm",
                    "transition-colors duration-200 hover:bg-emerald-400/20",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
};
=======
'use client'

import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu, User, Settings, UserCircle, LogOut, DollarSign } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { handleRequest } from "@/lib/auth-helpers/client";
import { SignOut } from "@/lib/auth-helpers/server";
import { getRedirectMethod } from "@/lib/auth-helpers/settings";
import { AuthDialog } from "./auth-dialog";
import { useAuthStore } from "@/zustand/useAuthStore";
import { FormEvent } from "react";
import { FaMoneyBill } from "react-icons/fa";

type MobileNavProps = {
    user: any;
}

export function MobileNav({ user }: MobileNavProps) {
    const router = useRouter();
    const { setSubscription, setPurchase, setPlan } = useAuthStore();
    const redirectMethod = getRedirectMethod();

    const handleSignOut = (e: FormEvent<HTMLFormElement>) => {
        handleRequest(e, SignOut, redirectMethod === "client" ? router : null);
        setSubscription(null);
        setPurchase(null);
        setPlan(null);
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
                <SheetHeader >
                    <SheetTitle hidden>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-4">
                    {user ? (
                        <>
                            <div className="flex flex-col space-y-1 border-b pb-4">
                                <p className="font-medium">{user?.user_metadata?.full_name}</p>
                                {user?.email && (
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                )}
                            </div>
                            <Link
                                href="/account"
                                className="flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-accent"
                            >
                                <UserCircle className="h-4 w-4" />
                                Account
                            </Link>
                            <Link
                                href="/settings"
                                className="flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-accent"
                            >
                                <Settings className="h-4 w-4" />
                                Slides & Themes
                            </Link>
                            <Link
                                href="/pricing"
                                className="flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-accent"
                            >
                                <DollarSign className="h-4 w-4" />
                                Pricing
                            </Link>
                            <form onSubmit={handleSignOut} className="pt-2 space-y-1 border-t">
                                <button className="flex w-full items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-accent">
                                    <LogOut className="h-4 w-4" />
                                    Sign out
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="pt-4">
                            <AuthDialog />
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
>>>>>>> main
