"use client";
import { CodePresentation } from "./_components/code-presentation/code-presentation";
import { useUIStore } from "@/zustand/useUIStore";
import { cn } from "@/lib/utils";

export default function Home() {
  const { isRecordingMode } = useUIStore();

  return (
    <div className={cn("p-4", isRecordingMode && "h-screen overflow-hidden")}>
      <CodePresentation />
    </div>
  );
}
