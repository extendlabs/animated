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
import { Toaster } from "@/components/ui/toaster";
import { DynamicAuthButton } from "@/components/dynamic-auth-button";
import { AuthProvider } from "@/contexts/auth-context";


export const metadata: Metadata = {
  title: "Code Animation Presentation",
  description: "Animated code presentation with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <body>
      <AuthProvider>
        <SidebarProvider defaultOpen={true}>
          <AppSidebar />
          <SidebarInset className="min-h-screen bg-background">
            <header className="flex h-16 items-center justify-between border-b px-4 lg:px-6">
              <SidebarTrigger />
              <div>
                <EditButton />
                <DynamicAuthButton />
              </div>
            </header>
            <main className="flex h-full flex-col">
              <div className="flex-1 overflow-auto">{children}</div>
            </main>
            <SettingsFooter />
          </SidebarInset>
          <Toaster />
        </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

