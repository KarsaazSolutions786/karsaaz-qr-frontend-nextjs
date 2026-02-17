'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (!isLoading && user) {
      router.push('/qrcodes')
    }
  }, [user, isLoading, router])

  // Don't block rendering - let the redirect happen in the background
  // This prevents hydration mismatch errors
  if (!isLoading && user) {
    // Redirecting to dashboard, show nothing
    return null
  }

  // Show the auth form (even during loading to prevent hydration issues)
  return <>{children}</>
}
