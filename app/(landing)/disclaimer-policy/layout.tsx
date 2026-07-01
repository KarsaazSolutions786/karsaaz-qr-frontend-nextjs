import { Metadata } from 'next'
import { generateOGMetadata } from '@/lib/utils/og-metadata'

export const metadata: Metadata = {
  ...generateOGMetadata(
    'Disclaimer - Karsaaz QR',
    'Karsaaz QR disclaimer policy',
    undefined,
    '/disclaimer-policy'
  ),
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
