import Link from "next/link";

export default function Footer() {
  return (
    <footer className="z-[9999] mt-auto h-auto border-t bg-background py-4 md:h-16">
      <div className="px-4 sm:px-6">
        <div className="mx-auto flex w-full flex-col items-center justify-start sm:flex-row">
          <p className="text-[13px] text-muted-foreground">
            A product by
            <Link
              href="https://www.extend-labs.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1.5 no-underline outline-ring/70 hover:text-foreground hover:underline"
              aria-label="Extend Labs site"
            >
              Extend Labs
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
