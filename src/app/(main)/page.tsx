'use client'
import { SaveCodeDialog } from "./_components/save-code-dialog";
import { CodePresentation } from "./_components/code-presentation/code-presentation";
import { EditButton } from "./_components/edit-button";
import { useUIStore } from "@/zustand/useUIStore";
import { useAuthStore } from "@/zustand/useAuthStore";
import useSubscriptionLimitations from "@/hooks/use-subscription-limitation";
import { cn } from "@/lib/utils";

export default function Home() {
  const animationId = useUIStore((state) => state.id);
  const { subscription } = useAuthStore();
  const limitations = useSubscriptionLimitations(subscription);
  const { isRecordingMode } = useUIStore();

  return (
    <div
      className={cn(
        "p-4 lg:p-6",
        isRecordingMode && 'h-screen overflow-hidden'
      )}>
      {!isRecordingMode && (
        <div className="flex gap-2 mb-2">
          <EditButton />
          {limitations.proUser === true || limitations.subUser === true &&
            <SaveCodeDialog key={animationId ? 'update' : 'create'} />
          }
          {animationId && (
            <SaveCodeDialog
              key="create-new"
              forceCreate
            />
          )}
        </div>
      )}
      <CodePresentation />
    </div>
  );
}