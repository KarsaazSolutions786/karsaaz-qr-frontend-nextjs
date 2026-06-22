import { Suspense } from 'react'
import { GuestCreateStatic } from './GuestCreateStatic'
import { GuestCreateHydrationBridge } from './GuestCreateHydrationBridge'
import GuestCreateClient from './GuestCreateClient'

export const metadata = {
  title: 'Create QR Code - Karsaaz QR Guest',
  description: 'Create a QR code without signing up',
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
