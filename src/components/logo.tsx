"use client";

import { Blocks } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
        <Blocks className="h-6 w-6 text-accent-foreground" />
        <span className="text-base font-bold">Animated</span>
      </div>
    </Link>
  );
}
