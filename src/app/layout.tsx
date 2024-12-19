import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Footer from "./_components/footer";

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
      <body className="flex min-h-screen flex-col">
        <SidebarProvider defaultOpen={true}>
          <div className="flex flex-1 overflow-hidden">{children}</div>
        </SidebarProvider>
        <Footer />
        <Suspense>
          <Toaster />
        </Suspense>
      </body>
    </html>
  );
}
