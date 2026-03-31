'use client'

export const dynamic = 'force-dynamic'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { useTranslation } from '@/lib/i18n'

export default function HomePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      // Both logged-in users and guests go to the same QR creation page
      router.push('/qrcodes/new')
    }
  }, [user, isLoading, router])

  // Show loading state while checking auth
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Karsaaz QR</h1>
        <p className="text-lg text-gray-600 mb-8">
          {t('Loading...')}
        </p>
      </div>
    </main>
  )
}
