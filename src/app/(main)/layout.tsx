import { AppSidebar } from "@/app/_components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import "@/styles/globals.css";
import SettingsFooter from "../_components/settings-footer";
import Navbar from "../_components/navbar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset className="min-h-screen bg-background">
          <header>
            <Navbar />
          </header>
          <main className="flex h-full flex-col">
            <div className="flex-1 overflow-auto">{children}</div>
          </main>
          <SettingsFooter />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
