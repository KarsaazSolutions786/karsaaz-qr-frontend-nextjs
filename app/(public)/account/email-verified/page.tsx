'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

/**
 * Email Verified Success Page
 *
 * The backend (AccountController::verifyEmail) redirects here after
 * successfully verifying the user's email via the link sent in the
 * verification email.  The redirect target is:
 *   config('frontend.url') . '/account/email-verified'
 *
 * This page shows a success message with an auto-redirect countdown
 * to the dashboard, matching the legacy qrcg-email-verified behaviour.
 */
export default function EmailVerifiedPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (countdown <= 0) {
      router.push('/qrcodes')
      return
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Success icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-10 w-10 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">Email Verified!</h2>
          <p className="mt-2 text-sm text-gray-600">
            Your email address has been successfully verified. You now have full
            access to all features.
          </p>
        </div>

        <p className="text-sm text-gray-500">
          Redirecting to dashboard in {countdown} second
          {countdown !== 1 ? 's' : ''}…
        </p>

        <Link
          href="/qrcodes"
          className="inline-block rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Go to Dashboard Now
        </Link>
      </div>
    </div>
  )
}
