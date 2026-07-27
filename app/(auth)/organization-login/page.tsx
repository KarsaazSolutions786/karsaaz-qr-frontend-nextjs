import { Metadata } from 'next'
import { OrgLoginContent } from '@/components/features/auth/OrgLoginContent'

export const metadata: Metadata = {
  title: 'Organization Login | Karsaaz QR',
  description: 'Login to your organization portal',
}

export default function OrganizationLoginPage() {
  return (
    <div
      id="main-content"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          'linear-gradient(225deg, rgba(248, 127, 251, 1) 2%, rgba(150, 131, 255, 1) 98%)',
      }}
    >
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
        <img src="/images/auth/qr-diamonds.svg" alt="" className="block h-full w-full" />
      </div>
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
      <div className="relative z-10 w-full flex items-center justify-center p-4">
        <OrgLoginContent />
      </div>
    </div>
  )
}
