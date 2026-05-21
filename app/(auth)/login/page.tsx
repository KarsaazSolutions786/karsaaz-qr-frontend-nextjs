import { Metadata } from 'next'

import { Suspense } from 'react'
import { LoginTypeSelector } from '@/components/features/auth/LoginTypeSelector'

export const metadata: Metadata = {
  title: 'Sign In - Karsaaz QR',
  description: 'Sign in to your Karsaaz QR account',
}

/**
 * Purpose: Executes LoginPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function LoginPage() {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          'linear-gradient(225deg, rgba(248, 127, 251, 1) 2%, rgba(150, 131, 255, 1) 98%)',
      }}
    >
      {/* Decorative QR diamond pattern — top-right, rotated, partially off-screen */}
      <div
        className="pointer-events-none absolute select-none"
        aria-hidden="true"
        style={{
          top: '-30%',
          right: '-21%',
          width: 918,
          height: 918,
          transform: 'rotate(-50.47deg)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/auth/qr-diamonds.svg" alt="" className="block h-full w-full" />
      </div>

      {/* Concentric ellipse rings — bottom-left area */}
      <div
        className="pointer-events-none absolute select-none"
        aria-hidden="true"
        style={{ left: 35, top: 343, width: 1369, height: 1369 }}
      >
        <img src="/images/auth/ellipse-outer.svg" alt="" className="block h-full w-full" />
      </div>
      <div
        className="pointer-events-none absolute select-none"
        aria-hidden="true"
        style={{ left: 161, top: 467, width: 1115, height: 1115 }}
      >
        <img src="/images/auth/ellipse-mid.svg" alt="" className="block h-full w-full" />
      </div>
      <div
        className="pointer-events-none absolute select-none"
        aria-hidden="true"
        style={{ left: 276, top: 591, width: 881, height: 882 }}
      >
        <img src="/images/auth/ellipse-inner.svg" alt="" className="block h-full w-full" />
      </div>

      {/* Centered login card */}
      <div className="relative z-10 w-[447px] max-w-[calc(100%-32px)]">
        <Suspense
          fallback={
            <div className="flex items-center justify-center rounded-[23px] bg-white/30 p-12 shadow-[0px_3px_12px_0px_rgba(54,54,54,0.3)]">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white" />
            </div>
          }
        >
          <LoginTypeSelector />
        </Suspense>
      </div>
    </div>
  )
}
