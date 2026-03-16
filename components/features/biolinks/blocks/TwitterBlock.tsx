'use client'

import { useEffect, useRef } from 'react'
import { useTranslation } from '@/lib/i18n'
import type { TwitterBlockData } from '@/types/entities/biolink'

interface TwitterBlockProps {
  block: TwitterBlockData
  isEditing?: boolean
  onUpdate?: (data: TwitterBlockData['data']) => void
}

/**
 * Validates a Twitter/X tweet URL.
 * Supports:
 * - https://twitter.com/username/status/1234567890
 * - https://x.com/username/status/1234567890
 */
function isValidTweetUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?(twitter|x)\.com\/\w+\/status\/\d+/.test(url)
}

/**
 * Extracts tweet ID from URL.
 */
function extractTweetId(url: string): string | null {
  const match = url.match(/status\/(\d+)/)
  return match?.[1] ?? null
}

export default function TwitterBlock({ block, isEditing, onUpdate }: TwitterBlockProps) {
  const { t } = useTranslation();
  const { url, theme = 'light' } = block.data
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isEditing || !url || !isValidTweetUrl(url)) return

    const loadTwitterWidget = () => {
      const twttr = (window as any).twttr

      if (twttr?.widgets) {
        // Clear previous embed
        if (containerRef.current) {
          const existingWidget = containerRef.current.querySelector('.twitter-tweet-rendered')
          if (existingWidget) {
            existingWidget.remove()
          }
        }

        twttr.widgets.createTweet(extractTweetId(url)!, containerRef.current!, {
          theme,
          dnt: true,
          align: 'center',
        })
      }
    }

    const existingScript = document.querySelector(
      'script[src="https://platform.twitter.com/widgets.js"]'
    )

    if (!existingScript) {
      const script = document.createElement('script')
      script.src = 'https://platform.twitter.com/widgets.js'
      script.async = true
      script.charset = 'utf-8'
      script.onload = loadTwitterWidget
      document.body.appendChild(script)
    } else {
      loadTwitterWidget()
    }
  }, [url, theme, isEditing])

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Tweet URL')}</label>
          <input
            type="url"
            value={url}
            onChange={(e) => onUpdate?.({ ...block.data, url: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="https://twitter.com/username/status/..."
          />
          <p className="mt-1 text-xs text-gray-500">
            {t('Supports twitter.com and x.com URLs')}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Theme')}</label>
          <select
            value={theme}
            onChange={(e) =>
              onUpdate?.({ ...block.data, theme: e.target.value as 'dark' | 'light' })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="light">{t('Light')}</option>
            <option value="dark">{t('Dark')}</option>
          </select>
        </div>
      </div>
    )
  }

  if (!url || !isValidTweetUrl(url)) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <p className="text-sm text-gray-500">{t('Enter a valid Tweet URL')}</p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="flex justify-center overflow-hidden rounded-lg">
      <blockquote className="twitter-tweet" data-theme={theme} data-dnt="true">
        <a href={url} target="_blank" rel="noopener noreferrer">
          {t('Loading tweet...')}
        </a>
      </blockquote>
    </div>
  )
}
