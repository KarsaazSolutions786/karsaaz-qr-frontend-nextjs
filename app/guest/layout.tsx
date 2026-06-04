'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { useAuth } from '@/lib/hooks/useAuth'
import { AppLogo } from '@/components/ui/app-logo'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'

/**
 * Purpose: Executes GuestLayout functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export default function GuestLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { t } = useTranslation()
  const notifiedRef = useRef(false)

  useEffect(() => {
    if (!isLoading && user) {
      // BUG-59: inform the user why the guest flow is unavailable while signed in
      if (!notifiedRef.current) {
        notifiedRef.current = true
        toast.info(t("You're already signed in — taking you to your dashboard."))
      }
      const homePage = user.roles?.[0]?.home_page || '/qrcodes/new'
      router.push(homePage.replace('/dashboard', ''))
    }
  }, [user, isLoading, router, t])

  if (!isLoading && user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top navigation bar */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/guest" className="flex items-center gap-2">
            <AppLogo size="sm" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">Karsaaz QR</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm">
                {t('Sign In')}
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">{t('Sign Up')}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
