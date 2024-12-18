'use client'

import { useAuth } from "@/contexts/auth-context"
import { Button } from "./ui/button"
import handleCheckout from "@/lib/handleCheckout"



export function ProtectedContent() {
  const { user } = useAuth()

  const handleSubscribe = async () => {
    if (!user) {
      return console.log(-1)
    }
    await handleCheckout('price_1QXLUc2Ls1a5Pom3Gj761yel', user?.id)
  }

  if (!user) {
    return <p>Please log in to see additional content.</p>
  }

  return (
    <div>
      <Button onClick={handleSubscribe}>Subscribe product</Button>
    </div>
  )
}

