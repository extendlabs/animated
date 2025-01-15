"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import OauthSignIn from "@/components/auth/o-auth-sign-in";
import PasswordSignIn from "@/components/auth/password-sign-in";
import PasswordSignUp from "@/components/auth/password-sing-up";
import { useLoginStore } from "@/zustand/useLoginStore";

export function AuthDialog() {
  const [isLogin, setIsLogin] = useState(true);
  const { isDialogOpen, setIsDialogOpen } = useLoginStore();

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-[#205a47] hover:bg-[#205a47]"
        >
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="border-2 border-slate-900 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {isLogin ? <PasswordSignIn /> : <PasswordSignUp />}
          <div className="text-center">
            <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Log in"}
            </Button>
          </div>
          <div className="relative">
            <Separator className="my-4" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-background px-2 text-sm">
                Or continue with
              </span>
            </div>
          </div>
          <OauthSignIn />
        </div>
      </DialogContent>
    </Dialog>
  );
}
