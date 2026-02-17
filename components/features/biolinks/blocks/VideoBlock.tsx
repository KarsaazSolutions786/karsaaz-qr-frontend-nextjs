import type { VideoBlockData } from '@/types/entities/biolink'

interface VideoBlockProps {
  block: VideoBlockData
  isEditing?: boolean
  onUpdate?: (data: VideoBlockData['data']) => void
}

function getVideoEmbedUrl(url: string): string | null {
  // YouTube
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/
  const youtubeMatch = url.match(youtubeRegex)
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  }

  // Vimeo
  const vimeoRegex = /vimeo\.com\/(\d+)/
  const vimeoMatch = url.match(vimeoRegex)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }

  return null
}

export default function VideoBlock({ block, isEditing, onUpdate }: VideoBlockProps) {
  const { url, title } = block.data

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Video URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => onUpdate?.({ ...block.data, url: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="YouTube or Vimeo URL"
          />
          <p className="mt-1 text-xs text-gray-500">
            Supports YouTube and Vimeo links
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Title (optional)</label>
          <input
            type="text"
            value={title || ''}
            onChange={(e) => onUpdate?.({ ...block.data, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
    )
  }

  const embedUrl = getVideoEmbedUrl(url)

  if (!embedUrl) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <p className="text-sm text-gray-500">Invalid video URL</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {title && <h3 className="text-center text-lg font-semibold text-gray-900">{title}</h3>}
      <div className="relative overflow-hidden rounded-lg" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={embedUrl}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}
