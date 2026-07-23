'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuth } from '@/lib/hooks/useAuth'
import { useTranslation } from '@/lib/i18n'

export default function OrgAuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { t } = useTranslation()
  const { user, isLoading } = useAuth()
  const notifiedRef = useRef(false)

  useEffect(() => {
    // If authenticated, maybe they already have an org, or maybe not. 
    // We will redirect them to /organization/dashboard and let the dashboard handle it.
    if (!isLoading && user) {
      if (!notifiedRef.current) {
        notifiedRef.current = true
        toast.info(t("You're already signed in — taking you to the organization portal."))
      }
      router.push('/organization/dashboard')
    }
  }, [user, isLoading, router, t])

  if (!isLoading && user) {
    return null
  }

  return (
    <main id="main-content" className="karsaaz-bg min-h-screen">
      {children}
    </main>
  )
}
