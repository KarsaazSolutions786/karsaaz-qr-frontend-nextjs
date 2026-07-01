import { Metadata } from 'next'
import { generateOGMetadata } from '@/lib/utils/og-metadata'

export const metadata: Metadata = {
  ...generateOGMetadata(
    'Subscription & Billing Policy - Karsaaz QR',
    'Karsaaz QR subscription and billing policy',
    undefined,
    '/subscription-billing-policy'
  ),
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
