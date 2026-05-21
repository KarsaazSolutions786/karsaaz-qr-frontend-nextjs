'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { Plus, X, Star } from 'lucide-react'

export interface ReviewPlatformConfig {
  id: string
  name: string
  icon: React.ReactNode
  placeholder: string
  urlPattern?: RegExp
}

const PLATFORM_CONFIGS: ReviewPlatformConfig[] = [
  {
    id: 'google',
    name: 'Google',
    placeholder: 'https://g.page/r/...',
    urlPattern: /google\.(com|[a-z]{2})/i,
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
  },
  {
    id: 'yelp',
    name: 'Yelp',
    placeholder: 'https://www.yelp.com/biz/...',
    urlPattern: /yelp\.com/i,
    icon: (
      <svg className="h-4 w-4 text-red-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.16 12.594l-4.995 1.433c-.96.276-1.94-.8-1.564-1.726l2.431-5.964c.38-.935 1.674-.853 1.94.125l1.756 6.435a.95.95 0 01-.568 1.097zm-8.376 5.87l-1.203-5.126c-.233-.993.917-1.77 1.76-1.19l5.187 3.57c.837.575.5 1.87-.507 1.937l-4.627.285a.94.94 0 01-.61-1.476zM3.372 8.876l5.348-.09c1.015-.017 1.564 1.195.866 1.912l-3.726 3.823c-.698.716-1.938.126-1.866-.888l.44-4.095a.94.94 0 01.938-.662zM7.4 18.584l2.592-4.537c.494-.866 1.83-.612 1.971.375l.788 5.524c.14.986-.944 1.632-1.633.972l-3.38-3.24a.93.93 0 01-.338-1.094zM11.137 2.33l-.818 5.17c-.158.994-1.476 1.286-2.023.448L5.133 3.16c-.544-.835.146-1.942 1.037-1.667l4.473 1.344c.419.126.586.61.494 1.493z"/>
      </svg>
    ),
  },
  {
    id: 'tripadvisor',
    name: 'TripAdvisor',
    placeholder: 'https://www.tripadvisor.com/...',
    urlPattern: /tripadvisor\.(com|[a-z]{2})/i,
    icon: (
      <svg className="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.006 4.295c-2.67 0-5.338.784-7.645 2.353H0l1.963 2.135a5.997 5.997 0 004.04 10.43 5.976 5.976 0 004.015-1.536l1.988 2.323 1.988-2.323a5.976 5.976 0 004.015 1.536 5.997 5.997 0 004.04-10.43L24 6.648h-4.35a14.64 14.64 0 00-7.644-2.353zM6.003 17.216a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm11.994 0a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998z"/>
      </svg>
    ),
  },
  {
    id: 'facebook',
    name: 'Facebook',
    placeholder: 'https://www.facebook.com/...',
    urlPattern: /facebook\.com/i,
    icon: (
      <svg className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    id: 'trustpilot',
    name: 'Trustpilot',
    placeholder: 'https://www.trustpilot.com/review/...',
    urlPattern: /trustpilot\.com/i,
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#00B67A"/>
      </svg>
    ),
  },
  {
    id: 'apple',
    name: 'Apple Maps',
    placeholder: 'https://maps.apple.com/...',
    urlPattern: /maps\.apple\.com/i,
    icon: (
      <svg className="h-4 w-4 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83"/>
      </svg>
    ),
  },
  {
    id: 'bbb',
    name: 'BBB',
    placeholder: 'https://www.bbb.org/...',
    urlPattern: /bbb\.org/i,
    icon: <Star className="h-4 w-4 text-blue-800" />,
  },
]

export type ReviewPlatform = string

export interface ReviewSite {
  platform: ReviewPlatform
  url: string
}

interface ReviewSitesInputProps {
  value?: ReviewSite[]
  onChange: (value: ReviewSite[]) => void
  platforms?: ReviewPlatformConfig[]
  className?: string
}

/**
 * Purpose: Executes ReviewSitesInput functionality.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */
export function ReviewSitesInput({
  value = [],
  onChange,
  platforms = PLATFORM_CONFIGS,
  className,
}: ReviewSitesInputProps) {
  const { t } = useTranslation()

  /**
   * Purpose: Executes addRow functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const addRow = () => {
    // Default to the first platform not already used
    const usedPlatforms = new Set(value.map((r) => r.platform))
    const nextPlatform = platforms.find((p) => !usedPlatforms.has(p.id))
    onChange([...value, { platform: nextPlatform?.id || platforms[0]?.id || 'google', url: '' }])
  }

  /**
   * Purpose: Updates the configuration or state.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const updateRow = (index: number, patch: Partial<ReviewSite>) => {
    onChange(value.map((r, i) => (i === index ? { ...r, ...patch } : r)))
  }

  /**
   * Purpose: Deletes the specified resource.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const removeRow = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  /**
   * Purpose: Retrieves platformconfig.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
  const getPlatformConfig = (platformId: string) =>
    platforms.find((p) => p.id === platformId) || platforms[0]

  return (
    <div className={cn('space-y-2', className)}>
      {value.map((row, i) => {
        const platformConfig = getPlatformConfig(row.platform)
        return (
          <div key={i} className="flex items-center gap-2">
            {/* Platform selector with icon */}
            <div className="relative">
              <div className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2">
                {platformConfig?.icon}
              </div>
              <select
                value={row.platform}
                onChange={(e) => updateRow(i, { platform: e.target.value })}
                className={cn(
                  'h-10 w-44 appearance-none rounded-md border border-gray-300 bg-white pl-9 pr-8 text-sm shadow-sm',
                  'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                )}
              >
                {platforms.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* URL input */}
            <input
              type="url"
              placeholder={platformConfig?.placeholder || 'https://...'}
              value={row.url}
              onChange={(e) => updateRow(i, { url: e.target.value })}
              className={cn(
                'flex h-10 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm',
                'placeholder:text-gray-400',
                'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
              )}
            />

            {/* Remove button */}
            <button
              type="button"
              onClick={() => removeRow(i)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-300 text-gray-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              aria-label={t('Remove')}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}

      {/* Add button */}
      <button
        type="button"
        onClick={addRow}
        className={cn(
          'flex h-9 w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-gray-300 px-3 text-sm text-gray-600',
          'hover:border-blue-400 hover:text-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors'
        )}
      >
        <Plus className="h-4 w-4" />
        {t('Add review site')}
      </button>
    </div>
  )
}
