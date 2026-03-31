'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useGuest } from '@/lib/hooks/useGuest'
import { GuestLimitsBanner } from '@/components/guest/GuestLimitsBanner'
import { GuestSignupPrompt } from '@/components/guest/GuestSignupPrompt'
import { Loader } from '@/components/ui/loader'
import { useTranslation } from '@/lib/i18n'

const QR_TYPE_META: Record<string, { icon: string; label: string; description: string }> = {
  url: { icon: '🔗', label: 'URL', description: 'Link to any website' },
  text: { icon: '📝', label: 'Text', description: 'Plain text message' },
  wifi: { icon: '📶', label: 'WiFi', description: 'WiFi network credentials' },
  email: { icon: '📧', label: 'Email', description: 'Pre-filled email' },
  phone: { icon: '📞', label: 'Phone', description: 'Phone number to call' },
  sms: { icon: '💬', label: 'SMS', description: 'Pre-filled text message' },
  vcard: { icon: '👤', label: 'vCard', description: 'Digital business card' },
  location: { icon: '📍', label: 'Location', description: 'Map coordinates' },
  calendar: { icon: '📅', label: 'Calendar', description: 'Calendar event' },
}

export default function GuestHomePage() {
  const { t } = useTranslation()
  const { guestConfig, sessionLimits, isGuestLoading, isGuest } = useGuest()

  const allowedTypes = useMemo(() => {
    if (!guestConfig?.allowed_qr_types) return []
    return guestConfig.allowed_qr_types.filter(type => QR_TYPE_META[type])
  }, [guestConfig])

  if (isGuestLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  if (!guestConfig?.is_guest_mode_enabled) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <div className="mb-4 text-6xl">🔒</div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          {t('Guest Mode Unavailable')}
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          {t('Please sign up or log in to create QR codes.')}
        </p>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            {t('Sign In')}
          </Link>
          <Link
            href="/signup"
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
          >
            {t('Sign Up')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Limits banner */}
      {isGuest && sessionLimits && <GuestLimitsBanner limits={sessionLimits} />}

      {/* Page header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          {t('Create QR Codes — No Signup Required')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('Choose a QR code type below to get started. Sign up later to save and manage your codes.')}
        </p>
      </div>

      {/* QR type grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allowedTypes.map(type => {
          const meta = QR_TYPE_META[type]
          if (!meta) return null
          return (
            <Link
              key={type}
              href={`/guest/create?type=${type}`}
              className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
            >
              <div className="mb-3 text-4xl">{meta.icon}</div>
              <h3 className="mb-1 text-lg font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                {t(meta.label)}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t(meta.description)}
              </p>
            </Link>
          )
        })}
      </div>

      {/* Scanner link */}
      {guestConfig.allow_scanner && (
        <div className="mt-8 text-center">
          <Link
            href="/guest/scanner"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            📷 {t('Scan a QR Code')}
          </Link>
        </div>
      )}

      {/* Signup prompt */}
      <GuestSignupPrompt />
    </div>
  )
}
