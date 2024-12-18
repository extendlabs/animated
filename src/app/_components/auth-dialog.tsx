'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import OauthSignIn from '@/components/auth/o-auth-sign-in'
import PasswordSignIn from '@/components/auth/password-sign-in'
import PasswordSignUp from '@/components/auth/password-sing-up'


export function AuthDialog({ isDialogOpen, setIsDialogOpen }: { isDialogOpen: boolean; setIsDialogOpen: (open: boolean) => void }) {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-[#205a47] border-2">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {isLogin ? <PasswordSignIn /> : <PasswordSignUp />}
          <div className="text-center">
            <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </Button>
          </div>
          <div className="relative">
            <Separator className="my-4" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-background px-2 text-sm">Or continue with</span>
            </div>
          </div>
          <OauthSignIn />
        </div>
      </DialogContent>
    </Dialog>
  )
}

