import Link from 'next/link'

/**
 * Server-rendered guest QR creation scaffold (audit F-03).
 * Visible in initial HTML for crawlers and no-JS users; hidden after client hydration.
 */
const GUEST_QR_TYPES = [
  { id: 'url', label: 'URL', description: 'Link to any website' },
  { id: 'text', label: 'Text', description: 'Plain text message' },
  { id: 'wifi', label: 'WiFi', description: 'WiFi network credentials' },
  { id: 'email', label: 'Email', description: 'Pre-filled email' },
  { id: 'phone', label: 'Phone', description: 'Phone number to call' },
]

export function GuestCreateStatic() {
  return (
    <div id="guest-create-ssr" className="mx-auto max-w-2xl">
      <Link href="/guest" className="mb-2 inline-block text-sm text-blue-600 hover:underline">
        ← Back to QR Types
      </Link>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Create QR Code</h1>
      <p className="mb-4 text-sm text-gray-600">
        Choose a QR code type and fill in the details below. No account required.
      </p>

      <nav aria-label="QR code types" className="mb-6">
        <ul className="flex flex-wrap gap-2">
          {GUEST_QR_TYPES.map(type => (
            <li key={type.id}>
              <Link
                href={`/guest/create?type=${type.id}`}
                className="inline-block rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 hover:border-blue-400"
              >
                {type.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <form
        action="/guest/create"
        method="get"
        aria-label="Create guest QR code"
        className="space-y-4 rounded-xl border border-gray-200 bg-white p-6"
      >
        <input type="hidden" name="type" value="url" />
        <div>
          <label htmlFor="ssr-guest-qr-name" className="block text-sm font-medium text-gray-700">
            QR Code Name
          </label>
          <input
            id="ssr-guest-qr-name"
            name="name"
            type="text"
            required
            placeholder="My QR Code"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="ssr-guest-url" className="block text-sm font-medium text-gray-700">
            URL
          </label>
          <input
            id="ssr-guest-url"
            name="url"
            type="url"
            placeholder="https://example.com"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Create QR Code
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        <Link href="/signup" className="text-blue-600 underline">
          Sign up
        </Link>{' '}
        for more QR types and features.
      </p>
    </div>
  )
}
