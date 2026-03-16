import { Metadata } from 'next'
import { ForgotPasswordPageContent } from './ForgotPasswordPageContent'

export const metadata: Metadata = {
  title: 'Forgot Password - Karsaaz QR',
  description: 'Reset your Karsaaz QR password',
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordPageContent />
}
