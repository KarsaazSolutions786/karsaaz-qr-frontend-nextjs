import Link from 'next/link'

/** SSR scaffold for /qrcodes/new (audit F-06). */
export function QRCodesNewStatic() {
  return (
    <div id="qrcodes-new-ssr" className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Create a QR Code</h1>
      <p className="mb-6 text-gray-600">
        Choose a QR code type to get started. Sign in to save QR codes to your dashboard.
      </p>
      <nav aria-label="QR code types" className="mb-8">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {['URL', 'Text', 'WiFi', 'Email', 'Phone', 'PDF'].map(label => (
            <li key={label}>
              <span className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </nav>
      <p className="text-sm text-gray-600">
        <Link href="/login" className="font-medium text-[#8351e0] underline">
          Sign in
        </Link>{' '}
        or{' '}
        <Link href="/register" className="font-medium text-[#8351e0] underline">
          create a free account
        </Link>{' '}
        to unlock all QR types and analytics.
      </p>
    </div>
  )
}
