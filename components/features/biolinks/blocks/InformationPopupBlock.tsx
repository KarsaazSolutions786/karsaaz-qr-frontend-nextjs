'use client'

import { useState } from 'react'
import type { InformationPopupBlockData } from '@/types/entities/biolink'

interface InformationPopupBlockProps {
  block: InformationPopupBlockData
  isEditing?: boolean
  onUpdate?: (data: InformationPopupBlockData['data']) => void
}

export default function InformationPopupBlock({
  block,
  isEditing,
  onUpdate,
}: InformationPopupBlockProps) {
  const { triggerText, title, content } = block.data
  const [open, setOpen] = useState(false)

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Trigger Text</label>
          <input
            type="text"
            value={triggerText}
            onChange={e => onUpdate?.({ ...block.data, triggerText: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Click for more info"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Popup Title</label>
          <input
            type="text"
            value={title}
            onChange={e => onUpdate?.({ ...block.data, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            value={content}
            onChange={e => onUpdate?.({ ...block.data, content: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="relative inline-block w-full">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        <span>ℹ️</span>
        {triggerText || 'More Info'}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-1/2 z-50 mt-2 w-72 -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
            {title && <h4 className="mb-2 font-semibold text-gray-900">{title}</h4>}
            <p className="text-sm text-gray-600">{content}</p>
            <button
              onClick={() => setOpen(false)}
              className="mt-3 text-xs text-gray-400 hover:text-gray-600"
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  )
}
