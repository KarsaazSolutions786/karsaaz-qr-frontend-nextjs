import Link from 'next/link'

export default function ThankYouPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Thank You!</h1>
        <p className="mb-6 text-gray-600">
          Thank you for your purchase. Your order has been confirmed and is being processed.
        </p>
        <Link
          href="/dashboard"
          className="inline-block rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
