import Logo from "@/components/logo";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import XformerlyTwitter from "@/components/twitter-logo";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="fixed inset-0 z-20 h-16 w-full bg-background/70 p-4 backdrop-blur-md lg:p-6">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between">
        <Logo />
        {/* Desktop Navigation */}

        <LandingDesktopNav user={user} />

        {/* Mobile Navigation */}
        <div className="sm:hidden">
          <LandingMobileNav user={user} />
        </div>
      </div>
    </header>
  );
}

function LandingMobileNav({ user }: { user: any }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full p-6"
        aria-description="Mobile Navigation"
      >
        <SheetHeader>
          <SheetTitle hidden>Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-8 flex flex-col gap-4 space-y-6">
          <Link
            href={"/"}
            className={cn("transition-colors duration-200 hover:text-accent")}
          >
            Features
          </Link>
          <Link
            href={"/pricing"}
            className={cn("transition-colors duration-200 hover:text-accent")}
          >
            Pricing
          </Link>
          <Link
            href={"https://x.com/extendui_pro"}
            target="_blank"
            className="flex items-center gap-2 fill-current hover:text-accent"
          >
            Follow us on <XformerlyTwitter className="size-4" />
          </Link>
          {user && (
            <Link
              href={"/dashboard"}
              className={cn(
                "rounded-3xl bg-emerald-800 px-3.5 py-1.5 text-center text-xl font-semibold tracking-wide transition-colors duration-200 hover:bg-emerald-900",
              )}
            >
              Dashboard
            </Link>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function LandingDesktopNav({ user }: { user: any }) {
  return (
    <>
      <nav className="hidden items-center gap-5 sm:flex">
        <Link
          href={"/"}
          className={cn("transition-colors duration-200 hover:text-accent")}
        >
          Features
        </Link>
        <Link
          href={"/pricing"}
          className={cn("transition-colors duration-200 hover:text-accent")}
        >
          Pricing
        </Link>

        {user && (
          <Link
            href={"/dashboard"}
            className={cn(
              "rounded-3xl bg-emerald-800 px-3.5 py-1.5 text-sm transition-colors duration-200 hover:bg-emerald-900",
            )}
          >
            Dashboard
          </Link>
        )}
      </nav>
      <Link
        href={"https://x.com/extendui_pro"}
        target="_blank"
        className="hidden w-4 fill-current hover:text-accent sm:block"
      >
        <XformerlyTwitter />
      </Link>
    </>
  );
}
