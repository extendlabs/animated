'use client'


import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase/supabase-client'
import { AuthDialog } from './auth-dialog'


export function DynamicAuthButton() {
  const { user, loading } = useAuth()

  if (loading) return <Button disabled>Loading...</Button>

  if (user) {
    return (
      <Button onClick={() => supabase.auth.signOut()}>
        Logout
      </Button>
    )
  }

  return <AuthDialog />
}

