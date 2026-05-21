'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useTranslation } from '@/lib/i18n'
import { bannerApi, type BannerSettings } from '@/lib/api/endpoints/banner'
import { cn } from '@/lib/utils/cn'

/**
 * Purpose: Public-facing website banner with optional scrolling marquee. Behaviour: - Fetches banner config from `/admin/settings/banner`. - If `background_color` is set, uses custom colors; otherwise falls back to type-based preset colors. - If the content is long (>100 chars), automatically enables marquee scroll. Admin can also force scroll mode via the `scroll` config key. - Dismissal persists in localStorage keyed by content hash.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */


function hashContent(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return `website-banner-dismissed-${hash}`
}

const PRESET_STYLES: Record<string, string> = {
  info: 'bg-blue-600 text-white',
  warning: 'bg-amber-500 text-white',
  success: 'bg-green-600 text-white',
  promo: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white',
}

/**
 * Purpose: Executes WebsiteAnnouncementBanner functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function WebsiteAnnouncementBanner() {
  const { t } = useTranslation()
  const [dismissed, setDismissed] = useState(false)
  const [storageKey, setStorageKey] = useState<string | null>(null)

  const { data: banner } = useQuery<BannerSettings>({
    queryKey: ['banner-settings'],
    queryFn: () => bannerApi.getSettings(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  useEffect(() => {
    if (!banner?.content) return
    const key = hashContent(banner.content)
    setStorageKey(key)
    try {
      if (localStorage.getItem(key) === 'true') {
        setDismissed(true)
      }
    } catch {
      // ignore
    }
  }, [banner?.content])

  if (!banner || !banner.enabled || !banner.content || dismissed) {
    return null
  }

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
        // ignore
      }
    }
  }

  // Determine if scrolling marquee should be used.
  // Auto-scroll when content is long; can also be forced via a future `scroll` config key.
  const isLongContent = banner.content.length > 100
  const useMarquee = isLongContent

  // Custom colors override type-based presets
  const hasCustomColors = banner.background_color && banner.text_color
  const bgStyle = hasCustomColors
    ? { backgroundColor: banner.background_color, color: banner.text_color }
    : undefined
  const presetClass = !hasCustomColors ? (PRESET_STYLES[banner.type] ?? PRESET_STYLES.info) : ''

  return (
    <div
      className={cn(
        'relative px-4 py-2.5 text-sm font-medium overflow-hidden',
        presetClass
      )}
      style={bgStyle}
    >
      <div className="flex items-center justify-center gap-3">
        {useMarquee ? (
          <div className="flex-1 overflow-hidden">
            <div className="whitespace-nowrap animate-marquee">
              <span className="inline-block pr-16">{banner.content}</span>
              <span className="inline-block pr-16">{banner.content}</span>
            </div>
          </div>
        ) : (
          <span>{banner.content}</span>
        )}

        {banner.link_url && banner.link_text && (
          <Link
            href={banner.link_url}
            className="shrink-0 rounded-md bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm hover:bg-white/30 transition-colors"
          >
            {banner.link_text}
          </Link>
        )}

        {banner.dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            className="shrink-0 ml-1 p-0.5 rounded opacity-70 hover:opacity-100 transition-opacity"
            aria-label={t('Dismiss banner')}
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Marquee keyframes injected via styled-jsx to avoid requiring global CSS changes */}
      {useMarquee && (
        <style jsx global>{`
          @keyframes website-banner-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: website-banner-marquee 20s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>
      )}
    </div>
  )
}
