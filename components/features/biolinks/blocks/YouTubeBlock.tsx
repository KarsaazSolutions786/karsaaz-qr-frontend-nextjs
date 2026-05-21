'use client'

import { useTranslation } from '@/lib/i18n'
import type { YouTubeBlockData } from '@/types/entities/biolink'

interface YouTubeBlockProps {
  block: YouTubeBlockData
  isEditing?: boolean
  onUpdate?: (data: YouTubeBlockData['data']) => void
}

/**
 * Purpose: Executes extractYouTubeId functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
    /(?:youtu\.be\/)([^?\s]+)/,
    /(?:youtube\.com\/embed\/)([^?\s]+)/,
    /(?:youtube\.com\/shorts\/)([^?\s]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match?.[1]) return match[1]
  }

  return null
}

/**
 * Purpose: Executes YouTubeBlock functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export default function YouTubeBlock({ block, isEditing, onUpdate }: YouTubeBlockProps) {
  const { url, autoplay = false, startTime = 0 } = block.data
  const { t } = useTranslation()

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('YouTube URL')}</label>
          <input
            type="url"
            value={url}
            onChange={(e) => onUpdate?.({ ...block.data, url: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <p className="mt-1 text-xs text-gray-500">
            {t('Supports youtube.com/watch, youtu.be, and shorts URLs')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`yt-autoplay-${block.id}`}
              checked={autoplay}
              onChange={(e) => onUpdate?.({ ...block.data, autoplay: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={`yt-autoplay-${block.id}`} className="text-sm font-medium text-gray-700">
              {t('Autoplay')}
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Start Time (seconds)')}</label>
          <input
            type="number"
            min={0}
            value={startTime}
            onChange={(e) => onUpdate?.({ ...block.data, startTime: parseInt(e.target.value) || 0 })}
            className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
    )
  }

  const videoId = extractYouTubeId(url)

  if (!videoId) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <p className="text-sm text-gray-500">{t('Enter a valid YouTube URL')}</p>
      </div>
    )
  }

  const params = new URLSearchParams()
  if (autoplay) params.set('autoplay', '1')
  if (startTime > 0) params.set('start', String(startTime))
  params.set('rel', '0')

  const embedUrl = `https://www.youtube.com/embed/${videoId}?${params.toString()}`

  return (
    <div className="overflow-hidden rounded-lg">
      <div className="relative" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={embedUrl}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video"
        />
      </div>
    </div>
  )
}
