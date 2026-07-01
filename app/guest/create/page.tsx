import { Suspense } from 'react'
import { Metadata } from 'next'
import { generateOGMetadata } from '@/lib/utils/og-metadata'
import { GuestCreateStatic } from './GuestCreateStatic'
import { GuestCreateHydrationBridge } from './GuestCreateHydrationBridge'
import GuestCreateClient from './GuestCreateClient'

export const metadata: Metadata = {
  ...generateOGMetadata(
    'Create QR Code - Karsaaz QR Guest',
    'Create a QR code without signing up',
    undefined,
    '/guest/create'
  ),
}

export default function GuestCreatePage() {
  return (
    <div className="relative">
      <GuestCreateStatic />
      <div className="relative min-h-[50vh]">
        <Suspense fallback={null}>
          <GuestCreateHydrationBridge />
          <GuestCreateClient />
        </Suspense>
      </div>
    </div>
  )
}
