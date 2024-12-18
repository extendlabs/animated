/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { handleRequest } from '@/lib/auth-helpers/client'
import { signUp } from '@/lib/auth-helpers/server'
import { useRouter } from 'next/navigation';

export default function PasswordSignUp() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter()
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setIsSubmitting(true)
        await handleRequest(e, signUp, router);
        setIsSubmitting(false);
      };
    

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="m@example.com"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect="off"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Password"
          name="password"
          autoComplete="current-password"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>Sign Up</Button>
    </form>
  )
}

