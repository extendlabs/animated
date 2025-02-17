import { createClient } from "@/lib/supabase/server";
import Logo from "@/components/logo";
import { NavLinks } from "@/app/_components/nav-links";

import Image from "next/image";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { User, UserCircle, Settings, Menu } from "lucide-react";

export default async function SubpageNavbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="flex justify-between h-16 items-center border-b px-4 lg:px-6 bg-background">
      <Link
        href="/"
      >
        <Image
          src="/logo.svg"
          alt="logo"
          width={40}
          height={40}
          className="mx-auto"
        />
      </Link>

      <div className="flex items-center gap-4">
        {/* Pricing link always visible */}
        <Link
          href="/pricing"
          className="hidden sm:block transition-colors duration-200 hover:text-accent font-medium"
        >
          Pricing
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden sm:block">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-accent/40 outline-none focus-visible:outline-none"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex flex-col space-y-1 leading-none p-2">
                  <p className="font-medium">{user?.user_metadata?.full_name}</p>
                  {user?.email && (
                    <p className="text-sm font-medium text-muted-foreground">{user.email}</p>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/account" className="flex items-center">
                    <UserCircle className="h-4 w-4 mr-2" />
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/settings" className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Slides & Themes
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <NavLinks user={user} variant="dropdown" />
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {!user && <NavLinks user={user} />}
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="mt-6">
                <NavLinks user={user} className="flex-col items-start" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}