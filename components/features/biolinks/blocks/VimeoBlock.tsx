'use client'

import { useTranslation } from '@/lib/i18n'
import type { VimeoBlockData } from '@/types/entities/biolink'

interface VimeoBlockProps {
  block: VimeoBlockData
  isEditing?: boolean
  onUpdate?: (data: VimeoBlockData['data']) => void
}

function extractVimeoId(url: string): string | null {
  const patterns = [
    /vimeo\.com\/(\d+)/,
    /vimeo\.com\/video\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match?.[1]) return match[1]
  }

  return null
}

export default function VimeoBlock({ block, isEditing, onUpdate }: VimeoBlockProps) {
  const { url, autoplay = false, loop = false } = block.data
  const { t } = useTranslation()

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Vimeo URL')}</label>
          <input
            type="url"
            value={url}
            onChange={(e) => onUpdate?.({ ...block.data, url: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="https://vimeo.com/123456789"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`vimeo-autoplay-${block.id}`}
              checked={autoplay}
              onChange={(e) => onUpdate?.({ ...block.data, autoplay: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={`vimeo-autoplay-${block.id}`} className="text-sm font-medium text-gray-700">
              {t('Autoplay')}
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`vimeo-loop-${block.id}`}
              checked={loop}
              onChange={(e) => onUpdate?.({ ...block.data, loop: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={`vimeo-loop-${block.id}`} className="text-sm font-medium text-gray-700">
              {t('Loop')}
            </label>
          </div>
        </div>
      </div>
    )
  }

  const videoId = extractVimeoId(url)

  if (!videoId) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <p className="text-sm text-gray-500">{t('Enter a valid Vimeo URL')}</p>
      </div>
    )
  }

  const params = new URLSearchParams()
  if (autoplay) params.set('autoplay', '1')
  if (loop) params.set('loop', '1')

  const embedUrl = `https://player.vimeo.com/video/${videoId}?${params.toString()}`

  return (
    <div className="overflow-hidden rounded-lg">
      <div className="relative" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={embedUrl}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="Vimeo video"
        />
      </div>
    </div>
  )
}
