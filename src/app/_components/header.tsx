import Logo from "@/components/logo";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { XformerlyTwitter } from "../(landing)/_components/icons";
import LandingMobileNav from "./landing-mobile-nav";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="fixed inset-0 z-20 h-16 w-full border-b bg-background/70 p-4 px-4 backdrop-blur-md lg:p-6">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between">
        <Logo />
        <LandingDesktopNav user={user} />
        <div className="sm:hidden">
          <LandingMobileNav user={user} />
        </div>
      </div>
    </header>
  );
}

function LandingDesktopNav({ user }: { user: any }) {
  return (
    <>
      <nav className="hidden items-center justify-center gap-5 text-zinc-400 sm:flex">
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
              "rounded-3xl bg-emerald-800 px-3.5 py-1.5 text-sm text-white transition-colors duration-200 hover:bg-emerald-900",
            )}
          >
            Dashboard
          </Link>
        )}
      </nav>
      <Link
        href={"https://x.com/extendui_pro"}
        target="_blank"
        className="hidden w-[104px] items-end justify-end fill-current hover:text-accent sm:flex"
      >
        <XformerlyTwitter />
      </Link>
    </>
  );
}
