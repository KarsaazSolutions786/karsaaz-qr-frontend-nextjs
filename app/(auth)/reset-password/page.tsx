import { Metadata } from 'next'
import { generateOGMetadata } from '@/lib/utils/og-metadata'
import { Suspense } from 'react'
import { ResetPasswordPageContent } from './ResetPasswordPageContent'

export const metadata: Metadata = {
  ...generateOGMetadata(
    'Reset Password - Karsaaz QR',
    'Reset your Karsaaz QR password',
    undefined,
    '/reset-password'
  ),
}

// Mark as dynamic since it uses searchParams
export const dynamic = 'force-dynamic'

/**
 * Purpose: Executes ResetPasswordPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
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
