import type { LocationBlockData } from '@/types/entities/biolink'

interface LocationBlockProps {
  block: LocationBlockData
  isEditing?: boolean
  onUpdate?: (data: LocationBlockData['data']) => void
}

export default function LocationBlock({ block, isEditing, onUpdate }: LocationBlockProps) {
  const { address, mapUrl } = block.data

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            value={address}
            onChange={(e) => onUpdate?.({ ...block.data, address: e.target.value })}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Map URL (optional)</label>
          <input
            type="url"
            value={mapUrl || ''}
            onChange={(e) => onUpdate?.({ ...block.data, mapUrl: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="https://maps.google.com/..."
          />
        </div>
      </div>
    )
  }

  const googleMapsUrl = mapUrl || `https://maps.google.com/?q=${encodeURIComponent(address)}`

  return (
    <a
      href={googleMapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-blue-500"
    >
      <span className="text-2xl">📍</span>
      <span className="text-sm text-gray-700">{address}</span>
    </a>
  )
}
