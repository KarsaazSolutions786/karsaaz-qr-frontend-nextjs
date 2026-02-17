'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      const currentPath = window.location.pathname
      router.push(`/login?from=${encodeURIComponent(currentPath)}`)
    }
  }, [user, isLoading, router])

  // Don't show loading state - let child pages handle their own loading
  // This prevents hydration mismatch errors
  if (!isLoading && !user) {
    // Redirecting to login, show nothing
    return null
  }

  // User is authenticated or still loading, show the content
  // Pages will handle their own loading states
  return <>{children}</>
}
