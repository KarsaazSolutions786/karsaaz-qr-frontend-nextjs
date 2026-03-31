'use client'

import { useTranslation } from '@/lib/i18n'
import type { GuestSessionInfo } from '@/lib/api/endpoints/guest'

interface GuestLimitsBannerProps {
  limits: GuestSessionInfo['limits']
}

export function GuestLimitsBanner({ limits }: GuestLimitsBannerProps) {
  const { t } = useTranslation()

  return (
    <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-900/20">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-blue-700 dark:text-blue-300">
        <span>
          🔵 {t('QR Codes')}: {limits.qrcodes.remaining}/{limits.qrcodes.max} {t('remaining')}
        </span>
        <span>
          📥 {t('Downloads')}: {limits.downloads.remaining}/{limits.downloads.max} {t('remaining')}
        </span>
        <span>
          📷 {t('Scans')}: {limits.scans.remaining}/{limits.scans.max} {t('remaining')}
        </span>
      </div>
    </div>
  )
}
