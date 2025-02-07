import Logo from "@/components/logo";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Twitter } from "lucide-react";
import XformerlyTwitter from "@/components/twitter-logo";

export default async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <header className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 lg:px-6">
      <Logo />
      <nav className="flex items-center gap-5">
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
          href={"/"}
          className={cn("transition-colors duration-200 hover:text-accent")}
        >
          Showcase
        </Link>
        <Link
          href={"https://github.com/extend-ui/animated"}
          target="_blank"
          className="w-4 fill-current hover:text-accent"
        >
          <XformerlyTwitter />
        </Link>
        {user && (
          <Link
            href={"/dashboard"}
            className={cn(
              "rounded-3xl bg-emerald-400/10 px-3.5 py-1.5 text-sm transition-colors duration-200 hover:bg-emerald-400/20",
            )}
          >
            Dashboard
          </Link>
        )}
      </nav>
    </header>
  );
}
