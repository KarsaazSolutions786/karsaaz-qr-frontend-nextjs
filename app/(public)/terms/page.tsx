import { Metadata } from 'next'
import { TermsPageContent } from './TermsPageContent'
import { generateOGMetadata } from '@/lib/utils/og-metadata'

export const metadata: Metadata = {
  ...generateOGMetadata(
    'Terms of Service - Karsaaz QR',
    'Karsaaz QR Terms of Service and acceptable use policy.',
    undefined,
    '/terms'
  ),
}

export default function TermsPage() {
  return <TermsPageContent />
}
