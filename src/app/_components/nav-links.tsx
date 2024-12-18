/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { handleRequest } from "@/lib/auth-helpers/client";
import { useRouter } from "next/navigation";
import { SignOut } from "@/lib/auth-helpers/server";
import { LoginButton } from "./login-button";
import { Button } from "@/components/ui/button";
import { getRedirectMethod } from "@/lib/auth-helpers/settings";
import Link from "next/link";

type Props = {
  user: any;
};

export default function Navlinks({ user }: Props) {
  const router = getRedirectMethod() === "client" ? useRouter() : null;
  return (
    <div className="flex items-center gap-2">
      <Link href="/pricing">Pricing</Link>
      {user && <Link href="/account">Account</Link>}
      {user ? (
        <form onSubmit={(e) => handleRequest(e, SignOut, router)}>
          <Button type="submit">Sign out</Button>
        </form>
      ) : (
        <LoginButton />
      )}
    </div>
  );
}
