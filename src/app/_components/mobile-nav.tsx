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
