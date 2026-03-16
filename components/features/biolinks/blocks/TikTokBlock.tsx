'use client'

import { useEffect, useRef } from 'react'
import { useTranslation } from '@/lib/i18n'
import type { TikTokBlockData } from '@/types/entities/biolink'

interface TikTokBlockProps {
  block: TikTokBlockData
  isEditing?: boolean
  onUpdate?: (data: TikTokBlockData['data']) => void
}

/**
 * Extracts a TikTok video ID from various URL formats:
 * - https://www.tiktok.com/@username/video/1234567890123456789
 * - https://vm.tiktok.com/ZMXXXXXXX/
 */
function extractTikTokVideoId(url: string): string | null {
  const match = url.match(/\/video\/(\d+)/)
  if (match?.[1]) return match[1]
  return null
}

export default function TikTokBlock({ block, isEditing, onUpdate }: TikTokBlockProps) {
  const { t } = useTranslation();
  const { url } = block.data
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isEditing || !url) return

    const videoId = extractTikTokVideoId(url)
    if (!videoId) return

    // Load TikTok embed script
    const existingScript = document.querySelector(
      'script[src="https://www.tiktok.com/embed.js"]'
    )

    if (!existingScript) {
      const script = document.createElement('script')
      script.src = 'https://www.tiktok.com/embed.js'
      script.async = true
      document.body.appendChild(script)
    } else {
      // Re-process embeds if script already loaded
      if (typeof (window as any).tiktokEmbed !== 'undefined') {
        ;(window as any).tiktokEmbed?.lib?.render()
      }
    }
  }, [url, isEditing])

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('TikTok Video URL')}</label>
          <input
            type="url"
            value={url}
            onChange={(e) => onUpdate?.({ ...block.data, url: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="https://www.tiktok.com/@username/video/..."
          />
          <p className="mt-1 text-xs text-gray-500">
            {t('Paste a TikTok video URL')}
          </p>
        </div>
      </div>
    )
  }

  const videoId = extractTikTokVideoId(url)

  if (!videoId) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <p className="text-sm text-gray-500">{t('Enter a valid TikTok video URL')}</p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="flex justify-center overflow-hidden rounded-lg">
      <blockquote
        className="tiktok-embed"
        cite={url}
        data-video-id={videoId}
        style={{ maxWidth: '605px', minWidth: '325px' }}
      >
        <section>
          <a href={url} target="_blank" rel="noopener noreferrer">
            {t('View on TikTok')}
          </a>
        </section>
      </blockquote>
    </div>
  )
}
