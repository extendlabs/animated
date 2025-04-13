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
          className="w-full border-[#205a47] hover:bg-[#205a47] sm:w-auto"
        >
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="mx-auto w-[95%] max-w-full border-2 p-4 sm:max-w-[425px] sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold sm:text-2xl">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2 space-y-4 sm:space-y-6">
          {isLogin ? <PasswordSignIn /> : <PasswordSignUp />}
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="h-auto p-0 text-sm sm:text-base"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Log in"}
            </Button>
          </div>
          <div className="relative">
            <Separator className="my-3 sm:my-4" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-background px-2 text-xs sm:text-sm">
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
