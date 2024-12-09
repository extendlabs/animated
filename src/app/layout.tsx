import { AppSidebar } from "@/app/_components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { EditButton } from "./_components/edit-button";
import SettingsFooter from "./_components/settings-footer";

export const metadata: Metadata = {
  title: "Code Animation Presentation",
  description: "Animated code presentation with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning>
      <body>
        <SidebarProvider defaultOpen={true}>
          <AppSidebar />
          <SidebarInset className="min-h-screen bg-background">
            <header className="flex h-14 items-center justify-between border-b px-4 lg:px-6">
              <SidebarTrigger />
              <EditButton />
            </header>
            <main className="flex h-full flex-col">
              <div className="flex-1 overflow-auto">{children}</div>
            </main>
            <SettingsFooter />
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
