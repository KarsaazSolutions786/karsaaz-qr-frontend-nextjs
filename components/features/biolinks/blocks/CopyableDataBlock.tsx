'use client'

import { useState } from 'react'
import type { CopyableDataBlockData } from '@/types/entities/biolink'

interface CopyableDataBlockProps {
  block: CopyableDataBlockData
  isEditing?: boolean
  onUpdate?: (data: CopyableDataBlockData['data']) => void
}

export default function CopyableDataBlock({ block, isEditing, onUpdate }: CopyableDataBlockProps) {
  const { label, value } = block.data
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = value
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Label</label>
          <input
            type="text"
            value={label}
            onChange={e => onUpdate?.({ ...block.data, label: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="e.g. API Key"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Value</label>
          <input
            type="text"
            value={value}
            onChange={e => onUpdate?.({ ...block.data, value: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Data to copy"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="flex-1 min-w-0">
        {label && (
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        )}
        <p className="truncate font-mono text-sm text-gray-900">{value}</p>
      </div>
      <button
        onClick={handleCopy}
        className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
          copied
            ? 'bg-green-100 text-green-700'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        {copied ? '✓ Copied' : '📋 Copy'}
      </button>
    </div>
  )
}
