'use client'

import { useState, useRef, useMemo } from 'react'
import { BackendQRPreview, BackendQRPreviewRef } from '@/components/qr/BackendQRPreview'
import { GradientBuilder } from '@/components/ui/GradientBuilder'
import { LogoUpload } from '@/components/qr/LogoUpload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { encodeQRData } from '@/lib/utils/qr-data-encoder'
import {
  DesignerConfig,
  DEFAULT_DESIGNER_CONFIG,
  DESIGN_PRESETS,
} from '@/types/entities/designer'
import {
  MODULE_SHAPES,
  FINDER_STYLES,
  FINDER_DOT_STYLES,
  OUTLINED_SHAPES,
  ADVANCED_SHAPES,
  PRESET_LOGOS,
} from '@/lib/constants/qr-shapes'
import {
  Palette,
  Image as ImageIcon,
  Sparkles,
  RotateCcw,
  Boxes,
  CircleDot,
  Shapes,
  Sticker,
  Wand2,
} from 'lucide-react'

interface Step2DesignerProps {
  design: Partial<DesignerConfig>
  onChange: (design: Partial<DesignerConfig>) => void
  qrType: string
  qrData: Record<string, any>
}

export default function Step2Designer({
  design,
  onChange,
  qrType,
  qrData,
}: Step2DesignerProps) {
  const [activeTab, setActiveTab] = useState('shape')
  const previewRef = useRef<BackendQRPreviewRef>(null)

  const mergedConfig = useMemo(
    () => ({ ...DEFAULT_DESIGNER_CONFIG, ...design }),
    [design]
  )

  const previewData = encodeQRData(qrType, qrData)

  const handleChange = (field: string, value: any) => {
    onChange({ ...design, [field]: value })
  }

  const applyPreset = (preset: typeof DESIGN_PRESETS[0]) => {
    onChange({ ...design, ...preset.config })
  }

  const resetToDefaults = () => {
    onChange({ ...DEFAULT_DESIGNER_CONFIG })
  }

  // Get current sticker config for conditional controls
  const currentSticker = ADVANCED_SHAPES.find(s => s.value === mergedConfig.advancedShape)

  return (
    <div className="space-y-6">
      {/* Design Presets */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Presets</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DESIGN_PRESETS.map((preset) => {
            const presetColor = preset.config.foregroundFill?.type === 'solid'
              ? (preset.config.foregroundFill as any)?.color || '#000000'
              : '#000000'
            const presetBg = preset.config.background?.type === 'solid'
              ? preset.config.background?.color || '#FFFFFF'
              : '#FFFFFF'
            return (
              <Button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                variant="outline"
                className="h-auto py-3 flex flex-col items-center gap-2 hover:border-blue-400 transition-colors"
              >
                <div className="w-12 h-12 rounded border-2" style={{ backgroundColor: presetBg, borderColor: presetColor }}>
                  <div className="w-full h-full flex items-center justify-center text-lg" style={{ color: presetColor }}>⊞</div>
                </div>
                <span className="text-xs font-medium">{preset.name}</span>
              </Button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Design Controls */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Customize Design</h3>
            <Button onClick={resetToDefaults} variant="ghost" size="sm" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="shape" className="gap-1 text-[10px] sm:text-xs">
                <Boxes className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Shape</span>
              </TabsTrigger>
              <TabsTrigger value="fill" className="gap-1 text-[10px] sm:text-xs">
                <Palette className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Fill</span>
              </TabsTrigger>
              <TabsTrigger value="corners" className="gap-1 text-[10px] sm:text-xs">
                <CircleDot className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Eyes</span>
              </TabsTrigger>
              <TabsTrigger value="logo" className="gap-1 text-[10px] sm:text-xs">
                <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Logo</span>
              </TabsTrigger>
              <TabsTrigger value="shapes" className="gap-1 text-[10px] sm:text-xs">
                <Shapes className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Outline</span>
              </TabsTrigger>
              <TabsTrigger value="stickers" className="gap-1 text-[10px] sm:text-xs">
                <Sticker className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Sticker</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="gap-1 text-[10px] sm:text-xs">
                <Wand2 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">AI</span>
              </TabsTrigger>
            </TabsList>

            {/* ======================= SHAPE TAB ======================= */}
            <TabsContent value="shape" className="space-y-6 mt-6">
              {/* Module Pattern */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Module Pattern</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {MODULE_SHAPES.map((shape) => (
                    <button
                      key={shape.value}
                      type="button"
                      onClick={() => handleChange('moduleShape', shape.value)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all text-xs ${
                        mergedConfig.moduleShape === shape.value
                          ? 'border-blue-500 bg-blue-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-medium text-gray-700">{shape.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size: {mergedConfig.size}px
                </label>
                <input
                  type="range" min="200" max="2000" step="50"
                  value={mergedConfig.size}
                  onChange={(e) => handleChange('size', parseInt(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              {/* Margin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Margin: {mergedConfig.margin} modules
                </label>
                <input
                  type="range" min="0" max="10"
                  value={mergedConfig.margin}
                  onChange={(e) => handleChange('margin', parseInt(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              {/* Error Correction */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Error Correction</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['L', 'M', 'Q', 'H'] as const).map((level) => (
                    <button
                      key={level} type="button"
                      onClick={() => handleChange('errorCorrectionLevel', level)}
                      className={`p-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        mergedConfig.errorCorrectionLevel === level
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {level}
                      <span className="block text-[10px] font-normal text-gray-500">
                        {level === 'L' ? '7%' : level === 'M' ? '15%' : level === 'Q' ? '25%' : '30%'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* ======================= FILL TAB ======================= */}
            <TabsContent value="fill" className="space-y-6 mt-6">
              {/* Foreground Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Foreground Color</label>
                {mergedConfig.foregroundFill.type === 'solid' && (
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={(mergedConfig.foregroundFill as any).color || '#000000'}
                      onChange={(e) => handleChange('foregroundFill', { type: 'solid', color: e.target.value })}
                      className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={(mergedConfig.foregroundFill as any).color || '#000000'}
                      onChange={(e) => handleChange('foregroundFill', { type: 'solid', color: e.target.value })}
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm font-mono"
                    />
                  </div>
                )}
                <div className="mt-3">
                  <Button
                    variant="outline" size="sm" className="gap-2"
                    onClick={() => {
                      if (mergedConfig.foregroundFill.type === 'solid') {
                        handleChange('foregroundFill', {
                          type: 'gradient', gradientType: 'linear',
                          startColor: (mergedConfig.foregroundFill as any).color || '#000000',
                          endColor: '#333333', rotation: 45,
                        })
                      } else {
                        handleChange('foregroundFill', { type: 'solid', color: '#000000' })
                      }
                    }}
                  >
                    <Sparkles className="w-3 h-3" />
                    {mergedConfig.foregroundFill.type === 'solid' ? 'Use Gradient' : 'Use Solid Color'}
                  </Button>
                </div>
                {mergedConfig.foregroundFill.type === 'gradient' && (
                  <div className="mt-4">
                    <GradientBuilder
                      value={{
                        type: (mergedConfig.foregroundFill as any).gradientType || 'linear',
                        startColor: (mergedConfig.foregroundFill as any).startColor || '#000000',
                        endColor: (mergedConfig.foregroundFill as any).endColor || '#333333',
                        rotation: (mergedConfig.foregroundFill as any).rotation || 45,
                      }}
                      onChange={(gradient) =>
                        handleChange('foregroundFill', {
                          type: 'gradient', gradientType: gradient.type,
                          startColor: gradient.startColor, endColor: gradient.endColor,
                          rotation: gradient.rotation,
                        })
                      }
                    />
                  </div>
                )}
              </div>

              {/* Eye External Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Eye External Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={mergedConfig.eyeExternalColor || '#000000'}
                    onChange={(e) => handleChange('eyeExternalColor', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={mergedConfig.eyeExternalColor || '#000000'}
                    onChange={(e) => handleChange('eyeExternalColor', e.target.value)}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>

              {/* Eye Internal Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Eye Internal Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={mergedConfig.eyeInternalColor || '#000000'}
                    onChange={(e) => handleChange('eyeInternalColor', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={mergedConfig.eyeInternalColor || '#000000'}
                    onChange={(e) => handleChange('eyeInternalColor', e.target.value)}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>

              {/* Background */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Background</label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox" id="transparentBg"
                      checked={mergedConfig.background.type === 'transparent'}
                      onChange={(e) => handleChange('background', e.target.checked ? { type: 'transparent' } : { type: 'solid', color: '#FFFFFF' })}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="transparentBg" className="text-sm text-gray-700">Transparent background</label>
                  </div>
                  {mergedConfig.background.type !== 'transparent' && (
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={mergedConfig.background.color || '#FFFFFF'}
                        onChange={(e) => handleChange('background', { type: 'solid', color: e.target.value })}
                        className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={mergedConfig.background.color || '#FFFFFF'}
                        onChange={(e) => handleChange('background', { type: 'solid', color: e.target.value })}
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* ======================= EYES (CORNERS) TAB ======================= */}
            <TabsContent value="corners" className="space-y-6 mt-6">
              {/* Finder Frame Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Finder Frame Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {FINDER_STYLES.map((style) => (
                    <button
                      key={style.value} type="button"
                      onClick={() => handleChange('finder', style.value)}
                      className={`p-2 rounded-lg border-2 text-xs font-medium transition-all ${
                        mergedConfig.finder === style.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Finder Dot Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Finder Dot Style</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {FINDER_DOT_STYLES.map((style) => (
                    <button
                      key={style.value} type="button"
                      onClick={() => handleChange('finderDot', style.value)}
                      className={`p-2 rounded-lg border-2 text-xs font-medium transition-all ${
                        mergedConfig.finderDot === style.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* ======================= LOGO TAB ======================= */}
            <TabsContent value="logo" className="space-y-6 mt-6">
              {/* Logo Type Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo Source</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['preset', 'custom'] as const).map((type) => (
                    <button key={type} type="button"
                      onClick={() => {
                        if (type === 'custom') {
                          handleChange('logo', { ...mergedConfig.logo, logoType: 'custom' })
                        } else {
                          handleChange('logo', { ...mergedConfig.logo, logoType: 'preset', url: mergedConfig.logo?.url || '' })
                        }
                      }}
                      className={`p-2 rounded-lg border-2 text-sm font-medium capitalize transition-all ${
                        (mergedConfig.logo?.logoType || 'preset') === type
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >{type === 'preset' ? 'Preset Logo' : 'Your Logo'}</button>
                  ))}
                </div>
              </div>

              {/* Preset Logo Picker */}
              {(mergedConfig.logo?.logoType || 'preset') === 'preset' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Preset</label>
                  <div className="grid grid-cols-6 gap-2 max-h-[300px] overflow-y-auto p-1">
                    {/* None option */}
                    <button type="button"
                      onClick={() => handleChange('logo', undefined)}
                      className={`aspect-square rounded-lg border-2 flex items-center justify-center text-xs transition-all ${
                        !mergedConfig.logo?.url
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >None</button>
                    {PRESET_LOGOS.map((logo) => (
                      <button key={logo.value} type="button"
                        onClick={() => {
                          const logoUrl = `/images/logos/${logo.value}.png`
                          handleChange('logo', {
                            url: logoUrl,
                            logoType: 'preset' as const,
                            size: mergedConfig.logo?.size || 0.2,
                            margin: mergedConfig.logo?.margin || 1,
                            shape: mergedConfig.logo?.shape || 'circle',
                            positionX: mergedConfig.logo?.positionX ?? 0.5,
                            positionY: mergedConfig.logo?.positionY ?? 0.5,
                            rotate: mergedConfig.logo?.rotate ?? 0,
                            backgroundEnabled: mergedConfig.logo?.backgroundEnabled ?? true,
                            backgroundFill: mergedConfig.logo?.backgroundFill || '#ffffff',
                            backgroundScale: mergedConfig.logo?.backgroundScale ?? 1.3,
                            backgroundShape: mergedConfig.logo?.backgroundShape || 'circle',
                          })
                          if (mergedConfig.errorCorrectionLevel !== 'H') {
                            handleChange('errorCorrectionLevel', 'H')
                          }
                        }}
                        title={logo.label}
                        className={`aspect-square rounded-lg border-2 flex items-center justify-center p-1 transition-all ${
                          mergedConfig.logo?.url?.includes(logo.value)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-[10px] text-center leading-tight truncate">{logo.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Logo Upload */}
              {(mergedConfig.logo?.logoType) === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Upload Logo</label>
                  <LogoUpload
                    value={mergedConfig.logo?.url ?? null}
                    onChange={(url) => {
                      if (url) {
                        handleChange('logo', {
                          url,
                          logoType: 'custom' as const,
                          size: mergedConfig.logo?.size || 0.2,
                          margin: mergedConfig.logo?.margin || 1,
                          shape: mergedConfig.logo?.shape || 'circle',
                          positionX: mergedConfig.logo?.positionX ?? 0.5,
                          positionY: mergedConfig.logo?.positionY ?? 0.5,
                          rotate: mergedConfig.logo?.rotate ?? 0,
                          backgroundEnabled: mergedConfig.logo?.backgroundEnabled ?? true,
                          backgroundFill: mergedConfig.logo?.backgroundFill || '#ffffff',
                          backgroundScale: mergedConfig.logo?.backgroundScale ?? 1.3,
                          backgroundShape: mergedConfig.logo?.backgroundShape || 'circle',
                        })
                        if (mergedConfig.errorCorrectionLevel !== 'H') {
                          handleChange('errorCorrectionLevel', 'H')
                        }
                      } else {
                        handleChange('logo', undefined)
                      }
                    }}
                  />
                </div>
              )}

              {mergedConfig.logo?.url && (
                <>
                  {/* Logo Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo Size: {Math.round((mergedConfig.logo.size || 0.2) * 100)}%
                    </label>
                    <input type="range" min="0.05" max="1" step="0.01"
                      value={mergedConfig.logo.size || 0.2}
                      onChange={(e) => handleChange('logo', { ...mergedConfig.logo, size: parseFloat(e.target.value) })}
                      className="w-full accent-blue-500"
                    />
                  </div>

                  {/* Logo Position X */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horizontal Position: {Math.round((mergedConfig.logo.positionX ?? 0.5) * 100)}%
                    </label>
                    <input type="range" min="0" max="1" step="0.01"
                      value={mergedConfig.logo.positionX ?? 0.5}
                      onChange={(e) => handleChange('logo', { ...mergedConfig.logo, positionX: parseFloat(e.target.value) })}
                      className="w-full accent-blue-500"
                    />
                  </div>

                  {/* Logo Position Y */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vertical Position: {Math.round((mergedConfig.logo.positionY ?? 0.5) * 100)}%
                    </label>
                    <input type="range" min="0" max="1" step="0.01"
                      value={mergedConfig.logo.positionY ?? 0.5}
                      onChange={(e) => handleChange('logo', { ...mergedConfig.logo, positionY: parseFloat(e.target.value) })}
                      className="w-full accent-blue-500"
                    />
                  </div>

                  {/* Logo Rotation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rotation: {mergedConfig.logo.rotate ?? 0}°
                    </label>
                    <input type="range" min="0" max="360" step="1"
                      value={mergedConfig.logo.rotate ?? 0}
                      onChange={(e) => handleChange('logo', { ...mergedConfig.logo, rotate: parseInt(e.target.value) })}
                      className="w-full accent-blue-500"
                    />
                  </div>

                  {/* Logo Background Toggle */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="logoBackgroundEnabled"
                      checked={mergedConfig.logo.backgroundEnabled ?? true}
                      onChange={(e) => handleChange('logo', { ...mergedConfig.logo, backgroundEnabled: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 accent-blue-500"
                    />
                    <label htmlFor="logoBackgroundEnabled" className="text-sm font-medium text-gray-700">Show Logo Background</label>
                  </div>

                  {(mergedConfig.logo.backgroundEnabled ?? true) && (
                    <>
                      {/* Logo Background Shape */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Background Shape</label>
                        <div className="grid grid-cols-2 gap-2">
                          {(['circle', 'square'] as const).map((shape) => (
                            <button key={shape} type="button"
                              onClick={() => handleChange('logo', { ...mergedConfig.logo, backgroundShape: shape })}
                              className={`p-3 rounded-lg border-2 text-sm font-medium capitalize transition-all ${
                                (mergedConfig.logo?.backgroundShape || 'circle') === shape
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
                              }`}
                            >{shape}</button>
                          ))}
                        </div>
                      </div>

                      {/* Logo Background Color */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                        <input type="color"
                          value={mergedConfig.logo.backgroundFill || '#ffffff'}
                          onChange={(e) => handleChange('logo', { ...mergedConfig.logo, backgroundFill: e.target.value })}
                          className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                        />
                      </div>

                      {/* Logo Background Scale */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Background Size: {(mergedConfig.logo.backgroundScale ?? 1.3).toFixed(1)}x
                        </label>
                        <input type="range" min="0.3" max="2" step="0.1"
                          value={mergedConfig.logo.backgroundScale ?? 1.3}
                          onChange={(e) => handleChange('logo', { ...mergedConfig.logo, backgroundScale: parseFloat(e.target.value) })}
                          className="w-full accent-blue-500"
                        />
                      </div>
                    </>
                  )}
                </>
              )}
            </TabsContent>

            {/* ======================= OUTLINED SHAPES TAB ======================= */}
            <TabsContent value="shapes" className="space-y-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Outlined Shape</label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-[400px] overflow-y-auto pr-1">
                  {OUTLINED_SHAPES.map((shape) => (
                    <button
                      key={shape.value} type="button"
                      onClick={() => handleChange('shape', shape.value)}
                      className={`p-2 rounded-lg border-2 text-[10px] font-medium transition-all text-center ${
                        mergedConfig.shape === shape.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {shape.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame Color — shown when a shape is selected */}
              {mergedConfig.shape && mergedConfig.shape !== 'none' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frame Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={mergedConfig.frameColor || '#000000'}
                      onChange={(e) => handleChange('frameColor', e.target.value)}
                      className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={mergedConfig.frameColor || '#000000'}
                      onChange={(e) => handleChange('frameColor', e.target.value)}
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm font-mono"
                    />
                  </div>
                </div>
              )}
            </TabsContent>

            {/* ======================= STICKERS TAB ======================= */}
            <TabsContent value="stickers" className="space-y-6 mt-6">
              {/* Sticker Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Advanced Shape / Sticker</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ADVANCED_SHAPES.map((shape) => (
                    <button
                      key={shape.value} type="button"
                      onClick={() => handleChange('advancedShape', shape.value)}
                      className={`p-2 rounded-lg border-2 text-xs font-medium transition-all ${
                        mergedConfig.advancedShape === shape.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {shape.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sticker-specific controls */}
              {mergedConfig.advancedShape && mergedConfig.advancedShape !== 'none' && (
                <>
                  {/* Healthcare-specific */}
                  {mergedConfig.advancedShape === 'healthcare' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Frame Color</label>
                        <input type="color" value={mergedConfig.healthcareFrameColor || '#000000'}
                          onChange={(e) => handleChange('healthcareFrameColor', e.target.value)}
                          className="h-10 w-20 rounded border border-gray-300 cursor-pointer" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Heart Color</label>
                        <input type="color" value={mergedConfig.healthcareHeartColor || '#ff0000'}
                          onChange={(e) => handleChange('healthcareHeartColor', e.target.value)}
                          className="h-10 w-20 rounded border border-gray-300 cursor-pointer" />
                      </div>
                    </div>
                  )}

                  {/* Review Collector specific */}
                  {mergedConfig.advancedShape === 'review-collector' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Circle Color</label>
                        <input type="color" value={mergedConfig.reviewCollectorCircleColor || '#000000'}
                          onChange={(e) => handleChange('reviewCollectorCircleColor', e.target.value)}
                          className="h-10 w-20 rounded border border-gray-300 cursor-pointer" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Stars Color</label>
                        <input type="color" value={mergedConfig.reviewCollectorStarsColor || '#FFD700'}
                          onChange={(e) => handleChange('reviewCollectorStarsColor', e.target.value)}
                          className="h-10 w-20 rounded border border-gray-300 cursor-pointer" />
                      </div>
                    </div>
                  )}

                  {/* Coupon specific */}
                  {mergedConfig.advancedShape === 'coupon' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Left Color</label>
                          <input type="color" value={mergedConfig.couponLeftColor || '#1c57cb'}
                            onChange={(e) => handleChange('couponLeftColor', e.target.value)}
                            className="h-10 w-full rounded border border-gray-300 cursor-pointer" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Right Color</label>
                          <input type="color" value={mergedConfig.couponRightColor || '#1c57cb'}
                            onChange={(e) => handleChange('couponRightColor', e.target.value)}
                            className="h-10 w-full rounded border border-gray-300 cursor-pointer" />
                        </div>
                      </div>
                      <Input placeholder="Coupon Line 1" value={mergedConfig.couponTextLine1 || ''}
                        onChange={(e) => handleChange('couponTextLine1', e.target.value)} />
                      <Input placeholder="Coupon Line 2" value={mergedConfig.couponTextLine2 || ''}
                        onChange={(e) => handleChange('couponTextLine2', e.target.value)} />
                      <Input placeholder="Coupon Line 3" value={mergedConfig.couponTextLine3 || ''}
                        onChange={(e) => handleChange('couponTextLine3', e.target.value)} />
                    </div>
                  )}

                  {/* Rect-frame / Four-corners specific */}
                  {(mergedConfig.advancedShape?.startsWith('rect-frame') || mergedConfig.advancedShape?.startsWith('four-corners')) && (
                    <div>
                      {mergedConfig.advancedShape?.startsWith('rect-frame') ? (
                        <div className="flex items-center gap-3">
                          <input type="checkbox" id="dropShadow"
                            checked={mergedConfig.advancedShapeDropShadow}
                            onChange={(e) => handleChange('advancedShapeDropShadow', e.target.checked)}
                            className="rounded border-gray-300" />
                          <label htmlFor="dropShadow" className="text-sm text-gray-700">Drop Shadow</label>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Frame Color</label>
                          <input type="color" value={mergedConfig.advancedShapeFrameColor || '#000000'}
                            onChange={(e) => handleChange('advancedShapeFrameColor', e.target.value)}
                            className="h-10 w-20 rounded border border-gray-300 cursor-pointer" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Text controls (for stickers that have text, except coupon which has its own) */}
                  {currentSticker?.hasText && mergedConfig.advancedShape !== 'coupon' && (
                    <div className="space-y-3 border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-semibold text-gray-900">Sticker Text</h4>
                      <Input placeholder="Text (e.g., SCAN ME)" value={mergedConfig.text || 'SCAN ME'}
                        onChange={(e) => handleChange('text', e.target.value)} />
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Text Color</label>
                          <input type="color" value={mergedConfig.textColor || '#ffffff'}
                            onChange={(e) => handleChange('textColor', e.target.value)}
                            className="h-8 w-full rounded border border-gray-300 cursor-pointer" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Background</label>
                          <input type="color" value={mergedConfig.textBackgroundColor || '#1c57cb'}
                            onChange={(e) => handleChange('textBackgroundColor', e.target.value)}
                            className="h-8 w-full rounded border border-gray-300 cursor-pointer" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Text Size: {mergedConfig.textSize || 1}x
                        </label>
                        <input type="range" min="0.5" max="3" step="0.1"
                          value={mergedConfig.textSize || 1}
                          onChange={(e) => handleChange('textSize', parseFloat(e.target.value))}
                          className="w-full accent-blue-500" />
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            {/* ======================= AI TAB ======================= */}
            <TabsContent value="ai" className="space-y-6 mt-6">
              {/* AI Enable Toggle */}
              <div className="flex items-center gap-3 p-4 rounded-lg border border-purple-200 bg-purple-50">
                <input
                  type="checkbox"
                  id="aiEnabled"
                  checked={mergedConfig.isAi || false}
                  onChange={(e) => handleChange('isAi', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 accent-purple-600"
                />
                <label htmlFor="aiEnabled" className="text-sm font-medium text-purple-800">
                  <Wand2 className="w-4 h-4 inline mr-1" />
                  Enable AI-Enhanced QR Design
                </label>
              </div>

              {mergedConfig.isAi && (
                <>
                  {/* AI Prompt */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">AI Image Prompt</label>
                    <textarea
                      value={mergedConfig.aiPrompt || ''}
                      onChange={(e) => handleChange('aiPrompt', e.target.value)}
                      placeholder="Describe the image you want (e.g., 'a beautiful sunset over mountains')"
                      rows={4}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* AI Strength */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      QR Strength: {(mergedConfig.aiStrength ?? 1.8).toFixed(1)}
                    </label>
                    <p className="text-xs text-gray-500 mb-2">Lower = more artistic, Higher = better scanability</p>
                    <input type="range" min="0.1" max="3" step="0.1"
                      value={mergedConfig.aiStrength ?? 1.8}
                      onChange={(e) => handleChange('aiStrength', parseFloat(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Artistic</span>
                      <span>Scannable</span>
                    </div>
                  </div>

                  {/* AI Steps */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Generation Steps: {mergedConfig.aiSteps ?? 18}
                    </label>
                    <p className="text-xs text-gray-500 mb-2">More steps = higher quality but slower</p>
                    <input type="range" min="10" max="20" step="1"
                      value={mergedConfig.aiSteps ?? 18}
                      onChange={(e) => handleChange('aiSteps', parseInt(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>10 (Fast)</span>
                      <span>20 (Quality)</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <p className="text-xs text-yellow-700">
                      💡 AI generation will run when you save/download. The QR code will be processed server-side.
                    </p>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Live Preview (sticky sidebar) */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6 sticky top-6">
            <div className="flex flex-col items-center gap-4">
              {previewData ? (
                <BackendQRPreview
                  ref={previewRef}
                  data={previewData}
                  qrType={qrType}
                  config={design}
                  className="w-full max-w-[280px] mx-auto"
                />
              ) : (
                <div className="w-[280px] h-[280px] bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="text-5xl mb-2">⊞</div>
                    <p className="text-sm">No data to preview</p>
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-500 text-center">Scan with your phone to test</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
