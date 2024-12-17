'use client'

import { useAuth } from "@/contexts/auth-context"



export function ProtectedContent() {
  const { user } = useAuth()

  if (!user) {
    return <p>Please log in to see additional content.</p>
  }

  return (
    <div>
      <h2>Protected Content</h2>
      <p>Welcome, {user.email}! This content is only visible to logged-in users.</p>
    </div>
  )
}

