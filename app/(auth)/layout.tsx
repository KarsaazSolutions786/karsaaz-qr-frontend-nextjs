'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    // Redirect to user's home page if already authenticated
    if (!isLoading && user) {
      let homePage = user.roles?.[0]?.home_page || '/qrcodes/new'
      if (homePage.startsWith('/dashboard')) {
        homePage = homePage.replace('/dashboard', '')
      }
      router.push(homePage)
    }
  }, [user, isLoading, router])

  // Don't block rendering - let the redirect happen in the background
  // This prevents hydration mismatch errors
  if (!isLoading && user) {
    // Redirecting to dashboard, show nothing
    return null
  }

  // Show the auth form (even during loading to prevent hydration issues)
  return <main id="main-content">{children}</main>
}
