import { Metadata } from 'next'
import { Suspense } from 'react'
import { ResetPasswordForm } from '@/components/features/auth/ResetPasswordForm'

export const metadata: Metadata = {
  title: 'Reset Password - Karsaaz QR',
  description: 'Reset your password',
}

// Mark as dynamic since it uses searchParams
export const dynamic = 'force-dynamic'

function ResetPasswordContent({ token, email }: { token: string; email: string }) {
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-900">Invalid Reset Link</h2>
          <p className="mt-2 text-sm text-gray-600">
            This password reset link is invalid or has expired.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below
          </p>
        </div>

        <div className="mt-8">
          <ResetPasswordForm token={token} email={email} />
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string; email?: string }
}) {
  const token = searchParams.token || ''
  const email = searchParams.email || ''

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent token={token} email={email} />
    </Suspense>
  )
}
