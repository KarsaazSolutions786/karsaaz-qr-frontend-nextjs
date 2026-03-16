import { Metadata } from 'next'
import { PrivacyPageContent } from './PrivacyPageContent'
import { generateOGMetadata } from '@/lib/utils/og-metadata'

export const metadata: Metadata = {
  ...generateOGMetadata(
    'Privacy Policy - Karsaaz QR',
    'Karsaaz QR Privacy Policy — how we collect, use, and protect your data.',
    undefined,
    '/privacy'
  ),
}

export default function PrivacyPage() {
  return <PrivacyPageContent />
}
