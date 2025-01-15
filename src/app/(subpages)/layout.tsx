import SubpageNavbar from "./_components/subpage-navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <header>
        <SubpageNavbar />
      </header>
      <main className="flex-1 overflow-auto">
        <div>{children}</div>
      </main>
    </div>
  );
}
