import type { TitleBlockData } from '@/types/entities/biolink'

interface TitleBlockProps {
  block: TitleBlockData
  isEditing?: boolean
  onUpdate?: (data: TitleBlockData['data']) => void
}

export default function TitleBlock({ block, isEditing, onUpdate }: TitleBlockProps) {
  const { text, level = 'h2', align = 'center' } = block.data

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Text</label>
          <input
            type="text"
            value={text}
            onChange={(e) => onUpdate?.({ ...block.data, text: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Level</label>
            <select
              value={level}
              onChange={(e) =>
                onUpdate?.({ ...block.data, level: e.target.value as 'h1' | 'h2' | 'h3' })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="h1">H1</option>
              <option value="h2">H2</option>
              <option value="h3">H3</option>
            </select>
          </div>
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
        </div>
      </div>
    )
  }

  const levelClasses = {
    h1: 'text-4xl font-bold',
    h2: 'text-3xl font-bold',
    h3: 'text-2xl font-semibold',
  }

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  const Tag = level

  return <Tag className={`${levelClasses[level]} ${alignClasses[align]} text-gray-900`}>{text}</Tag>
}
