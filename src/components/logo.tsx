"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center justify-center gap-2 text-zinc-200 duration-200",
        className,
      )}
    >
      <div className="mr-4 flex items-center justify-center gap-2 font-bold">
        <Image
          src="/logo.svg"
          alt="logo"
          width={500}
          height={500}
          className="size-6"
        />
        <span className="text-lg font-semibold tracking-tight">Animated</span>
      </div>
    </Link>
  );
}
