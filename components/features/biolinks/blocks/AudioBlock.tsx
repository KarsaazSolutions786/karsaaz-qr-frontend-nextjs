import type { AudioBlockData } from '@/types/entities/biolink'

interface AudioBlockProps {
  block: AudioBlockData
  isEditing?: boolean
  onUpdate?: (data: AudioBlockData['data']) => void
}

export default function AudioBlock({ block, isEditing, onUpdate }: AudioBlockProps) {
  const { audioUrl, title } = block.data

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Audio URL</label>
          <input
            type="url"
            value={audioUrl}
            onChange={(e) => onUpdate?.({ ...block.data, audioUrl: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="https://example.com/audio.mp3"
          />
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

  if (!audioUrl) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <p className="text-sm text-gray-500">No audio file set</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {title && <h3 className="text-center text-lg font-semibold text-gray-900">🎵 {title}</h3>}
      <audio controls className="w-full" preload="metadata">
        <source src={audioUrl} />
        Your browser does not support the audio element.
      </audio>
    </div>
  )
}
