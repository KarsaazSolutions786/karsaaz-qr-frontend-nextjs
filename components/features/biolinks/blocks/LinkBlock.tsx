import type { LinkBlockData } from '@/types/entities/biolink'

interface LinkBlockProps {
  block: LinkBlockData
  isEditing?: boolean
  onUpdate?: (data: LinkBlockData['data']) => void
}

export default function LinkBlock({ block, isEditing, onUpdate }: LinkBlockProps) {
  const { url, title, style = 'button' } = block.data

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => onUpdate?.({ ...block.data, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => onUpdate?.({ ...block.data, url: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Style</label>
          <select
            value={style}
            onChange={(e) =>
              onUpdate?.({ ...block.data, style: e.target.value as 'button' | 'card' | 'minimal' })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="button">Button</option>
            <option value="card">Card</option>
            <option value="minimal">Minimal</option>
          </select>
        </div>
      </div>
    )
  }

  const baseClasses = 'block w-full text-center transition-colors'
  const styleClasses = {
    button: 'rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700',
    card: 'rounded-lg border-2 border-gray-200 bg-white px-6 py-4 text-gray-900 hover:border-blue-500',
    minimal: 'py-2 text-blue-600 hover:text-blue-700 underline',
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} ${styleClasses[style]}`}
    >
      {title}
    </a>
  )
}
