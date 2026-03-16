'use client'

import { useTranslation } from '@/lib/i18n'
import type { SpotifyBlockData } from '@/types/entities/biolink'

interface SpotifyBlockProps {
  block: SpotifyBlockData
  isEditing?: boolean
  onUpdate?: (data: SpotifyBlockData['data']) => void
}

/**
 * Extracts Spotify embed URI from various URL formats:
 * - https://open.spotify.com/track/6rqhFgbbKwnb9MLmUQDhG6
 * - https://open.spotify.com/album/1DFixLWuPkv3KT3TnV35m3
 * - https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
 * - https://open.spotify.com/episode/...
 * - https://open.spotify.com/show/...
 */
function extractSpotifyEmbedPath(url: string): string | null {
  const match = url.match(
    /open\.spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/
  )
  if (match) {
    return `${match[1]}/${match[2]}`
  }
  return null
}

export default function SpotifyBlock({ block, isEditing, onUpdate }: SpotifyBlockProps) {
  const { url, theme = 'light', compact = false } = block.data
  const { t } = useTranslation()

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Spotify URL')}</label>
          <input
            type="url"
            value={url}
            onChange={(e) => onUpdate?.({ ...block.data, url: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="https://open.spotify.com/track/..."
          />
          <p className="mt-1 text-xs text-gray-500">
            {t('Supports tracks, albums, playlists, episodes, and shows')}
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
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`spotify-compact-${block.id}`}
            checked={compact}
            onChange={(e) => onUpdate?.({ ...block.data, compact: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor={`spotify-compact-${block.id}`} className="text-sm font-medium text-gray-700">
            {t('Compact view')}
          </label>
        </div>
      </div>
    )
  }

  const embedPath = extractSpotifyEmbedPath(url)

  if (!embedPath) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <p className="text-sm text-gray-500">{t('Enter a valid Spotify URL')}</p>
      </div>
    )
  }

  const height = compact ? 152 : 352
  const themeParam = theme === 'dark' ? '&theme=0' : ''
  const embedUrl = `https://open.spotify.com/embed/${embedPath}?utm_source=generator${themeParam}`

  return (
    <div className="overflow-hidden rounded-xl">
      <iframe
        src={embedUrl}
        width="100%"
        height={height}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        style={{ border: 'none', borderRadius: '12px' }}
        title="Spotify embed"
      />
    </div>
  )
}
