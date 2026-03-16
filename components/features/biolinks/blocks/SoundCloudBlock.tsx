'use client'

import { useTranslation } from '@/lib/i18n'
import type { SoundCloudBlockData } from '@/types/entities/biolink'

interface SoundCloudBlockProps {
  block: SoundCloudBlockData
  isEditing?: boolean
  onUpdate?: (data: SoundCloudBlockData['data']) => void
}

function isValidSoundCloudUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?soundcloud\.com\/.+/.test(url)
}

export default function SoundCloudBlock({ block, isEditing, onUpdate }: SoundCloudBlockProps) {
  const { url, color = '#ff5500', autoplay = false } = block.data
  const { t } = useTranslation()

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('SoundCloud URL')}</label>
          <input
            type="url"
            value={url}
            onChange={(e) => onUpdate?.({ ...block.data, url: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="https://soundcloud.com/artist/track-name"
          />
          <p className="mt-1 text-xs text-gray-500">
            {t('Supports tracks, playlists, and artist profiles')}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Accent Color')}</label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => onUpdate?.({ ...block.data, color: e.target.value })}
              className="h-8 w-8 cursor-pointer rounded border border-gray-300"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => onUpdate?.({ ...block.data, color: e.target.value })}
              className="block w-28 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`sc-autoplay-${block.id}`}
            checked={autoplay}
            onChange={(e) => onUpdate?.({ ...block.data, autoplay: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor={`sc-autoplay-${block.id}`} className="text-sm font-medium text-gray-700">
            {t('Autoplay')}
          </label>
        </div>
      </div>
    )
  }

  if (!url || !isValidSoundCloudUrl(url)) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <p className="text-sm text-gray-500">{t('Enter a valid SoundCloud URL')}</p>
      </div>
    )
  }

  const cleanColor = color.replace('#', '')
  const params = new URLSearchParams({
    url,
    color: cleanColor,
    auto_play: autoplay ? 'true' : 'false',
    hide_related: 'true',
    show_comments: 'false',
    show_user: 'true',
    show_reposts: 'false',
    show_teaser: 'false',
    visual: 'true',
  })

  const embedUrl = `https://w.soundcloud.com/player/?${params.toString()}`

  return (
    <div className="overflow-hidden rounded-lg">
      <iframe
        width="100%"
        height={166}
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={embedUrl}
        title="SoundCloud embed"
      />
    </div>
  )
}
