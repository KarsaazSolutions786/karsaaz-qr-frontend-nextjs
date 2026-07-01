import { Metadata } from 'next'
import { generateOGMetadata } from '@/lib/utils/og-metadata'

export const metadata: Metadata = {
  ...generateOGMetadata(
    'Refund Policy - Karsaaz QR',
    'Karsaaz QR refund policy',
    undefined,
    '/refund-policy'
  ),
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
