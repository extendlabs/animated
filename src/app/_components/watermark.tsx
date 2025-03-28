import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Watermark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 rounded-md p-1.5 pr-0 text-zinc-100/30 mix-blend-overlay",
        className,
      )}
    >
      <div className="mr-4 flex items-center justify-center gap-1 font-bold">
        <Image
          src="/logo.svg"
          alt="logo"
          width={500}
          height={500}
          className={cn("h-5 w-fit fill-transparent z-50")}
        />
      </div>
    </div>
  );
}
