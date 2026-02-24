/**
 * BackendQRPreview
 *
 * Fetches the QR code preview SVG from the backend API — identical to how
 * the legacy Lit frontend's <qrcg-qrcode-image> component works.
 *
 * The backend has the real rendering engine with all shape, gradient, sticker,
 * and AI options. This component sends the full DesignerConfig (transformed to
 * backend format) and displays the returned SVG.
 */

'use client'

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react'
import apiClient from '@/lib/api/client'
import { DesignerConfig, DEFAULT_DESIGNER_CONFIG } from '@/types/entities/designer'
import { transformDesignToBackend } from '@/lib/qr/design-transformer'
import { sanitizeSvg } from '@/lib/utils/dom-safety'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface BackendQRPreviewProps {
  /** Raw form data object — sent as JSON to backend (matching P1's this.data) */
  data: Record<string, any>
  /** QR code type key, e.g. 'url', 'vcard', 'wifi' */
  qrType?: string
  /** DesignerConfig from the wizard store */
  config?: Partial<DesignerConfig>
  /** Remote QR code ID (for saved QR codes) */
  qrId?: number | string
  /** Container className */
  className?: string
  /** Debounce delay in ms (default 500, matching legacy) */
  debounce?: number
}

export interface BackendQRPreviewRef {
  /** Get the raw SVG string currently displayed */
  getSVG: () => string | null
  /** Get the SVG as a data-URL */
  getDataURL: () => string | null
  /** Force refresh preview */
  refresh: () => void
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Fast 32-bit hash (same algorithm as legacy preview-url-builder) */
function hashCode(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // 32-bit
  }
  return Math.abs(hash).toString(36)
}

/** Simple in-memory SVG cache keyed by URL hash */
const svgCache = new Map<string, string>()
const MAX_CACHE = 80

function cacheGet(key: string): string | undefined {
  return svgCache.get(key)
}

function cacheSet(key: string, svg: string) {
  if (svgCache.size >= MAX_CACHE) {
    // evict oldest entry
    const firstKey = svgCache.keys().next().value
    if (firstKey !== undefined) svgCache.delete(firstKey)
  }
  svgCache.set(key, svg)
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const BackendQRPreview = forwardRef<BackendQRPreviewRef, BackendQRPreviewProps>(
  function BackendQRPreview(
    { data, qrType = 'url', config = {}, qrId, className = '', debounce = 500 },
    ref
  ) {
    const [svg, setSvg] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const abortRef = useRef<AbortController | null>(null)
    const mountedRef = useRef(true)

    // Merge config with defaults
    const mergedConfig: DesignerConfig = {
      ...DEFAULT_DESIGNER_CONFIG,
      ...config,
    }

    /* ---- build the same URL params the legacy Lit frontend uses ---- */
    const buildParams = useCallback((): URLSearchParams | null => {
      // P1 sends the raw form data object as JSON (e.g., {"text":"hello"})
      if (!data || Object.keys(data).length === 0) return null
      // Check at least one value is non-empty
      const hasValue = Object.values(data).some(v => v !== '' && v !== null && v !== undefined)
      if (!hasValue) return null

      const backendDesign = transformDesignToBackend(mergedConfig)

      const params = new URLSearchParams()
      params.set('data', JSON.stringify(data))
      params.set('type', qrType)
      params.set('design', JSON.stringify(backendDesign))
      params.set('renderText', 'false')
      if (qrId) params.set('id', String(qrId))

      // content-hash for caching (same as legacy)
      const h = hashCode(params.toString())
      params.set('h', h)

      return params
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(data), qrType, qrId, JSON.stringify(config)])

    /* ---- fetch SVG from backend ---- */
    const fetchPreview = useCallback(async () => {
      const params = buildParams()
      if (!params) {
        setSvg(null)
        setError(null)
        return
      }

      const cacheKey = params.get('h') || ''
      const cached = cacheGet(cacheKey)
      if (cached) {
        setSvg(cached)
        setError(null)
        setLoading(false)
        return
      }

      // Cancel any in-flight request
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setLoading(true)
      setError(null)

      try {
        // The legacy fetches: GET {APP_URL}/api/qrcodes/preview?{params}
        // apiClient already has baseURL = {API_URL}/api, so endpoint = /qrcodes/preview
        const res = await apiClient.get('/qrcodes/preview', {
          params: Object.fromEntries(params),
          signal: controller.signal,
          // The backend returns JSON { content: base64_svg } or raw SVG
          // Handle both response formats
          transformResponse: [(raw: string) => raw],
        })

        if (!mountedRef.current) return

        let svgString: string

        // Try parsing as JSON first (legacy backend returns {content: base64})
        try {
          const json = JSON.parse(res.data)
          if (json.content) {
            svgString = window.atob(json.content)
          } else {
            svgString = res.data
          }
        } catch {
          // Raw SVG response
          svgString = res.data as string
        }

        if (svgString && svgString.includes('<svg')) {
          cacheSet(cacheKey, svgString)
          setSvg(svgString)
          setError(null)
        } else {
          setError('Invalid SVG response')
        }
      } catch (err: any) {
        if (err?.name === 'AbortError' || err?.name === 'CanceledError') return
        if (!mountedRef.current) return
        setError('Preview failed')
        console.error('[BackendQRPreview]', err)
      } finally {
        if (mountedRef.current) setLoading(false)
      }
    }, [buildParams])

    /* ---- debounced effect ---- */
    useEffect(() => {
      if (timerRef.current) clearTimeout(timerRef.current)

      // first render: immediate; subsequent: debounced
      if (!svg && !error) {
        fetchPreview()
      } else {
        timerRef.current = setTimeout(fetchPreview, debounce)
      }

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchPreview, debounce])

    /* ---- cleanup on unmount ---- */
    useEffect(() => {
      mountedRef.current = true
      return () => {
        mountedRef.current = false
        abortRef.current?.abort()
      }
    }, [])

    /* ---- expose ref methods ---- */
    useImperativeHandle(
      ref,
      () => ({
        getSVG: () => svg,
        getDataURL: () => {
          if (!svg) return null
          const encoded = encodeURIComponent(svg).replace(/'/g, '%27').replace(/"/g, '%22')
          return `data:image/svg+xml,${encoded}`
        },
        refresh: () => fetchPreview(),
      }),
      [svg, fetchPreview]
    )

    /* ---- render ---- */

    if (error && !svg) {
      return (
        <div className={`qr-backend-preview ${className}`}>
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="text-yellow-500 text-3xl mb-2">⚠️</div>
            <p className="text-xs text-gray-500">{error}</p>
            <button
              onClick={() => fetchPreview()}
              className="mt-2 text-xs text-indigo-600 hover:underline"
            >
              Retry
            </button>
          </div>
        </div>
      )
    }

    if (!svg) {
      return (
        <div className={`qr-backend-preview ${className}`}>
          <div className="flex items-center justify-center p-8">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          </div>
        </div>
      )
    }

    return (
      <div className={`qr-backend-preview ${className}`}>
        <div
          className="qr-backend-preview__svg"
          dangerouslySetInnerHTML={{ __html: sanitizeSvg(svg ?? '') }}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-lg">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
          </div>
        )}
      </div>
    )
  }
)
