import { createClient } from "@/lib/supabase/server";
import Navlinks from "./nav-links";
import Logo from "@/components/logo";

export default async function SubpageNavbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex h-16 items-center justify-between border-b px-4 lg:px-6">
      <Logo />
      <Navlinks user={user} />
    </div>
  );
}
