import Link from 'next/link'
import { cookies } from 'next/headers'
import { CookieConsentClient } from './CookieConsentClient'

const CONSENT_COOKIE = 'karsaaz_cookie_consent'

/**
 * SSR cookie consent banner (audit F-05). Present in initial HTML when no consent cookie exists.
 */
export async function CookieConsentBanner() {
  const consent = (await cookies()).get(CONSENT_COOKIE)
  if (consent?.value) return null

  return (
    <>
      <div
        id="cookie-consent-banner"
        role="dialog"
        aria-label="Cookie consent"
        aria-live="polite"
        className="fixed bottom-0 left-0 right-0 z-[100] border-t border-gray-200 bg-white p-4 shadow-lg md:p-6"
      >
        <div className="mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-gray-700">
            We use essential cookies to run Karsaaz QR and optional cookies to improve your
            experience. See our{' '}
            <Link href="/cookie-policy" className="text-[#8351e0] underline">
              Cookie Policy
            </Link>{' '}
            and{' '}
            <Link href="/privacy-policy" className="text-[#8351e0] underline">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              data-cookie-reject
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
            >
              Reject non-essential
            </button>
            <button
              type="button"
              data-cookie-accept
              className="rounded-lg bg-[#8351e0] px-4 py-2 text-sm font-semibold text-white"
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
      <CookieConsentClient />
    </>
  )
}
