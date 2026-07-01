import { Suspense } from 'react'
import { Metadata } from 'next'
import { generateOGMetadata } from '@/lib/utils/og-metadata'
import { QRCodesNewStatic } from './QRCodesNewStatic'
import { QRCodesNewHydrationBridge } from './QRCodesNewHydrationBridge'
import CreateQRCodePageClient from './CreateQRCodePageClient'

export const metadata: Metadata = {
  ...generateOGMetadata(
    'Create QR Code - Karsaaz QR',
    'Create and customize QR codes with Karsaaz QR',
    undefined,
    '/qrcodes/new'
  ),
}

export default function CreateQRCodePage() {
  return (
    <div className="relative min-h-full">
      <QRCodesNewStatic />
      <div className="relative min-h-[50vh]">
        <Suspense
          fallback={<div className="px-4 py-6 animate-pulse text-gray-500">Loading...</div>}
        >
          <QRCodesNewHydrationBridge />
          <CreateQRCodePageClient />
        </Suspense>
      </div>
    </div>
  )
}
