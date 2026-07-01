import { Metadata } from 'next'
import { generateOGMetadata } from '@/lib/utils/og-metadata'
import { ForgotPasswordPageContent } from './ForgotPasswordPageContent'

export const metadata: Metadata = {
  ...generateOGMetadata(
    'Forgot Password - Karsaaz QR',
    'Reset your Karsaaz QR password',
    undefined,
    '/forgot-password'
  ),
}

/**
 * Purpose: Executes ForgotPasswordPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function ForgotPasswordPage() {
  return <ForgotPasswordPageContent />
}
