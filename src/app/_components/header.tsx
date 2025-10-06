import Logo from "@/components/logo";
import Link from "next/link";
import { XformerlyTwitter } from "../(landing)/_components/icons";

export default async function Header() {
  return (
    <header className="fixed inset-0 z-20 h-16 w-full border-b bg-background/70 p-4 px-4 backdrop-blur-md lg:p-6">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between">
        <div className="flex-1">
          <Logo />
        </div>
        <div className="flex flex-1 justify-end">
          <Link
            href={"https://x.com/extend-labs_pro"}
            target="_blank"
            className="flex items-end justify-end fill-current hover:text-accent"
          >
            <XformerlyTwitter />
          </Link>
        </div>
      </div>
    </header>
  );
}
