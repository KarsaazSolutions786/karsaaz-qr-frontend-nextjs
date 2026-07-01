import { Metadata } from 'next'
import { TermsPageContent } from './TermsPageContent'
import { TermsPageStatic } from './TermsPageStatic'
import { TermsHydrationBridge } from './TermsHydrationBridge'
import { generateOGMetadata } from '@/lib/utils/og-metadata'

export const metadata: Metadata = {
  ...generateOGMetadata(
    'Terms of Service - Karsaaz QR',
    'Karsaaz QR Terms of Service and acceptable use policy.',
    undefined,
    '/terms'
  ),
}

/**
 * Purpose: Executes TermsPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function TermsPage() {
  return (
    <div className="relative min-h-screen">
      <TermsPageStatic />
      <div className="absolute inset-0">
        <TermsHydrationBridge />
        <TermsPageContent />
      </div>
    </div>
  )
}
