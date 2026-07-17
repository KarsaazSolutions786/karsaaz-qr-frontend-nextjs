'use client'

/**
 * StickerEditor Component
 *
 * Complete sticker editing panel for the QR designer.
 * Renders the advanced shape selector grid and all shape-specific
 * customization controls (text, colors, sticker-specific fields).
 *
 * Used by QRDesignStudio.
 */

import React, { useState, useCallback, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { DesignerConfig } from '@/types/entities/designer'
import type { AdvancedShape } from '@/lib/constants/qr-shapes'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const FONT_FAMILIES = [
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
]

const REVIEW_COLLECTOR_LOGOS = [
  'airbnb',
  'ebay',
  'linkedin',
  'tripadvisor',
  'yelp',
  'aliexpress',
  'facebook',
  'pinterest',
  'trustpilot',
  'amazon',
  'foursquare',
  'skype',
  'twitch',
  'youtube',
  'appstore',
  'google-maps',
  'snapchat',
  'twitter',
  'zoom',
  'bitcoin',
  'google',
  'telegram',
  'wechat',
  'booking',
  'googleplay',
  'tiktok',
  'whatsapp',
  'discord',
  'instagram',
  'trendyol',
]

const STICKER_TEXT_PRESETS = [
  'SCAN ME',
  'Scan Here',
  'Visit Us',
  'Learn More',
  'Get Offer',
  'Download App',
  'Follow Us',
  'Order Now',
  'Join Us',
  'Contact Us',
]

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

export interface StickerEditorProps {
  /** Current merged designer config */
  config: DesignerConfig
  /** List of available advanced shapes from useDesignShapes */
  advancedShapes: AdvancedShape[]
  /** Called when any design field changes */
  onChange: (field: string | Record<string, unknown>, value?: any) => void
  /** Visual variant -- compact uses smaller grid, full uses larger */
  variant?: 'compact' | 'full'
  /** Optional color picker component to use instead of native input */
  ColorPicker?: React.ComponentType<{
    label: string
    value: string
    onChange: (color: string) => void
  }>
  /**
   * If true, selecting a sticker (other than 'none') is blocked
   * and onPremiumBlock is called instead.
   */
  isPremiumLocked?: boolean
  /**
   * Callback fired when user clicks a sticker while isPremiumLocked is true.
   * Use this to show a toast or upgrade prompt.
   */
  onPremiumBlock?: () => void
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

/**
 * Purpose: * Simple color picker fallback
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

function DefaultColorPicker({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (color: string) => void
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="h-8 w-12 rounded border border-gray-300 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={e => {
            const v = e.target.value
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v)
          }}
          className="flex-1 h-8 text-xs border border-gray-300 rounded px-2 font-mono"
          maxLength={7}
        />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

/**
 * Purpose: Executes StickerEditor functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function StickerEditor({
  config,
  advancedShapes,
  onChange,
  variant = 'full',
  ColorPicker,
  isPremiumLocked = false,
  onPremiumBlock,
}: StickerEditorProps) {
  const { t } = useTranslation()
  const [showTextPresets, setShowTextPresets] = useState(false)

  const CP = ColorPicker || DefaultColorPicker
  const isCompact = variant === 'compact'

  // Resolve current sticker metadata
  const currentSticker = useMemo(
    () => advancedShapes.find(s => s.value === config.advancedShape),
    [advancedShapes, config.advancedShape]
  )

  const hasSticker = config.advancedShape && config.advancedShape !== 'none'
  const isFrameSticker =
    config.advancedShape?.startsWith('rect-frame') || config.advancedShape?.includes('frame')
  const isFourCorners = config.advancedShape?.startsWith('four-corners')
  const isHealthcare = config.advancedShape === 'healthcare'
  const isReviewCollector = config.advancedShape === 'review-collector'
  const isCoupon = config.advancedShape === 'coupon'
  const hasTextControls = currentSticker?.hasText && !isCoupon

  const handleTextPresetSelect = useCallback(
    (text: string) => {
      onChange('text', text)
      setShowTextPresets(false)
    },
    [onChange]
  )

  return (
    <div className="space-y-4">
      {/* ====== Sticker Selection Grid ====== */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('Select Sticker')}
        </label>
        <div className={cn('grid gap-2', isCompact ? 'grid-cols-7' : 'grid-cols-3 sm:grid-cols-4')}>
          {advancedShapes.map(shape => (
            <button
              key={shape.value}
              type="button"
              onClick={() => {
                // Allow deselecting (setting to 'none') even when locked
                if (isPremiumLocked && shape.value !== 'none') {
                  onPremiumBlock?.()
                  return
                }
                onChange({
                  advancedShape: shape.value,
                  advancedShapeAssetId: shape.id || null,
                  advancedShapeAssetVersion: shape.version || null,
                  advancedShapeSource: shape.source || null,
                  advancedShapeRenderMode:
                    shape.value !== 'none' ? shape.renderMode || 'svg_template' : null,
                })
              }}
              className={cn(
                'rounded-lg border-2 transition-all overflow-hidden',
                isCompact ? 'aspect-square p-1' : 'flex flex-col items-center gap-1 p-1.5',
                config.advancedShape === shape.value
                  ? 'border-purple-500 bg-purple-50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300',
                isPremiumLocked && shape.value !== 'none' && 'opacity-60 cursor-not-allowed'
              )}
              title={
                isPremiumLocked && shape.value !== 'none'
                  ? `${shape.label} (${t('requires paid plan')})`
                  : shape.label
              }
            >
              {shape.image ? (
                <img
                  src={shape.image}
                  alt={shape.label}
                  className={cn('object-contain', isCompact ? 'w-full h-full' : 'w-14 h-14')}
                />
              ) : (
                <span
                  className={cn(
                    'font-medium text-gray-700',
                    isCompact ? 'text-[8px] text-gray-500' : 'text-xs'
                  )}
                >
                  {shape.label}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ====== Sticker-Specific Controls ====== */}
      {hasSticker && (
        <div className="space-y-4 border-t border-gray-200 pt-4">
          {/* --- Dropshadow toggle (frame stickers) --- */}
          {isFrameSticker && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{t('Drop Shadow')}</span>
              <Switch
                checked={config.advancedShapeDropShadow || false}
                onCheckedChange={checked => onChange('advancedShapeDropShadow', checked)}
              />
            </div>
          )}

          {/* --- Four-corners frame color --- */}
          {isFourCorners && (
            <CP
              label={t('Frame Color')}
              value={config.advancedShapeFrameColor || '#000000'}
              onChange={c => onChange('advancedShapeFrameColor', c)}
            />
          )}

          {/* --- Healthcare specific --- */}
          {isHealthcare && (
            <div className="space-y-3">
              <CP
                label={t('Frame Color')}
                value={config.healthcareFrameColor || '#000000'}
                onChange={c => onChange('healthcareFrameColor', c)}
              />
              <CP
                label={t('Heart Color')}
                value={config.healthcareHeartColor || '#ff0000'}
                onChange={c => onChange('healthcareHeartColor', c)}
              />
            </div>
          )}

          {/* --- Review Collector specific --- */}
          {isReviewCollector && (
            <div className="space-y-3">
              <CP
                label={t('Circle Color')}
                value={config.reviewCollectorCircleColor || '#000000'}
                onChange={c => onChange('reviewCollectorCircleColor', c)}
              />
              <CP
                label={t('Stars Color')}
                value={config.reviewCollectorStarsColor || '#FFD700'}
                onChange={c => onChange('reviewCollectorStarsColor', c)}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Review Platform Logo')}
                </label>
                <div className="grid grid-cols-6 gap-2 max-h-[150px] overflow-y-auto">
                  {REVIEW_COLLECTOR_LOGOS.map(logo => (
                    <button
                      key={logo}
                      type="button"
                      onClick={() =>
                        onChange(
                          'reviewCollectorLogoSrc',
                          `/images/review-collector-logos/${logo}.png`
                        )
                      }
                      className={cn(
                        'aspect-square rounded-lg border-2 p-1 transition-all',
                        config.reviewCollectorLogoSrc?.includes(logo)
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <img
                        src={`/images/review-collector-logos/${logo}.png`}
                        alt={logo}
                        className="w-full h-full object-contain"
                        onError={e => {
                          ;(e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* --- Coupon specific --- */}
          {isCoupon && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <CP
                  label={t('Left Color')}
                  value={config.couponLeftColor || '#1c57cb'}
                  onChange={c => onChange('couponLeftColor', c)}
                />
                <CP
                  label={t('Right Color')}
                  value={config.couponRightColor || '#1c57cb'}
                  onChange={c => onChange('couponRightColor', c)}
                />
              </div>
              <Input
                placeholder={t('Coupon Line 1 (e.g., EXCLUSIVE)')}
                value={config.couponTextLine1 || ''}
                onChange={e => onChange('couponTextLine1', e.target.value)}
              />
              <Input
                placeholder={t('Coupon Line 2 (e.g., OFFER)')}
                value={config.couponTextLine2 || ''}
                onChange={e => onChange('couponTextLine2', e.target.value)}
              />
              <Input
                placeholder={t('Coupon Line 3 (e.g., LIMITED TIME)')}
                value={config.couponTextLine3 || ''}
                onChange={e => onChange('couponTextLine3', e.target.value)}
              />
            </div>
          )}

          {/* --- Text controls (for stickers with text, except coupon) --- */}
          {hasTextControls && (
            <div className="space-y-3 border-t border-gray-200 pt-4">
              <h4 className="text-sm font-semibold text-gray-900">{t('Sticker Text')}</h4>

              {/* Text input with preset suggestions */}
              <div className="relative">
                <div className="flex gap-2">
                  <Input
                    placeholder={t('SCAN ME')}
                    value={config.text || t('SCAN ME')}
                    onChange={e => onChange('text', e.target.value)}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => setShowTextPresets(prev => !prev)}
                    className={cn(
                      'flex h-10 items-center gap-1 rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm',
                      'hover:bg-gray-50 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500',
                      showTextPresets && 'bg-purple-50 border-purple-400'
                    )}
                    title={t('Text presets')}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h7"
                      />
                    </svg>
                  </button>
                </div>

                {/* Text preset dropdown */}
                {showTextPresets && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowTextPresets(false)} />
                    <div className="absolute z-20 mt-1 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 max-h-56 overflow-auto">
                      {STICKER_TEXT_PRESETS.map(text => (
                        <button
                          key={text}
                          type="button"
                          onClick={() => handleTextPresetSelect(text)}
                          className={cn(
                            'w-full text-left px-3 py-1.5 text-sm hover:bg-purple-50 transition',
                            config.text === text && 'bg-purple-50 text-purple-700 font-medium'
                          )}
                        >
                          {text}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Font Family */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t('Font')}</label>
                <select
                  value={config.fontFamily || 'Raleway'}
                  onChange={e => onChange('fontFamily', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {FONT_FAMILIES.map(font => (
                    <option key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color pickers in a row */}
              <div className="grid grid-cols-2 gap-3">
                <CP
                  label={t('Text Color')}
                  value={config.textColor || '#ffffff'}
                  onChange={c => onChange('textColor', c)}
                />
                <CP
                  label={t('Text Background')}
                  value={config.textBackgroundColor || '#1c57cb'}
                  onChange={c => onChange('textBackgroundColor', c)}
                />
              </div>

              {/* Text Size — coerce defensively: saved designs can hydrate
                  textSize as a string, and String.toFixed throws */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-gray-500">{t('Text Size')}</label>
                  <span className="text-xs font-medium text-gray-700">
                    {(Number(config.textSize) || 1).toFixed(1)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={Number(config.textSize) || 1}
                  onChange={e => onChange('textSize', parseFloat(e.target.value))}
                  className="w-full accent-purple-500"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                  <span>{t('Small')}</span>
                  <span>{t('Default')}</span>
                  <span>{t('Large')}</span>
                </div>
              </div>

              {/* Live text preview */}
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">{t('Preview')}</p>
                <div
                  className="rounded px-3 py-2 text-center"
                  style={{
                    fontFamily: config.fontFamily || 'Raleway',
                    color: config.textColor || '#ffffff',
                    backgroundColor: config.textBackgroundColor || '#1c57cb',
                    fontSize: `${(Number(config.textSize) || 1) * 14}px`,
                  }}
                >
                  {config.text || 'SCAN ME'}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ====== Empty state when no sticker selected ====== */}
      {!hasSticker && (
        <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-center">
          <p className="text-sm text-gray-500">
            {t('Select a sticker above to add a decorative frame around your QR code')}
          </p>
        </div>
      )}
    </div>
  )
}
