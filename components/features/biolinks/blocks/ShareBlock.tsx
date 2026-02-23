'use client'

import { useState } from 'react'
import type { ShareBlockData } from '@/types/entities/biolink'

interface ShareBlockProps {
  block: ShareBlockData
  isEditing?: boolean
  onUpdate?: (data: ShareBlockData['data']) => void
}

const shareChannels = [
  {
    name: 'WhatsApp',
    icon: '💬',
    getUrl: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  {
    name: 'Facebook',
    icon: '📘',
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: 'X',
    icon: '🐦',
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    name: 'Email',
    icon: '✉️',
    getUrl: (url: string, title: string) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
  },
]

export default function ShareBlock({ block, isEditing, onUpdate }: ShareBlockProps) {
  const { url, title = '' } = block.data
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">URL to Share</label>
          <input
            type="url"
            value={url}
            onChange={e => onUpdate?.({ ...block.data, url: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="https://example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Title (optional)</label>
          <input
            type="text"
            value={title}
            onChange={e => onUpdate?.({ ...block.data, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
    )
  }

  if (!url) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <p className="text-sm text-gray-500">No URL set for sharing</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-center text-sm font-medium text-gray-700">Share</p>
      <div className="flex items-center justify-center gap-2">
        {shareChannels.map(channel => (
          <a
            key={channel.name}
            href={channel.getUrl(url, title)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-lg transition-colors hover:bg-gray-50"
            title={channel.name}
          >
            {channel.icon}
          </a>
        ))}
        <button
          onClick={handleCopyLink}
          className={`flex h-10 w-10 items-center justify-center rounded-full border text-lg transition-colors ${
            copied ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white hover:bg-gray-50'
          }`}
          title="Copy Link"
        >
          {copied ? '✓' : '🔗'}
        </button>
      </div>
    </div>
  )
}
