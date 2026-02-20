'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/context/AuthContext'
import { permitted, verified } from '@/lib/utils/permissions'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  /** Permission slug required to access this route (empty string = any authenticated user) */
  permission?: string
  /** Whether email verification is required (default: true) */
  requireVerification?: boolean
  /** Custom redirect URL on access denied (default: /login with redirect back) */
  redirectTo?: string
  /** Delay in ms before redirecting (matches original: 2000ms) */
  redirectDelay?: number
  children: ReactNode
}

/**
 * ProtectedRoute - Wraps content requiring specific permissions.
 * 
 * Matches original qrcg-protected-route.js behavior:
 * 1. Check if user is authenticated + has required permission
 * 2. If not, show a loading UI with message
 * 3. After 2 seconds, redirect to login page with ?redirect= querystring
 * 
 * Usage:
 *   <ProtectedRoute permission="manage_users">
 *     <UserManagementPage />
 *   </ProtectedRoute>
 */
export function ProtectedRoute({
  permission = '',
  requireVerification = true,
  redirectTo,
  redirectDelay = 2000,
  children,
}: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading } = useAuth()
  const [accessState, setAccessState] = useState<'checking' | 'granted' | 'denied'>('checking')

  useEffect(() => {
    // Wait for auth to finish loading
    if (isLoading) {
      setAccessState('checking')
      return
    }

    // Not authenticated
    if (!user) {
      setAccessState('denied')
      const timer = setTimeout(() => {
        const redirectUrl = redirectTo || `/login?redirect=${encodeURIComponent(pathname)}`
        router.push(redirectUrl)
      }, redirectDelay)
      return () => clearTimeout(timer)
    }

    // Check email verification if required
    if (requireVerification && !verified(user)) {
      setAccessState('denied')
      const timer = setTimeout(() => {
        router.push('/verify-email')
      }, redirectDelay)
      return () => clearTimeout(timer)
    }

    // Check permission (empty permission = allow any authenticated user)
    if (!permitted(user, permission)) {
      setAccessState('denied')
      const timer = setTimeout(() => {
        const redirectUrl = redirectTo || `/login?redirect=${encodeURIComponent(pathname)}`
        router.push(redirectUrl)
      }, redirectDelay)
      return () => clearTimeout(timer)
    }

    // Access granted
    setAccessState('granted')
  }, [user, isLoading, permission, requireVerification, pathname, router, redirectTo, redirectDelay])

  // Show loading state while checking or while denied (before redirect)
  if (accessState === 'checking' || accessState === 'denied') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground text-center">
          {accessState === 'checking'
            ? 'Verifying access...'
            : 'Access denied. Redirecting...'}
        </p>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
