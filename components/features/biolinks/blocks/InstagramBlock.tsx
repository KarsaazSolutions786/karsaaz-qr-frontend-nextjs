'use client'

import { useEffect, useRef } from 'react'
import { useTranslation } from '@/lib/i18n'
import type { InstagramBlockData } from '@/types/entities/biolink'

interface InstagramBlockProps {
  block: InstagramBlockData
  isEditing?: boolean
  onUpdate?: (data: InstagramBlockData['data']) => void
}

/**
 * Purpose: Validates and normalizes an Instagram URL. Supports: - https://www.instagram.com/p/XXXX/ - https://www.instagram.com/reel/XXXX/ - https://www.instagram.com/tv/XXXX/
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

function isValidInstagramUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[\w-]+/.test(url)
}

/**
 * Purpose: Retrieves instagramembedurl.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function getInstagramEmbedUrl(url: string): string {
  // Ensure URL ends with a slash before adding embed
  const cleanUrl = url.replace(/\/?$/, '/')
  return `${cleanUrl}embed`
}

/**
 * Purpose: Executes InstagramBlock functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export default function InstagramBlock({ block, isEditing, onUpdate }: InstagramBlockProps) {
  const { t } = useTranslation();
  const { url } = block.data
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (isEditing || !url || !isValidInstagramUrl(url)) return

    // Load Instagram embed script for proper rendering
    const existingScript = document.querySelector(
      'script[src="https://www.instagram.com/embed.js"]'
    )

    if (!existingScript) {
      const script = document.createElement('script')
      script.src = 'https://www.instagram.com/embed.js'
      script.async = true
      document.body.appendChild(script)
    } else {
      // Re-process embeds
      if (typeof (window as any).instgrm !== 'undefined') {
        ;(window as any).instgrm?.Embeds?.process()
      }
    }
  }, [url, isEditing])

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Instagram Post URL')}</label>
          <input
            type="url"
            value={url}
            onChange={(e) => onUpdate?.({ ...block.data, url: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="https://www.instagram.com/p/..."
          />
          <p className="mt-1 text-xs text-gray-500">
            {t('Supports posts, reels, and IGTV links')}
          </p>
        </div>
      </div>
    )
  }

  if (!url || !isValidInstagramUrl(url)) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <p className="text-sm text-gray-500">{t('Enter a valid Instagram post URL')}</p>
      </div>
    )
  }

  const embedUrl = getInstagramEmbedUrl(url)

  return (
    <div className="flex justify-center overflow-hidden rounded-lg">
      <iframe
        ref={iframeRef}
        src={embedUrl}
        width="400"
        height="480"
        frameBorder="0"
        scrolling="no"
        allowTransparency
        allow="encrypted-media"
        className="max-w-full"
        style={{ border: 'none', overflow: 'hidden' }}
        title="Instagram embed"
      />
    </div>
  )
}
