import { createClient } from "@/lib/supabase/server";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="flex h-16 items-center border-b bg-background px-4 lg:px-6">
      <div className="w-64">
        <SidebarTrigger />
      </div>
      <Image
        src="/logo.svg"
        alt="logo"
        width={40}
        height={40}
        className="mx-auto"
      />
      <div className="flex w-64 items-center justify-end gap-4">
        {/* Pricing link always visible */}
        <Link
          href="/pricing"
          className="hidden font-medium transition-colors duration-200 hover:text-accent sm:block"
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
