import { createClient } from "@/lib/supabase/server";
import { Button } from "./ui/button"
import { EditButton } from "@/app/_components/edit-button";

export async function ProtectedContent() {
  const supabase = createClient();
  const {
    data: { user }
  } = await (await supabase).auth.getUser();



  if (!user) {
    return <p>Please log in to see additional content.</p>
  }

  return (
    <div className="flex gap-2">
      <EditButton />
    </div>
  )
}

