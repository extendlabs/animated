import { createClient } from "@/lib/supabase/server";
import { Button } from "./ui/button"

export async function ProtectedContent() {
  const supabase = createClient();
  const {
    data: { user }
  } = await (await supabase).auth.getUser();



  if (!user) {
    return <p>Please log in to see additional content.</p>
  }

  return (
    <div>
      <Button>Subscribe product</Button>
    </div>
  )
}

