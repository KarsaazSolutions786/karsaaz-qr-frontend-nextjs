/**
 * WebpagePreview
 *
 * Renders an iframe preview of the QR code's landing page inside a
 * browser-chrome frame — matching the legacy Lit frontend's
 * <qrcg-webpage-preview> component behaviour.
 *
 * Flow:
 *  1. Fetch GET /qrcodes/{id}/redirect → get { slug }
 *  2. Build URL: {NEXT_PUBLIC_API_URL}/s/{slug}?preview=true
 *  3. Render iframe inside a browser-chrome wrapper
 *
 * Expose refresh() via forwardRef so the parent (QRDesignStudio) can force
 * an iframe reload after the user saves changes to the QR code.
 */

'use client'

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { qrcodesAPI } from '@/lib/api/endpoints/qrcodes'
import { RefreshCw, ExternalLink } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { LottieLoader } from '@/components/ui/lottie-loader'

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export interface WebpagePreviewRef {
  /** Force the iframe to reload the landing page */
  refresh: () => void
}

interface WebpagePreviewProps {
  /** Saved QR code ID. When null, renders an empty-state prompt. */
  qrcodeId: string | null
  /** Additional className for the root element */
  className?: string
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export const WebpagePreview = forwardRef<WebpagePreviewRef, WebpagePreviewProps>(
  function WebpagePreview({ qrcodeId, className }, ref) {
    const { t } = useTranslation()
    const [slug, setSlug] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    // Bump this key to force an iframe remount (full reload) on refresh()
    const [refreshKey, setRefreshKey] = useState(0)
    const mountedRef = useRef(true)

    const fetchRedirect = useCallback(async () => {
      if (!qrcodeId) {
        setSlug(null)
        setError(null)
        return
      }
      setLoading(true)
      setError(null)
      try {
        const data = await qrcodesAPI.getRedirect(qrcodeId)
        if (!mountedRef.current) return
        setSlug(data?.slug ?? null)
      } catch (err) {
        if (!mountedRef.current) return
        console.error('[WebpagePreview]', err)
        setError(t('Failed to load preview'))
      } finally {
        if (mountedRef.current) setLoading(false)
      }
    }, [qrcodeId, t])

    useEffect(() => {
      fetchRedirect()
    }, [fetchRedirect])

    useEffect(() => {
      mountedRef.current = true
      return () => {
        mountedRef.current = false
      }
    }, [])

    const refresh = useCallback(() => {
      setRefreshKey(k => k + 1)
    }, [])

    useImperativeHandle(ref, () => ({ refresh }), [refresh])

    /* ---- empty state ---- */
    if (!qrcodeId) {
      return (
        <div
          className={cn(
            'flex flex-col items-center justify-center p-10 text-center text-gray-400 bg-white rounded-xl border border-purple-100 shadow-sm',
            className
          )}
        >
          <div className="text-5xl mb-3">🖥️</div>
          <p className="text-sm font-medium text-gray-500">
            {t('Save your QR code first to preview the landing page')}
          </p>
        </div>
      )
    }

    /* ---- loading state ---- */
    if (loading && !slug) {
      return (
        <div
          className={cn(
            'flex items-center justify-center p-10 bg-white rounded-xl border border-purple-100 shadow-sm',
            className
          )}
        >
          <LottieLoader size={80} />
        </div>
      )
    }

    /* ---- error state ---- */
    if (error || !slug) {
      return (
        <div
          className={cn(
            'flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-purple-100 shadow-sm',
            className
          )}
        >
          <div className="text-3xl mb-2">⚠️</div>
          <p className="text-sm text-gray-500 mb-3">{error ?? t('Preview not available')}</p>
          <button
            type="button"
            onClick={fetchRedirect}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium underline"
          >
            {t('Retry')}
          </button>
        </div>
      )
    }

    const previewUrl = `${process.env.NEXT_PUBLIC_API_URL}/s/${slug}?preview=true`

    return (
      <div
        className={cn(
          'flex flex-col rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50',
          className
        )}
      >
        {/* Browser chrome header */}
        <div className="flex items-center gap-2 px-3 py-2.5 bg-white border-b border-gray-200 flex-shrink-0">
          {/* Traffic-light dots */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="block w-3 h-3 rounded-full bg-red-400" />
            <span className="block w-3 h-3 rounded-full bg-yellow-400" />
            <span className="block w-3 h-3 rounded-full bg-green-400" />
          </div>

          {/* URL bar */}
          <div className="flex-1 min-w-0 px-2.5 py-1 bg-gray-100 rounded-md">
            <p className="text-xs text-gray-500 font-mono truncate">{previewUrl}</p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button
              type="button"
              onClick={refresh}
              title={t('Refresh preview')}
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={t('Open in new tab')}
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Iframe */}
        <iframe
          key={refreshKey}
          src={previewUrl}
          title={t('Landing page preview')}
          width="100%"
          height="600"
          className="border-0 block bg-white"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    )
  }
)
