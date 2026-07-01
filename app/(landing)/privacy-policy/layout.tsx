import { Metadata } from 'next'
import { generateOGMetadata } from '@/lib/utils/og-metadata'

export const metadata: Metadata = {
  ...generateOGMetadata(
    'Privacy Policy - Karsaaz QR',
    'Karsaaz QR privacy policy',
    undefined,
    '/privacy-policy'
  ),
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
