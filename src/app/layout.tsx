import { AppSidebar } from "@/app/_components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import SettingsFooter from "./_components/settings-footer";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import Navbar from "./_components/navbar";

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
          <Suspense>
            <Toaster />
          </Suspense>
        </SidebarProvider>
      </body>
    </html>
  );
}
