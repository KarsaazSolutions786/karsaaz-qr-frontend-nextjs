import type { DividerBlockData } from '@/types/entities/biolink'

interface DividerBlockProps {
  block: DividerBlockData
  isEditing?: boolean
  onUpdate?: (data: DividerBlockData['data']) => void
}

export default function DividerBlock({ block, isEditing, onUpdate }: DividerBlockProps) {
  const { style = 'solid', color = '#e5e7eb' } = block.data

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Style</label>
            <select
              value={style}
              onChange={(e) =>
                onUpdate?.({ ...block.data, style: e.target.value as 'solid' | 'dashed' | 'dotted' })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => onUpdate?.({ ...block.data, color: e.target.value })}
              className="mt-1 block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <hr
      style={{
        borderTop: `2px ${style} ${color}`,
        borderBottom: 'none',
        borderLeft: 'none',
        borderRight: 'none',
      }}
    />
  )
}
