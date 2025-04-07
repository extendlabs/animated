"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { XformerlyTwitter } from "../(landing)/_components/icons";

export default function LandingMobileNav({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
        <nav className="mt-8 flex flex-col items-center justify-center gap-4 space-y-6">
          <Link
            href={"/"}
            className={cn("transition-colors duration-200 hover:text-accent")}
            onClick={() => setOpen(false)}
          >
            Features
          </Link>
          {/* <Link
            href={"/pricing"}
            className={cn("transition-colors duration-200 hover:text-accent")}
            onClick={() => setOpen(false)}
          >
            Pricing
          </Link> */}
          <Link
            href={"https://x.com/extendui_pro"}
            target="_blank"
            className="flex items-center gap-2 fill-current hover:text-accent"
            onClick={() => setOpen(false)}
          >
            Follow us on <XformerlyTwitter className="size-4" />
          </Link>
          <Link
            href={"/dashboard"}
            onClick={() => setOpen(false)}
            className={cn(
              "w-full rounded-3xl border border-emerald-800 px-3.5 py-1.5 text-center text-lg transition-colors duration-200 hover:bg-emerald-900",
            )}
          >
            Dashboard
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
