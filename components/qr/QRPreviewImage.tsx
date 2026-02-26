'use client'

import { useState, useEffect, useRef } from 'react'
import apiClient from '@/lib/api/client'

/**
 * QRPreviewImage — fetches QR SVG via authenticated API (avoiding ORB),
 * decodes base64 content, creates a blob URL and renders it.
 * Mirrors P1's qrcg-qrcode-image-manager approach.
 */

// Module-level cache: svgUrl → blob URL
const blobCache = new Map<string, string>()
const MAX_CACHE = 100

interface QRPreviewImageProps {
  svgUrl?: string | null
  fallbackUrl?: string | null
  alt?: string
  size?: number
  className?: string
}

export function QRPreviewImage({
  svgUrl,
  fallbackUrl,
  alt = 'QR Code',
  size = 120,
  className = '',
}: QRPreviewImageProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const mountedRef = useRef(true)
  const fetchedUrlRef = useRef<string | null>(null)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!svgUrl) {
      setError(true)
      return
    }

    // Already cached
    if (blobCache.has(svgUrl)) {
      setBlobUrl(blobCache.get(svgUrl)!)
      return
    }

    // Already fetched this URL
    if (fetchedUrlRef.current === svgUrl) return
    fetchedUrlRef.current = svgUrl

    // Fetch immediately — pagination limits items per page so no perf concern
    fetchSvg(svgUrl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svgUrl])

  async function fetchSvg(url: string) {
    setLoading(true)
    setError(false)

    try {
      const response = await apiClient.get(url)
      const data = response.data
      const contentType = response.headers?.['content-type'] || ''

      let svgString: string

      if (typeof data === 'object' && data?.content) {
        // JSON response: { content: "base64_svg" }
        svgString = atob(data.content)
      } else if (typeof data === 'string' && (contentType.includes('svg') || data.trim().startsWith('<'))) {
        // Raw SVG string response
        svgString = data
      } else {
        throw new Error('Unexpected SVG response format')
      }

      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
      const objectUrl = URL.createObjectURL(blob)

      // Cache with eviction
      blobCache.set(url, objectUrl)
      if (blobCache.size > MAX_CACHE) {
        const firstKey = blobCache.keys().next().value
        if (firstKey) {
          URL.revokeObjectURL(blobCache.get(firstKey)!)
          blobCache.delete(firstKey)
        }
      }

      if (mountedRef.current) {
        setBlobUrl(objectUrl)
      }
    } catch {
      if (mountedRef.current) {
        setError(true)
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }

  // Show placeholder on error or no URL
  if (error && !fallbackUrl) {
    return (
      <div
        className={`bg-gray-100 rounded-md flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <svg
          className="w-2/3 h-2/3 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5z"
          />
        </svg>
      </div>
    )
  }

  // Use fallback image URL if SVG fetch failed
  if (error && fallbackUrl) {
    return (
      <img
        src={fallbackUrl}
        alt={alt}
        width={size}
        height={size}
        className={`rounded-md object-contain ${className}`}
        onError={(e) => {
          ;(e.target as HTMLImageElement).style.display = 'none'
        }}
      />
    )
  }

  // Loading state
  if (loading || !blobUrl) {
    return (
      <div
        className={`bg-gray-50 rounded-md flex items-center justify-center animate-pulse ${className}`}
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <img
      src={blobUrl}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-md object-contain ${className}`}
      onError={() => setError(true)}
    />
  )
}
