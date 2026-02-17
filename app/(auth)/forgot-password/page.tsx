import { Metadata } from 'next'
import { ForgotPasswordForm } from '@/components/features/auth/ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Forgot Password - Karsaaz QR',
  description: 'Reset your Karsaaz QR password',
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            No worries, we&apos;ll send you reset instructions
          </p>
        </div>

        <div className="mt-8">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}
