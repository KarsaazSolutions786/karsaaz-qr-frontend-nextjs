import { Metadata } from 'next'
import { Suspense } from 'react'
import { SignupPageContent } from '@/components/features/auth/SignupPageContent'

export const metadata: Metadata = {
  title: 'Sign Up - Karsaaz QR',
  description: 'Create your Karsaaz QR account',
}

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
            </div>
          }
        >
          <SignupPageContent />
        </Suspense>
      </div>
    </div>
  )
}
