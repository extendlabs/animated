import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto h-auto md:h-16 border-t bg-background py-4">
      <div className="px-4 sm:px-6">
        <div className="mx-auto flex w-full flex-col items-center justify-between sm:flex-row">
          {/* Branding or attribution */}
          <p className="text-[13px] text-muted-foreground">
            A product by
            <Link
              href="https://www.extend-ui.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1.5 no-underline outline-ring/70 hover:text-foreground hover:underline"
              aria-label="Extend UI site"
            >
              Extend UI
            </Link>
          </p>

          {/* Policy Links */}
          <div className="mt-2 flex space-x-4 sm:mt-0">
            <Link
              href="/privacy-policy"
              className="text-[13px] text-muted-foreground no-underline hover:text-foreground hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-[13px] text-muted-foreground no-underline hover:text-foreground hover:underline"
            >
              Terms of Service
            </Link>
            <Link
              href="/refund-policy"
              className="text-[13px] text-muted-foreground no-underline hover:text-foreground hover:underline"
            >
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
