'use client'
import { SaveCodeDialog } from "./_components/save-code-dialog";
import { CodePresentation } from "./_components/code-presentation/code-presentation";
import { EditButton } from "./_components/edit-button";
import { useUIStore } from "@/zustand/useUIStore";
import { useAuthStore } from "@/zustand/useAuthStore";
import useSubscriptionLimitations from "@/hooks/use-subscription-limitation";

export default function Home() {
  const animationId = useUIStore((state) => state.id);
  const { subscription } = useAuthStore();
  const limitations = useSubscriptionLimitations(subscription);


  return (
    <div className="p-4 lg:p-6">
      <div className="flex gap-2">
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
      <CodePresentation />
    </div>
  );
}