'use client'

import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { LogoUpload } from '@/components/qr/LogoUpload'
import { DesignerConfig } from '@/types/entities/designer'
import { useDesignShapes } from '@/lib/hooks/useDesignShapes'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { ColorPickerWithPresets } from './ColorPickerWithPresets'
import { SectionCard } from './SectionCard'
import { ShapeGrid } from './ShapeGrid'

interface QRLookPanelProps {
  value: DesignerConfig
  onFieldChange: (field: string, value: unknown) => void
  onLogoChange: (updates: Partial<DesignerConfig['logo']>) => void
  isFreePlan: boolean
  onPremiumBlock: () => void
}

export function QRLookPanel({
  value,
  onFieldChange,
  onLogoChange,
  isFreePlan,
  onPremiumBlock,
}: QRLookPanelProps) {
  const { t } = useTranslation()
  const { MODULE_SHAPES, FINDER_STYLES, FINDER_DOT_STYLES, OUTLINED_SHAPES, PRESET_LOGOS } =
    useDesignShapes()
  const [expanded, setExpanded] = useState(true)
  const [showAllModules, setShowAllModules] = useState(false)
  const [showAllFinders, setShowAllFinders] = useState(false)
  const [showAllFinderDots, setShowAllFinderDots] = useState(false)
  const [showAllShapes, setShowAllShapes] = useState(false)

  return (
    <SectionCard
      title={t('Look & Feel')}
      sectionKey="lookFeel"
      expanded={expanded}
      onToggle={() => setExpanded(e => !e)}
    >
      {/* Module */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('Module')}</label>
        <ShapeGrid
          items={MODULE_SHAPES}
          selectedValue={value.moduleShape || 'square'}
          onSelect={v => onFieldChange('moduleShape', v)}
          showAll={showAllModules}
          onToggleShowAll={() => setShowAllModules(s => !s)}
          premiumLocked={isFreePlan}
          onPremiumBlock={onPremiumBlock}
          t={t}
        />
      </div>

      {/* Finder */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('Finder')}</label>
        <ShapeGrid
          items={FINDER_STYLES}
          selectedValue={value.finder || 'default'}
          onSelect={v => onFieldChange('finder', v)}
          showAll={showAllFinders}
          onToggleShowAll={() => setShowAllFinders(s => !s)}
          premiumLocked={isFreePlan}
          onPremiumBlock={onPremiumBlock}
          t={t}
        />
      </div>

      {/* Finder Dot */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('Finder Dot')}</label>
        <ShapeGrid
          items={FINDER_DOT_STYLES}
          selectedValue={value.finderDot || 'default'}
          onSelect={v => onFieldChange('finderDot', v)}
          showAll={showAllFinderDots}
          onToggleShowAll={() => setShowAllFinderDots(s => !s)}
          premiumLocked={isFreePlan}
          onPremiumBlock={onPremiumBlock}
          t={t}
        />
      </div>

      {/* Shape (Outline) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('Shape')}</label>
        <ShapeGrid
          items={OUTLINED_SHAPES}
          selectedValue={value.shape || 'none'}
          onSelect={v => onFieldChange('shape', v)}
          showAll={showAllShapes}
          onToggleShowAll={() => setShowAllShapes(s => !s)}
          premiumLocked={isFreePlan}
          onPremiumBlock={onPremiumBlock}
          t={t}
        />
      </div>

      {/* Frame Color */}
      {value.shape && value.shape !== 'none' && (
        <ColorPickerWithPresets
          label={t('Frame Color')}
          value={value.frameColor || '#000000'}
          onChange={c => onFieldChange('frameColor', c)}
        />
      )}

      {/* Logo */}
      <div className="border-t border-gray-200 pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('Logo Type')}</label>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="logoType"
              checked={(value.logo?.logoType || 'preset') === 'preset'}
              onChange={() => onLogoChange({ logoType: 'preset' })}
              className="text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-gray-700">{t('Preset')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="logoType"
              checked={value.logo?.logoType === 'custom'}
              onChange={() => onLogoChange({ logoType: 'custom' })}
              className="text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-gray-700">{t('Your logo')}</span>
          </label>
        </div>

        {/* Preset Logos */}
        {(value.logo?.logoType || 'preset') === 'preset' && (
          <div className="mt-3">
            <div className="grid grid-cols-7 gap-2 max-h-[200px] overflow-y-auto">
              <button
                type="button"
                onClick={() => onLogoChange({ url: undefined })}
                className={cn(
                  'aspect-square rounded-lg border-2 flex items-center justify-center text-xs transition-all',
                  !value.logo?.url
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                {t('NONE')}
              </button>
              {PRESET_LOGOS.map(logo => (
                <button
                  key={logo.value}
                  type="button"
                  onClick={() => {
                    const logoUrl = logo.image || `/assets/images/png-logos/${logo.value}.png`
                    onLogoChange({
                      url: logoUrl,
                      logoType: 'preset',
                      size: value.logo?.size || 0.2,
                      positionX: value.logo?.positionX ?? 0.5,
                      positionY: value.logo?.positionY ?? 0.5,
                      rotate: value.logo?.rotate ?? 0,
                      backgroundEnabled: value.logo?.backgroundEnabled ?? true,
                      backgroundFill: value.logo?.backgroundFill || '#ffffff',
                      backgroundScale: value.logo?.backgroundScale ?? 1.3,
                      backgroundShape: value.logo?.backgroundShape || 'circle',
                    })
                    if (value.errorCorrectionLevel !== 'H') {
                      onFieldChange('errorCorrectionLevel', 'H')
                    }
                  }}
                  className={cn(
                    'aspect-square rounded-full border-2 p-1 transition-all overflow-hidden',
                    value.logo?.url?.includes(logo.value)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                  title={logo.label}
                >
                  <img
                    src={logo.image || `/images/logos/${logo.value}.png`}
                    alt={logo.label}
                    className="w-full h-full object-contain rounded-full"
                    onError={e => {
                      ;(e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom Logo Upload */}
        {value.logo?.logoType === 'custom' && (
          <div className="mt-3">
            <LogoUpload
              value={value.logo?.url ?? null}
              onChange={url => {
                if (url) {
                  onLogoChange({
                    url,
                    logoType: 'preset',
                    size: value.logo?.size || 0.2,
                    positionX: value.logo?.positionX ?? 0.5,
                    positionY: value.logo?.positionY ?? 0.5,
                    rotate: value.logo?.rotate ?? 0,
                    backgroundEnabled: value.logo?.backgroundEnabled ?? true,
                    backgroundFill: value.logo?.backgroundFill || '#ffffff',
                    backgroundScale: value.logo?.backgroundScale ?? 1.3,
                    backgroundShape: value.logo?.backgroundShape || 'circle',
                  })
                  if (value.errorCorrectionLevel !== 'H') {
                    onFieldChange('errorCorrectionLevel', 'H')
                  }
                } else {
                  onLogoChange({ url: undefined, logoType: 'custom' })
                }
              }}
            />
            <p className="text-xs text-gray-500 mt-2">
              {t('Upload your logo (PNG, JPG). The logo will be embedded in the QR code.')}
            </p>
          </div>
        )}

        {/* Logo Customization Controls */}
        {value.logo?.url && (
          <div className="mt-4 space-y-4 border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-900">{t('Logo Settings')}</h4>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                {t('Logo Scale')}: {Math.round((value.logo.size || 0.2) * 100)}%
              </label>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.01"
                value={value.logo.size || 0.2}
                onChange={e => onLogoChange({ size: parseFloat(e.target.value) })}
                className="w-full accent-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                {t('Horizontal Position')}: {Math.round((value.logo.positionX ?? 0.5) * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={value.logo.positionX ?? 0.5}
                onChange={e => onLogoChange({ positionX: parseFloat(e.target.value) })}
                className="w-full accent-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                {t('Vertical Position')}: {Math.round((value.logo.positionY ?? 0.5) * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={value.logo.positionY ?? 0.5}
                onChange={e => onLogoChange({ positionY: parseFloat(e.target.value) })}
                className="w-full accent-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                {t('Rotation')}: {value.logo.rotate ?? 0}°
              </label>
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                value={value.logo.rotate ?? 0}
                onChange={e => onLogoChange({ rotate: parseInt(e.target.value) })}
                className="w-full accent-purple-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{t('Logo Background')}</span>
              <Switch
                checked={value.logo.backgroundEnabled ?? true}
                onCheckedChange={checked => onLogoChange({ backgroundEnabled: checked })}
              />
            </div>

            {(value.logo.backgroundEnabled ?? true) && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{t('Background Shape')}</span>
                  <div className="flex gap-2">
                    {(['circle', 'square'] as const).map(shape => (
                      <button
                        key={shape}
                        type="button"
                        onClick={() => onLogoChange({ backgroundShape: shape })}
                        className={cn(
                          'px-3 py-1 text-sm rounded-lg border-2 capitalize transition-all',
                          (value.logo?.backgroundShape || 'circle') === shape
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        )}
                      >
                        {t(shape)}
                      </button>
                    ))}
                  </div>
                </div>

                <ColorPickerWithPresets
                  label={t('Background Color')}
                  value={value.logo.backgroundFill || '#ffffff'}
                  onChange={c => onLogoChange({ backgroundFill: c })}
                />

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    {t('Background Size')}: {(value.logo.backgroundScale ?? 1.3).toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="2"
                    step="0.1"
                    value={value.logo.backgroundScale ?? 1.3}
                    onChange={e => onLogoChange({ backgroundScale: parseFloat(e.target.value) })}
                    className="w-full accent-purple-500"
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </SectionCard>
  )
}
