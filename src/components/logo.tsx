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
      <div className="flex w-fit items-center justify-center gap-2 font-bold">
        <Image
          src="/logo.svg"
          alt="logo"
          width={500}
          height={500}
          className="h-[18px] w-fit"
        />
        <span className="sr-only">Animated</span>
      </div>
    </Link>
  );
}
