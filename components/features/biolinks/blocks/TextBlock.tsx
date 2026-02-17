import type { TextBlockData } from '@/types/entities/biolink'

interface TextBlockProps {
  block: TextBlockData
  isEditing?: boolean
  onUpdate?: (data: TextBlockData['data']) => void
}

export default function TextBlock({ block, isEditing, onUpdate }: TextBlockProps) {
  const { content, align = 'center', size = 'md' } = block.data

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            value={content}
            onChange={(e) => onUpdate?.({ ...block.data, content: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Alignment</label>
            <select
              value={align}
              onChange={(e) =>
                onUpdate?.({ ...block.data, align: e.target.value as 'left' | 'center' | 'right' })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Size</label>
            <select
              value={size}
              onChange={(e) =>
                onUpdate?.({ ...block.data, size: e.target.value as 'sm' | 'md' | 'lg' })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>
        </div>
      </div>
    )
  }

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <p className={`${sizeClasses[size]} ${alignClasses[align]} text-gray-700 whitespace-pre-wrap`}>
      {content}
    </p>
  )
}
