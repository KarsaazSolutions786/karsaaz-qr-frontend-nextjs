'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Dashboard Root - Redirects to home page
 * 
 * In Lit frontend, the home page is at /dashboard/qrcodes/new
 * In React, that maps to /qrcodes/new
 * 
 * This root path redirects to maintain the same behavior
 */
export default function DashboardRootPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home page (template categories)
    router.replace('/qrcodes/new')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  )
}
