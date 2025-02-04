import { SidebarInset } from "@/components/ui/sidebar";
import Navbar from "../../_components/navbar";
import { AppSidebar } from "./_components/app-sidebar";
import SettingsFooter from "./_components/settings-footer";

export default function SettingsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <AppSidebar className="h-[calc(100vh-4rem)]" />
      <SidebarInset className="flex flex-1 flex-col bg-background">
        <header>
          <Navbar />
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
        <SettingsFooter />
      </SidebarInset>
    </>
  );
}
