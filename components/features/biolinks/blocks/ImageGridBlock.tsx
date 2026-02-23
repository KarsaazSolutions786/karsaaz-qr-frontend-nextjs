'use client'

import { useState } from 'react'
import type { ImageGridBlockData } from '@/types/entities/biolink'

interface ImageGridBlockProps {
  block: ImageGridBlockData
  isEditing?: boolean
  onUpdate?: (data: ImageGridBlockData['data']) => void
}

export default function ImageGridBlock({ block, isEditing, onUpdate }: ImageGridBlockProps) {
  const { title, items, gridGap = 8, columns = 3, lightbox = false } = block.data
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (isEditing) {
    const addItem = () => {
      onUpdate?.({ ...block.data, items: [...items, { url: '', alt: '' }] })
    }

    const removeItem = (index: number) => {
      onUpdate?.({ ...block.data, items: items.filter((_, i) => i !== index) })
    }

    const updateItem = (index: number, field: string, value: string) => {
      const newItems = items.map((item, i) =>
        i === index ? { url: item.url, alt: item.alt, link: item.link, [field]: value } : item
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
            onChange={e => onUpdate?.({ ...block.data, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Columns</label>
            <select
              value={columns}
              onChange={e =>
                onUpdate?.({ ...block.data, columns: parseInt(e.target.value) as 2 | 3 | 4 })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value={2}>2 Columns</option>
              <option value={3}>3 Columns</option>
              <option value={4}>4 Columns</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Grid Gap (px)</label>
            <input
              type="number"
              value={gridGap}
              onChange={e => onUpdate?.({ ...block.data, gridGap: parseInt(e.target.value) || 8 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`lightbox-${block.id}`}
            checked={lightbox}
            onChange={e => onUpdate?.({ ...block.data, lightbox: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor={`lightbox-${block.id}`} className="text-sm font-medium text-gray-700">
            Enable Lightbox
          </label>
        </div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">Images</label>
          <button
            type="button"
            onClick={addItem}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + Add Image
          </button>
        </div>
        {items.map((item, index) => (
          <div key={index} className="space-y-1 rounded border border-gray-100 p-2">
            <div className="flex gap-2">
              <input
                type="url"
                value={item.url}
                onChange={e => updateItem(index, 'url', e.target.value)}
                placeholder="Image URL"
                className="block flex-1 rounded-md border-gray-300 text-sm shadow-sm"
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-red-600 hover:text-red-700"
              >
                ✕
              </button>
            </div>
            <input
              type="text"
              value={item.alt || ''}
              onChange={e => updateItem(index, 'alt', e.target.value)}
              placeholder="Alt text (optional)"
              className="block w-full rounded-md border-gray-300 text-sm shadow-sm"
            />
            <input
              type="url"
              value={item.link || ''}
              onChange={e => updateItem(index, 'link', e.target.value)}
              placeholder="Link URL (optional)"
              className="block w-full rounded-md border-gray-300 text-sm shadow-sm"
            />
          </div>
        ))}
      </div>
    )
  }

  if (items.length === 0) return null

  const colClass =
    columns === 2
      ? 'grid-cols-2'
      : columns === 4
        ? 'grid-cols-2 sm:grid-cols-4'
        : 'grid-cols-2 sm:grid-cols-3'

  return (
    <div>
      {title && <h3 className="mb-3 text-center text-lg font-semibold text-gray-900">{title}</h3>}
      <div className={`grid ${colClass}`} style={{ gap: `${gridGap}px` }}>
        {items.map((item, index) => {
          const img = (
            <img
              src={item.url}
              alt={item.alt || ''}
              className="h-full w-full rounded-lg object-cover cursor-pointer"
              style={{ aspectRatio: '1' }}
              onClick={lightbox ? () => setLightboxIndex(index) : undefined}
            />
          )
          return item.link && !lightbox ? (
            <a key={index} href={item.link} target="_blank" rel="noopener noreferrer">
              {img}
            </a>
          ) : (
            <div key={index}>{img}</div>
          )
        })}
      </div>
      {lightbox && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setLightboxIndex(null)}
        >
          <img
            src={items[lightboxIndex]?.url}
            alt={items[lightboxIndex]?.alt || ''}
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
          />
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute right-4 top-4 text-3xl text-white hover:text-gray-300"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
