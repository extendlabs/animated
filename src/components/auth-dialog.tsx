'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { FaGoogle } from 'react-icons/fa'

import { getSiteUrl, supabase } from '@/lib/supabase/supabase-client'
import { useToast } from '@/hooks/use-toast'

export function AuthDialog() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { toast } = useToast()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link.",
        })
      }
    } catch (error: any) {
      console.error('Error:', error)
      toast({
        title: "Authentication error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${getSiteUrl()}/auth/callback`
        }
      })
      if (error) throw error
    } catch (error: any) {
      console.error('Error logging in with Google:', error)
      toast({
        title: "Google login error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Login / Register</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isLogin ? 'Login' : 'Register'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit">{isLogin ? 'Login' : 'Register'}</Button>
        </form>
        <div className="flex flex-col space-y-2 mt-4">
          <Button onClick={handleGoogleLogin} className="flex items-center justify-center">
            <FaGoogle className="mr-2" /> Login with Google
          </Button>
        </div>
        <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

