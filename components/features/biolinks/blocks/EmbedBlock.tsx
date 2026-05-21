'use client'

import { useTranslation } from '@/lib/i18n'
import type { EmbedBlockData } from '@/types/entities/biolink'

interface EmbedBlockProps {
  block: EmbedBlockData
  isEditing?: boolean
  onUpdate?: (data: EmbedBlockData['data']) => void
}

/**
 * Purpose: Executes EmbedBlock functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function EmbedBlock({ block, isEditing, onUpdate }: EmbedBlockProps) {
  const { embedCode, height = 400 } = block.data
  const { t } = useTranslation()

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Embed Code / URL')}</label>
          <textarea
            value={embedCode}
            onChange={(e) => onUpdate?.({ ...block.data, embedCode: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono text-xs"
            placeholder="<iframe src=&quot;...&quot;></iframe> or https://..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Height (px)')}</label>
          <input
            type="number"
            value={height}
            onChange={(e) => onUpdate?.({ ...block.data, height: parseInt(e.target.value) || 400 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
    )
  }

  if (!embedCode) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <p className="text-sm text-gray-500">{t('No embed content')}</p>
      </div>
    )
  }

  // If it looks like a URL, render as iframe.
  // Security: allow-same-origin is removed to prevent the embedded content
  // from accessing the parent page's cookies, localStorage, and DOM.
  if (embedCode.startsWith('http')) {
    return (
      <div className="overflow-hidden rounded-lg">
        <iframe
          src={embedCode}
          style={{ width: '100%', height: `${height}px`, border: 'none' }}
          title="Embedded content"
          sandbox="allow-scripts allow-popups"
        />
      </div>
    )
  }

  // Otherwise render as sandboxed iframe for embed code.
  // Security: allow-same-origin is removed — srcDoc with allow-scripts +
  // allow-same-origin defeats the sandbox entirely per the HTML spec.
  return (
    <div className="overflow-hidden rounded-lg" style={{ height: `${height}px` }}>
      <iframe
        sandbox="allow-scripts allow-popups"
        srcDoc={embedCode}
        className="w-full h-full"
        style={{ border: 'none' }}
        title="Embedded content"
      />
    </div>
  )
}
