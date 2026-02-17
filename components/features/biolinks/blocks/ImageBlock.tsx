import type { ImageBlockData } from '@/types/entities/biolink'

interface ImageBlockProps {
  block: ImageBlockData
  isEditing?: boolean
  onUpdate?: (data: ImageBlockData['data']) => void
}

export default function ImageBlock({ block, isEditing, onUpdate }: ImageBlockProps) {
  const { url, alt = '', link, caption } = block.data

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => onUpdate?.({ ...block.data, url: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Alt Text</label>
          <input
            type="text"
            value={alt}
            onChange={(e) => onUpdate?.({ ...block.data, alt: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Link (optional)</label>
          <input
            type="url"
            value={link || ''}
            onChange={(e) => onUpdate?.({ ...block.data, link: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Caption (optional)</label>
          <input
            type="text"
            value={caption || ''}
            onChange={(e) => onUpdate?.({ ...block.data, caption: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
    )
  }

  if (!url) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <p className="text-sm text-gray-500">No image set</p>
      </div>
    )
  }

  const imageElement = (
    <img
      src={url}
      alt={alt}
      className="mx-auto rounded-lg object-cover"
      style={{ maxHeight: '400px' }}
    />
  )

  return (
    <div className="space-y-2">
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className="block">
          {imageElement}
        </a>
      ) : (
        imageElement
      )}
      {caption && <p className="text-center text-sm text-gray-600">{caption}</p>}
    </div>
  )
}
