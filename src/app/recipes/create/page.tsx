// src/app/recipes/create/page.tsx
'use client' // React client component

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function CreateRecipePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      // redirect to login if not signed in
      router.push('/login')
    }
  }, [status, router])

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    // Optional: If you'd rather not show a flash of content, 
    // just return null or some "Redirecting..." message
    return null;
  }

  // If we get here, user is authenticated
  return <div>Protected content: create a recipe here!</div>;
}