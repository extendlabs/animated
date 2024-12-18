
import { createClient } from '@/lib/supabase/server';
import Navlinks from './nav-links';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <div className="flex h-16 items-center justify-between border-b px-4 lg:px-6">
        <SidebarTrigger />
        <Navlinks user={user} />
    </div>
  );
}
