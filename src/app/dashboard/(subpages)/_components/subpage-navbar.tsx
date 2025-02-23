import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { DesktopNav } from "@/app/_components/desktop-nav";
import { MobileNav } from "@/app/_components/mobile-nav";

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

      <div className="w-64 flex justify-end items-center gap-4">
        {/* Pricing link always visible */}
        <Link
          href="/pricing"
          className="hidden sm:block transition-colors duration-200 hover:text-accent font-medium"
        >
          Pricing
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden sm:block">
          <DesktopNav user={user} />
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden">
          <MobileNav user={user} />
        </div>
      </div>
    </nav>
  );
}