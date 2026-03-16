import { Metadata } from 'next'
import { PricingPageWrapper } from '@/components/features/subscriptions/PricingPageWrapper'
import { generateOGMetadata } from '@/lib/utils/og-metadata'

export const metadata: Metadata = {
  ...generateOGMetadata(
    'Pricing - Karsaaz QR',
    'Choose the perfect plan for your QR code needs. Simple, transparent pricing with free tier available.',
    undefined,
    '/pricing'
  ),
}

export default function PricingPage() {
  return <PricingPageWrapper />
}
