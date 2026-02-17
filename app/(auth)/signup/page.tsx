import { Metadata } from 'next'
import { RegisterForm } from '@/components/features/auth/RegisterForm'
import { GoogleLoginButton } from '@/components/features/auth/GoogleLoginButton'

export const metadata: Metadata = {
  title: 'Sign Up - Karsaaz QR',
  description: 'Create your Karsaaz QR account',
}

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Start creating QR codes in minutes
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <GoogleLoginButton />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-50 px-2 text-gray-500">Or continue with email</span>
            </div>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
