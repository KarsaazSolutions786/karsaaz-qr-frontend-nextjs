import { Metadata } from 'next'
import { Suspense } from 'react'
import { generateOGMetadata } from '@/lib/utils/og-metadata'
import { SignupFormStatic } from '@/components/features/auth/SignupFormStatic'
import { SignupHydrationBridge } from '@/components/features/auth/SignupHydrationBridge'
import { SignupPageContent } from '@/components/features/auth/SignupPageContent'

export const metadata: Metadata = {
  ...generateOGMetadata(
    'Register - Karsaaz QR',
    'Create your Karsaaz QR account',
    undefined,
    '/register'
  ),
}

export default function RegisterPage() {
  return (
    <div
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="relative w-full max-w-md space-y-8">
        <SignupFormStatic />
        <div className="absolute inset-0">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
              </div>
            }
          >
            <SignupHydrationBridge />
            <SignupPageContent />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
