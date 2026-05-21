'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useTranslation } from '@/lib/i18n'
import { bannerApi, type BannerSettings } from '@/lib/api/endpoints/banner'

/**
 * Purpose: Shows an admin-configured announcement banner to dashboard users. - Fetches banner config from the backend on mount. - If enabled, displays a dismissible banner at the top of the dashboard layout. - Dismissal is persisted in localStorage keyed by banner content hash, so changing the banner text resets dismissal for all users.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */


function hashString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0 // Convert to 32-bit integer
  }
  return `dashboard-banner-dismissed-${hash}`
}

const TYPE_STYLES: Record<string, { bg: string; text: string; close: string; linkBtn: string }> = {
  info: {
    bg: 'bg-blue-600',
    text: 'text-white',
    close: 'text-blue-200 hover:text-white',
    linkBtn: 'bg-white text-blue-700 hover:bg-blue-50',
  },
  warning: {
    bg: 'bg-amber-500',
    text: 'text-white',
    close: 'text-amber-200 hover:text-white',
    linkBtn: 'bg-white text-amber-700 hover:bg-amber-50',
  },
  success: {
    bg: 'bg-green-600',
    text: 'text-white',
    close: 'text-green-200 hover:text-white',
    linkBtn: 'bg-white text-green-700 hover:bg-green-50',
  },
  promo: {
    bg: 'bg-gradient-to-r from-purple-600 to-indigo-600',
    text: 'text-white',
    close: 'text-purple-200 hover:text-white',
    linkBtn: 'bg-white text-purple-700 hover:bg-purple-50',
  },
}

/**
 * Purpose: Executes DashboardBanner functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function DashboardBanner() {
  const { t } = useTranslation()
  const [dismissed, setDismissed] = useState(false)
  const [storageKey, setStorageKey] = useState<string | null>(null)

  const { data: banner } = useQuery<BannerSettings>({
    queryKey: ['banner-settings'],
    queryFn: () => bannerApi.getSettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })

  // Check localStorage for dismissal when banner data loads
  useEffect(() => {
    if (!banner?.content) return
    const key = hashString(banner.content)
    setStorageKey(key)
    try {
      const wasDismissed = localStorage.getItem(key)
      if (wasDismissed === 'true') {
        setDismissed(true)
      }
    } catch {
      // localStorage unavailable
    }
  }, [banner?.content])

  if (!banner || !banner.enabled || !banner.content || dismissed) {
    return null
  }

  const styles = (TYPE_STYLES[banner.type] ?? TYPE_STYLES.info)!

  /**
   * Purpose: Executes handleDismiss functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
  const handleDismiss = () => {
    setDismissed(true)
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, 'true')
      } catch {
        // localStorage unavailable
      }
    }
  }

  return (
    <div className={`${styles.bg} ${styles.text} px-4 py-2.5 text-sm z-40`}>
      <div className="flex items-center justify-center gap-3">
        <span className="font-medium">{banner.content}</span>
        {banner.link_url && banner.link_text && (
          <Link
            href={banner.link_url}
            className={`shrink-0 rounded-md px-3 py-1 text-xs font-semibold transition-colors ${styles.linkBtn}`}
          >
            {banner.link_text}
          </Link>
        )}
        {banner.dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            className={`shrink-0 ml-1 p-0.5 rounded transition-colors ${styles.close}`}
            aria-label={t('Dismiss banner')}
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
