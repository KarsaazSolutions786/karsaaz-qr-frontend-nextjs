'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuth } from '@/lib/hooks/useAuth'
import { useTranslation } from '@/lib/i18n'

/**
 * Purpose: Executes AuthLayout functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { t } = useTranslation()
  const { user, isLoading } = useAuth()
  const notifiedRef = useRef(false)

  useEffect(() => {
    // Redirect to user's home page if already authenticated
    if (!isLoading && user) {
      // BUG-59: inform the user why they're being redirected away from auth pages
      if (!notifiedRef.current) {
        notifiedRef.current = true
        toast.info(t("You're already signed in — taking you to your dashboard."))
      }
      let homePage = user.roles?.[0]?.home_page || '/qrcodes/new'
      if (homePage.startsWith('/dashboard')) {
        homePage = homePage.replace('/dashboard', '')
      }
      router.push(homePage)
    }
  }, [user, isLoading, router, t])

  // Don't block rendering - let the redirect happen in the background
  // This prevents hydration mismatch errors
  if (!isLoading && user) {
    // Redirecting to dashboard, show nothing
    return null
  }

  // Show the auth form (even during loading to prevent hydration issues)
  return (
    <main id="main-content" className="karsaaz-bg min-h-screen">
      {children}
    </main>
  )
}
