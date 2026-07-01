import { Metadata } from 'next'
import { generateOGMetadata } from '@/lib/utils/og-metadata'

export const metadata: Metadata = {
  ...generateOGMetadata(
    'Cookie Policy - Karsaaz QR',
    'Karsaaz QR cookie policy',
    undefined,
    '/cookie-policy'
  ),
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
