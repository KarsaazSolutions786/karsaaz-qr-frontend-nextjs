import type { ListBlockData } from '@/types/entities/biolink'

interface ListBlockProps {
  block: ListBlockData
  isEditing?: boolean
  onUpdate?: (data: ListBlockData['data']) => void
}

export default function ListBlock({ block, isEditing, onUpdate }: ListBlockProps) {
  const { title, items } = block.data

  if (isEditing) {
    const addItem = () => {
      onUpdate?.({ ...block.data, items: [...items, { text: '', icon: '•' }] })
    }

    const removeItem = (index: number) => {
      onUpdate?.({ ...block.data, items: items.filter((_, i) => i !== index) })
    }

    const updateItem = (index: number, field: 'text' | 'icon', value: string) => {
      const newItems = items.map((item, i) =>
        i === index ? { text: item.text, icon: item.icon, [field]: value } : item
      )
      onUpdate?.({ ...block.data, items: newItems })
    }

    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title (optional)</label>
          <input
            type="text"
            value={title || ''}
            onChange={(e) => onUpdate?.({ ...block.data, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">Items</label>
          <button type="button" onClick={addItem} className="text-sm text-blue-600 hover:text-blue-700">
            + Add Item
          </button>
        </div>
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={item.icon || ''}
              onChange={(e) => updateItem(index, 'icon', e.target.value)}
              className="block w-12 rounded-md border-gray-300 text-center text-sm shadow-sm"
              placeholder="•"
            />
            <input
              type="text"
              value={item.text}
              onChange={(e) => updateItem(index, 'text', e.target.value)}
              className="block flex-1 rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="List item"
            />
            <button type="button" onClick={() => removeItem(index)} className="text-red-600 hover:text-red-700">
              ✕
            </button>
          </div>
        ))}
      </div>
    )
  }

  if (items.length === 0) return null

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      {title && <h3 className="mb-3 text-lg font-semibold text-gray-900">{title}</h3>}
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="mt-0.5 flex-shrink-0">{item.icon || '•'}</span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
