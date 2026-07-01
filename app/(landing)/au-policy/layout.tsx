import { Metadata } from 'next'
import { generateOGMetadata } from '@/lib/utils/og-metadata'

export const metadata: Metadata = {
  ...generateOGMetadata(
    'Acceptable Use Policy - Karsaaz QR',
    'Karsaaz QR acceptable use policy',
    undefined,
    '/au-policy'
  ),
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
