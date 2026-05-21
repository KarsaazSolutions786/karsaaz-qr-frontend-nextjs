import { Metadata } from 'next'
import { ForgotPasswordPageContent } from './ForgotPasswordPageContent'

export const metadata: Metadata = {
  title: 'Forgot Password - Karsaaz QR',
  description: 'Reset your Karsaaz QR password',
}

/**
 * Purpose: Executes ForgotPasswordPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function ForgotPasswordPage() {
  return <ForgotPasswordPageContent />
}
