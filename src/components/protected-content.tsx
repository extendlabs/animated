import { createClient } from "@/lib/supabase/server";
import { EditButton } from "@/app/dashboard/(main)/_components/edit-button";

export async function ProtectedContent() {
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) {
    return;
  }

  return (
    <div className="flex gap-2">
      <EditButton />
    </div>
  );
}
