'use client'

/**
 * PageDesignPanel
 *
 * Simplified webpage design panel for dynamic QR types that have
 * an associated landing page (biolinks, menus, business profiles, etc.).
 * Allows users to configure background color, font family, and
 * optional header image for the scanned page.
 */

import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface WebpageDesignData {
  backgroundColor: string
  fontFamily: string
  headerImageUrl: string
}

interface PageDesignPanelProps {
  value: WebpageDesignData
  onChange: (data: WebpageDesignData) => void
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const DEFAULT_WEBPAGE_DESIGN: WebpageDesignData = {
  backgroundColor: '#FFFFFF',
  fontFamily: 'Raleway',
  headerImageUrl: '',
}

const FONT_OPTIONS = [
  'Raleway',
  'Arial',
  'Helvetica',
  'Georgia',
  'Times New Roman',
  'Verdana',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Oswald',
  'Poppins',
  'Inter',
  'Nunito',
  'Playfair Display',
]

const BACKGROUND_PRESETS = [
  '#FFFFFF',
  '#F9FAFB',
  '#F3F4F6',
  '#FEF3C7',
  '#DBEAFE',
  '#D1FAE5',
  '#FCE7F3',
  '#EDE9FE',
  '#111827',
]

/**
 * QR types that have an associated webpage (landing page) design.
 * These are dynamic types where the scanned URL renders a hosted page.
 */
export const TYPES_WITH_WEBPAGE_DESIGN = new Set([
  'biolinks',
  'business-profile',
  'restaurant-menu',
  'product-catalogue',
  'event',
  'business-review',
  'website-builder',
  'lead-form',
  'resume',
  'vcard-plus',
  'google-review',
  'app-download',
  'file-upload',
])

export { DEFAULT_WEBPAGE_DESIGN }

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * Purpose: Executes PageDesignPanel functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export default function PageDesignPanel({ value, onChange }: PageDesignPanelProps) {
  const { t } = useTranslation()
  const [isDragging, setIsDragging] = useState(false)

  const data = { ...DEFAULT_WEBPAGE_DESIGN, ...value }

  /**
   * Purpose: Updates the configuration or state.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
  const update = (patch: Partial<WebpageDesignData>) => {
    onChange({ ...data, ...patch })
  }

  /**
   * Purpose: Executes handleImageFile functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => {
      const dataUrl = e.target?.result as string
      update({ headerImageUrl: dataUrl })
    }
    reader.readAsDataURL(file)
  }

  /**
   * Purpose: Executes handleDrop functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleImageFile(file)
  }

  return (
    <div className="space-y-6">
      {/* ---- Background Color ---- */}
      <div className="bg-white rounded-xl border border-purple-100 overflow-hidden shadow-sm">
        <div className="px-5 py-4 bg-purple-50/30">
          <h3 className="text-base font-semibold text-gray-900">{t('Background Color')}</h3>
        </div>
        <div className="px-5 py-4 space-y-3">
          <div className="grid grid-cols-9 gap-2">
            {BACKGROUND_PRESETS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => update({ backgroundColor: color })}
                className={cn(
                  'w-full aspect-square rounded-lg border-2 transition-all',
                  data.backgroundColor === color
                    ? 'border-purple-500 scale-110 shadow-md'
                    : 'border-gray-200 hover:border-gray-400'
                )}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">{t('Custom')}</span>
            <div className="relative">
              <input
                type="color"
                value={data.backgroundColor}
                onChange={e => update({ backgroundColor: e.target.value })}
                className="absolute inset-0 opacity-0 w-14 h-8 cursor-pointer"
              />
              <div
                className="w-14 h-8 rounded border border-gray-300 cursor-pointer"
                style={{ backgroundColor: data.backgroundColor }}
              />
            </div>
            <input
              type="text"
              value={data.backgroundColor}
              onChange={e => {
                const v = e.target.value
                if (/^#[0-9a-fA-F]{0,6}$/.test(v)) update({ backgroundColor: v })
              }}
              className="w-24 h-8 text-xs border border-gray-300 rounded px-2 font-mono"
              maxLength={7}
            />
          </div>
        </div>
      </div>

      {/* ---- Font Family ---- */}
      <div className="bg-white rounded-xl border border-purple-100 overflow-hidden shadow-sm">
        <div className="px-5 py-4 bg-purple-50/30">
          <h3 className="text-base font-semibold text-gray-900">{t('Font Family')}</h3>
        </div>
        <div className="px-5 py-4">
          <select
            value={data.fontFamily}
            onChange={e => update({ fontFamily: e.target.value })}
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-400 bg-white"
          >
            {FONT_OPTIONS.map(font => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>

          {/* Preview */}
          <div
            className="mt-3 p-4 rounded-lg border border-gray-200 bg-gray-50"
            style={{ fontFamily: data.fontFamily }}
          >
            <p className="text-sm text-gray-600">
              {t('The quick brown fox jumps over the lazy dog.')}
            </p>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {data.fontFamily}
            </p>
          </div>
        </div>
      </div>

      {/* ---- Header Image ---- */}
      <div className="bg-white rounded-xl border border-purple-100 overflow-hidden shadow-sm">
        <div className="px-5 py-4 bg-purple-50/30">
          <h3 className="text-base font-semibold text-gray-900">{t('Header Image')}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {t('Optional banner image displayed at the top of the page')}
          </p>
        </div>
        <div className="px-5 py-4">
          {data.headerImageUrl ? (
            <div className="relative">
              <img
                src={data.headerImageUrl}
                alt="Header preview"
                className="w-full h-40 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => update({ headerImageUrl: '' })}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 border border-gray-200 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                isDragging
                  ? 'border-purple-500 bg-purple-50/30'
                  : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/10'
              )}
              onClick={() => document.getElementById('page-header-image-input')?.click()}
              onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <input
                id="page-header-image-input"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) handleImageFile(file)
                }}
              />
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-medium">
                {t('Drop image here or click to browse')}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {t('PNG, JPG, or WebP. Recommended: 1200x400px')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
