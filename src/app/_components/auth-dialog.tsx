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
          className="border-[#205a47] hover:bg-[#205a47] w-full sm:w-auto"
        >
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="border-2 border-slate-900 w-[95%] max-w-full sm:max-w-[425px] p-4 sm:p-6 mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl sm:text-2xl font-bold">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 sm:space-y-6 mt-2">
          {isLogin ? <PasswordSignIn /> : <PasswordSignUp />}
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm sm:text-base p-0 h-auto"
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