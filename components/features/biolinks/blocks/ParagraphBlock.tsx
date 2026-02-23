'use client'

import type { ParagraphBlockData } from '@/types/entities/biolink'

interface ParagraphBlockProps {
  block: ParagraphBlockData
  isEditing?: boolean
  onUpdate?: (data: ParagraphBlockData['data']) => void
}

export default function ParagraphBlock({ block, isEditing, onUpdate }: ParagraphBlockProps) {
  const { content } = block.data

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Content (HTML)</label>
          <textarea
            value={content}
            onChange={e => onUpdate?.({ ...block.data, content: e.target.value })}
            rows={6}
            className="mt-1 block w-full rounded-md border-gray-300 font-mono text-xs shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="<p>Your rich text content here. Supports <strong>bold</strong>, <em>italic</em>, and more.</p>"
          />
          <p className="mt-1 text-xs text-gray-500">Supports HTML formatting tags.</p>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <p className="text-sm text-gray-500">No content set</p>
      </div>
    )
  }

  return (
    <div
      className="prose prose-sm max-w-none text-gray-700"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
