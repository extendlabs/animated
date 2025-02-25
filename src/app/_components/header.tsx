import Logo from "@/components/logo";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import XformerlyTwitter from "@/components/twitter-logo";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="fixed inset-0 z-20 h-16 w-full bg-background/70 p-4 backdrop-blur-md lg:p-6">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between">
        <Logo />
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
                "rounded-3xl bg-emerald-400/30 px-3.5 py-1.5 text-sm transition-colors duration-200 hover:bg-emerald-400/40",
              )}
            >
              Dashboard
            </Link>
          )}
        </nav>
        <Link
          href={"https://x.com/extendui_pro"}
          target="_blank"
          className="w-4 fill-current hover:text-accent"
        >
          <XformerlyTwitter />
        </Link>
      </div>
    </header>
  );
}
