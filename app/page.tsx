'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'

export default function HomePage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // User is authenticated, redirect to dashboard
        router.push('/qrcodes')
      } else {
        // User is not authenticated, redirect to login
        router.push('/login')
      }
    }
  }, [user, isLoading, router])

  // Show loading state while checking auth
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Karsaaz QR</h1>
        <p className="text-lg text-gray-600 mb-8">
          Loading...
        </p>
      </div>
    </main>
  )
}
