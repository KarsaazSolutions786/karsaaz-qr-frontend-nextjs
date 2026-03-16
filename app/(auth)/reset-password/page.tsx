import { Metadata } from 'next'
import { Suspense } from 'react'
import { ResetPasswordPageContent } from './ResetPasswordPageContent'

export const metadata: Metadata = {
  title: 'Reset Password - Karsaaz QR',
  description: 'Reset your password',
}

// Mark as dynamic since it uses searchParams
export const dynamic = 'force-dynamic'

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string; email?: string }
}) {
  const token = searchParams.token || ''
  const email = searchParams.email || ''

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPageContent token={token} email={email} />
    </Suspense>
  )
}
