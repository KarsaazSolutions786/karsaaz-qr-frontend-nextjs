/**
 * DownloadModal Component
 *
 * Modal for downloading QR codes in multiple formats with options.
 */

'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import { useTranslation } from '@/lib/i18n'
import { exportSVG } from '@/lib/utils/export-svg'
import { exportPDF } from '@/lib/utils/export-pdf'
import type { PDFPageSize, PDFOrientation } from '@/lib/utils/export-pdf'
import { exportEPS } from '@/lib/utils/export-eps'
import { exportPNG, PNG_SIZE_PRESETS } from '@/lib/utils/export-png'
import { useSubscription } from '@/lib/hooks/useSubscription'

export type DownloadFormat = 'svg' | 'pdf' | 'eps' | 'png'

export interface DownloadModalProps {
  svg: string
  defaultFilename?: string
  isOpen: boolean
  onClose: () => void
  onDownloadComplete?: (format: DownloadFormat) => void
}

/**
 * Purpose: Executes DownloadModal functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function DownloadModal({
  svg,
  defaultFilename = 'qr-code',
  isOpen,
  onClose,
  onDownloadComplete,
}: DownloadModalProps) {
  const { t } = useTranslation()
  const [selectedFormat, setSelectedFormat] = useState<DownloadFormat>('png')
  const [filename, setFilename] = useState(defaultFilename)
  const [isDownloading, setIsDownloading] = useState(false)

  // Subscription-based download restrictions
  const { plan, isOnTrial } = useSubscription()
  const isFreePlan = !plan || isOnTrial || plan.is_trial || parseFloat(plan.price || '0') === 0

  /**
   * Purpose: * Formats that require a paid plan 
   * Owner/Author: Syed Ashhad
   * Created: February 2026
   * Last Editor: Syed Ashhad
   * Last Updated: March 2026
   */
  
  const isPremiumFormat = (format: DownloadFormat): boolean => {
    return format === 'svg' || format === 'pdf' || format === 'eps'
  }

  /**
   * Purpose: Executes handleFormatSelect functionality.
   * Owner/Author: Syed Ashhad
   * Created: February 2026
   * Last Editor: Syed Ashhad
   * Last Updated: March 2026
   */
  const handleFormatSelect = (format: DownloadFormat) => {
    if (isFreePlan && isPremiumFormat(format)) {
      toast.info(
        `${format.toUpperCase()} ${t('download requires a paid plan. Upgrade to unlock all formats.')}`
      )
      return
    }
    setSelectedFormat(format)
  }

  // PNG options — free plans restricted to 'small' size
  const [pngSize, setPNGSize] = useState<keyof typeof PNG_SIZE_PRESETS>(
    isFreePlan ? 'small' : 'medium'
  )
  const [pngBackground, setPNGBackground] = useState<string>('')

  // PDF options
  const [pdfPageSize, setPDFPageSize] = useState<PDFPageSize>('a4')
  const [pdfOrientation, setPDFOrientation] = useState<PDFOrientation>('portrait')
  const [pdfMargin, setPDFMargin] = useState(10)

  // SVG options
  const [svgOptimized, setSVGOptimized] = useState(false)
  const [svgBackground, setSVGBackground] = useState(false)

  // EPS options
  const [epsWidth, setEPSWidth] = useState(300)
  const [epsHeight, setEPSHeight] = useState(300)

  /** Free plans are restricted to small/thumbnail PNG sizes only */
  const FREE_ALLOWED_PNG_SIZES: Set<string> = new Set(['thumbnail', 'small'])

  /**
   * Purpose: Executes handlePNGSizeChange functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
  const handlePNGSizeChange = (size: keyof typeof PNG_SIZE_PRESETS) => {
    if (isFreePlan && !FREE_ALLOWED_PNG_SIZES.has(size)) {
      toast.info(t('Higher resolution downloads require a paid plan. Upgrade to unlock all sizes.'))
      return
    }
    setPNGSize(size)
  }

  /**
   * Purpose: Executes handleDownload functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleDownload = async () => {
    // Enforce format restrictions for free/trial plans
    if (isFreePlan && isPremiumFormat(selectedFormat)) {
      toast.info(
        `${selectedFormat.toUpperCase()} ${t('download requires a paid plan. Upgrade to unlock all formats.')}`
      )
      return
    }

    // Enforce PNG size restriction for free/trial plans
    if (isFreePlan && selectedFormat === 'png' && !FREE_ALLOWED_PNG_SIZES.has(pngSize)) {
      toast.info(t('This PNG size requires a paid plan. Resetting to 512px.'))
      setPNGSize('small')
      return
    }

    setIsDownloading(true)

    try {
      const fileExt = selectedFormat
      const fullFilename = `${filename}.${fileExt}`

      switch (selectedFormat) {
        case 'svg':
          await exportSVG(svg, {
            filename: fullFilename,
            optimized: svgOptimized,
            addBackgroundRect: svgBackground,
            backgroundColor: '#ffffff',
          })
          break

        case 'pdf':
          await exportPDF(svg, {
            filename: fullFilename,
            pageSize: pdfPageSize,
            orientation: pdfOrientation,
            margin: pdfMargin,
            centerOnPage: true,
          })
          break

        case 'eps':
          await exportEPS(svg, {
            filename: fullFilename,
            width: epsWidth,
            height: epsHeight,
          })
          break

        case 'png':
          const preset = PNG_SIZE_PRESETS[pngSize]
          await exportPNG(svg, {
            filename: fullFilename,
            width: preset.width,
            height: preset.height,
            backgroundColor: pngBackground || undefined,
          })
          break
      }

      onDownloadComplete?.(selectedFormat)
      onClose()
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Download failed:', error)
      toast.error(t('Download failed. Please try again.'))
    } finally {
      setIsDownloading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{t('Download QR Code')}</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Filename */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('Filename')}</label>
            <input
              type="text"
              value={filename}
              onChange={e => setFilename(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="qr-code"
            />
          </div>

          {/* Format selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('Format')}</label>
            <div className="grid grid-cols-4 gap-3">
              <FormatButton
                format="png"
                label="PNG"
                description={t('Raster image')}
                icon="🖼️"
                isSelected={selectedFormat === 'png'}
                onClick={() => handleFormatSelect('png')}
                isLocked={false}
              />
              <FormatButton
                format="svg"
                label="SVG"
                description={isFreePlan ? t('Paid plan') : t('Vector image')}
                icon="📐"
                isSelected={selectedFormat === 'svg'}
                onClick={() => handleFormatSelect('svg')}
                isLocked={isFreePlan}
              />
              <FormatButton
                format="pdf"
                label="PDF"
                description={isFreePlan ? t('Paid plan') : t('Document')}
                icon="📄"
                isSelected={selectedFormat === 'pdf'}
                onClick={() => handleFormatSelect('pdf')}
                isLocked={isFreePlan}
              />
              <FormatButton
                format="eps"
                label="EPS"
                description={isFreePlan ? t('Paid plan') : t('Print ready')}
                icon="🖨️"
                isSelected={selectedFormat === 'eps'}
                onClick={() => handleFormatSelect('eps')}
                isLocked={isFreePlan}
              />
            </div>
            {isFreePlan && (
              <p className="mt-2 text-xs text-gray-500">
                {t(
                  'Free plan: PNG only (up to 512px). Upgrade for SVG, PDF, EPS and higher resolutions.'
                )}
              </p>
            )}
          </div>

          {/* Format-specific options */}
          {selectedFormat === 'png' && (
            <PNGOptions
              size={pngSize}
              onSizeChange={handlePNGSizeChange}
              background={pngBackground}
              onBackgroundChange={setPNGBackground}
              isFreePlan={isFreePlan}
              freeAllowedSizes={FREE_ALLOWED_PNG_SIZES}
            />
          )}

          {selectedFormat === 'svg' && (
            <SVGOptions
              optimized={svgOptimized}
              onOptimizedChange={setSVGOptimized}
              background={svgBackground}
              onBackgroundChange={setSVGBackground}
            />
          )}

          {selectedFormat === 'pdf' && (
            <PDFOptions
              pageSize={pdfPageSize}
              onPageSizeChange={setPDFPageSize}
              orientation={pdfOrientation}
              onOrientationChange={setPDFOrientation}
              margin={pdfMargin}
              onMarginChange={setPDFMargin}
            />
          )}

          {selectedFormat === 'eps' && (
            <EPSOptions
              width={epsWidth}
              onWidthChange={setEPSWidth}
              height={epsHeight}
              onHeightChange={setEPSHeight}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            {t('Cancel')}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isDownloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{t('Downloading...')}</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span>
                  {t('Download')} {selectedFormat.toUpperCase()}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Format button component
interface FormatButtonProps {
  format: DownloadFormat
  label: string
  description: string
  icon: string
  isSelected: boolean
  onClick: () => void
  isLocked?: boolean
}

/**
 * Purpose: Executes FormatButton functionality.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */
function FormatButton({
  label,
  description,
  icon,
  isSelected,
  onClick,
  isLocked = false,
}: FormatButtonProps) {
  const { t } = useTranslation()
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-4 rounded-lg border-2 transition text-center ${
        isLocked
          ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
          : isSelected
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
      title={isLocked ? `${label} ${t('download requires a paid plan')}` : undefined}
    >
      <div className="text-2xl mb-1">{isLocked ? '🔒' : icon}</div>
      <div className="font-medium text-sm">{label}</div>
      <div className="text-xs text-gray-500">{description}</div>
    </button>
  )
}

// PNG Options
interface PNGOptionsProps {
  size: keyof typeof PNG_SIZE_PRESETS
  onSizeChange: (size: keyof typeof PNG_SIZE_PRESETS) => void
  background: string
  onBackgroundChange: (color: string) => void
  isFreePlan?: boolean
  freeAllowedSizes?: Set<string>
}

/**
 * Purpose: Executes PNGOptions functionality.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */
function PNGOptions({
  size,
  onSizeChange,
  background,
  onBackgroundChange,
  isFreePlan = false,
  freeAllowedSizes,
}: PNGOptionsProps) {
  const { t } = useTranslation()
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('Size')}</label>
        <select
          value={size}
          onChange={e => onSizeChange(e.target.value as any)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {Object.entries(PNG_SIZE_PRESETS).map(([key, preset]) => {
            const locked = isFreePlan && freeAllowedSizes && !freeAllowedSizes.has(key)
            return (
              <option key={key} value={key} disabled={locked}>
                {preset.label}
                {locked ? ' (paid plan)' : ''}
              </option>
            )
          })}
        </select>
        {isFreePlan && (
          <p className="mt-1 text-xs text-gray-500">
            {t('Free plan: up to 512x512. Upgrade for larger sizes.')}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('Background Color (optional)')}
        </label>
        <input
          type="color"
          value={background || '#ffffff'}
          onChange={e => onBackgroundChange(e.target.value)}
          className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
        />
        <button
          type="button"
          onClick={() => onBackgroundChange('')}
          className="mt-2 text-sm text-gray-600 hover:text-gray-800"
        >
          {t('Clear (transparent)')}
        </button>
      </div>
    </div>
  )
}

// SVG Options
interface SVGOptionsProps {
  optimized: boolean
  onOptimizedChange: (optimized: boolean) => void
  background: boolean
  onBackgroundChange: (background: boolean) => void
}

/**
 * Purpose: Executes SVGOptions functionality.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */
function SVGOptions({
  optimized,
  onOptimizedChange,
  background,
  onBackgroundChange,
}: SVGOptionsProps) {
  const { t } = useTranslation()
  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={optimized}
          onChange={e => onOptimizedChange(e.target.checked)}
          className="rounded"
        />
        <span className="text-sm text-gray-700">{t('Optimize SVG (smaller file size)')}</span>
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={background}
          onChange={e => onBackgroundChange(e.target.checked)}
          className="rounded"
        />
        <span className="text-sm text-gray-700">{t('Add white background')}</span>
      </label>
    </div>
  )
}

// PDF Options
interface PDFOptionsProps {
  pageSize: PDFPageSize
  onPageSizeChange: (size: PDFPageSize) => void
  orientation: PDFOrientation
  onOrientationChange: (orientation: PDFOrientation) => void
  margin: number
  onMarginChange: (margin: number) => void
}

/**
 * Purpose: Executes PDFOptions functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
function PDFOptions({
  pageSize,
  onPageSizeChange,
  orientation,
  onOrientationChange,
  margin,
  onMarginChange,
}: PDFOptionsProps) {
  const { t } = useTranslation()
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('Page Size')}</label>
        <select
          value={pageSize}
          onChange={e => onPageSizeChange(e.target.value as PDFPageSize)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="a4">{t('A4')}</option>
          <option value="letter">{t('Letter')}</option>
          <option value="legal">{t('Legal')}</option>
          <option value="a3">{t('A3')}</option>
          <option value="a5">{t('A5')}</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('Orientation')}</label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onOrientationChange('portrait')}
            className={`flex-1 px-4 py-2 rounded-lg border-2 transition ${
              orientation === 'portrait'
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {t('Portrait')}
          </button>
          <button
            type="button"
            onClick={() => onOrientationChange('landscape')}
            className={`flex-1 px-4 py-2 rounded-lg border-2 transition ${
              orientation === 'landscape'
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {t('Landscape')}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('Margin:')} {margin}mm
        </label>
        <input
          type="range"
          min="0"
          max="50"
          step="5"
          value={margin}
          onChange={e => onMarginChange(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  )
}

// EPS Options
interface EPSOptionsProps {
  width: number
  onWidthChange: (width: number) => void
  height: number
  onHeightChange: (height: number) => void
}

/**
 * Purpose: Executes EPSOptions functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
function EPSOptions({ width, onWidthChange, height, onHeightChange }: EPSOptionsProps) {
  const { t } = useTranslation()
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('Width (points)')}
        </label>
        <input
          type="number"
          value={width}
          onChange={e => onWidthChange(parseInt(e.target.value))}
          min="72"
          max="1440"
          step="72"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('Height (points)')}
        </label>
        <input
          type="number"
          value={height}
          onChange={e => onHeightChange(parseInt(e.target.value))}
          min="72"
          max="1440"
          step="72"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <p className="text-xs text-gray-500">{t('1 point = 1/72 inch')}</p>
    </div>
  )
}
