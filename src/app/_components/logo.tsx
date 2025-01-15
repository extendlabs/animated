'use client';

import { Blocks } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ExtendUILogo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2  rounded-md p-1.5 pr-0 text-zinc-100/30',
        className,
      )}
    >
      <div className="mr-4 flex items-center justify-center gap-1 font-bold">
        <Blocks className="h-6 w-6 text-zinc-100/30" />
        <span className="text-base font-bold">
          Extend
          <span className="text-zinc-100/30">UI</span>
        </span>
      </div>
    </div>
  );
}
