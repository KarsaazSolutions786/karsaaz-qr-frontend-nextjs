'use client'

import { useState, useRef, useMemo } from 'react'
import { QRCodePreview, QRCodePreviewRef } from '@/components/qr/QRCodePreview'
import { GradientBuilder } from '@/components/ui/GradientBuilder'
import { LogoUpload } from '@/components/qr/LogoUpload'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { encodeQRData } from '@/lib/utils/qr-data-encoder'
import {
  DesignerConfig,
  DEFAULT_DESIGNER_CONFIG,
  DESIGN_PRESETS,
  ModuleShape,
  CornerFrameStyle,
  CornerDotStyle,
} from '@/types/entities/designer'
import {
  Palette,
  Image as ImageIcon,
  Sparkles,
  RotateCcw,
  Boxes,
  CircleDot,
} from 'lucide-react'

interface Step2DesignerProps {
  design: Partial<DesignerConfig>
  onChange: (design: Partial<DesignerConfig>) => void
  qrType: string
  qrData: Record<string, any>
}

const MODULE_SHAPES: { value: ModuleShape; label: string; icon: string }[] = [
  { value: 'square', label: 'Square', icon: '⬛' },
  { value: 'rounded', label: 'Rounded', icon: '🔲' },
  { value: 'dots', label: 'Dots', icon: '⚫' },
  { value: 'circular', label: 'Circular', icon: '🔵' },
  { value: 'diamond', label: 'Diamond', icon: '💎' },
  { value: 'classy', label: 'Classy', icon: '🔷' },
  { value: 'classy-rounded', label: 'Classy Rounded', icon: '🟦' },
]

const CORNER_FRAME_STYLES: { value: CornerFrameStyle; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'extra-rounded', label: 'Extra Rounded' },
  { value: 'circular', label: 'Circular' },
  { value: 'dot', label: 'Dot' },
]

const CORNER_DOT_STYLES: { value: CornerDotStyle; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'dot', label: 'Dot' },
]

export default function Step2Designer({
  design,
  onChange,
  qrType,
  qrData,
}: Step2DesignerProps) {
  const [activeTab, setActiveTab] = useState('shape')
  const previewRef = useRef<QRCodePreviewRef>(null)

  // Merge with defaults for preview
  const mergedConfig: DesignerConfig = useMemo(
    () => ({
      ...DEFAULT_DESIGNER_CONFIG,
      ...design,
    }),
    [design]
  )

  // Encode QR data for live preview
  const previewData = encodeQRData(qrType, qrData)

  const handleChange = (field: string, value: any) => {
    onChange({ ...design, [field]: value })
  }

  const applyPreset = (preset: typeof DESIGN_PRESETS[0]) => {
    onChange({ ...design, ...preset.config })
  }

  const resetToDefaults = () => {
    onChange({
      ...DEFAULT_DESIGNER_CONFIG,
    })
  }

  return (
    <div className="space-y-6">
      {/* Design Presets */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Quick Presets
        </h3>
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
                <div
                  className="w-12 h-12 rounded border-2"
                  style={{
                    backgroundColor: presetBg,
                    borderColor: presetColor,
                  }}
                >
                  <div
                    className="w-full h-full flex items-center justify-center text-lg"
                    style={{ color: presetColor }}
                  >
                    ⊞
                  </div>
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
            <h3 className="text-lg font-semibold text-gray-900">
              Customize Design
            </h3>
            <Button
              onClick={resetToDefaults}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="shape" className="gap-1 text-xs sm:text-sm">
                <Boxes className="w-4 h-4" />
                Shape
              </TabsTrigger>
              <TabsTrigger value="fill" className="gap-1 text-xs sm:text-sm">
                <Palette className="w-4 h-4" />
                Fill
              </TabsTrigger>
              <TabsTrigger value="corners" className="gap-1 text-xs sm:text-sm">
                <CircleDot className="w-4 h-4" />
                Corners
              </TabsTrigger>
              <TabsTrigger value="logo" className="gap-1 text-xs sm:text-sm">
                <ImageIcon className="w-4 h-4" />
                Logo
              </TabsTrigger>
            </TabsList>

            {/* Shape Tab */}
            <TabsContent value="shape" className="space-y-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Module Pattern
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {MODULE_SHAPES.map((shape) => (
                    <button
                      key={shape.value}
                      type="button"
                      onClick={() => handleChange('moduleShape', shape.value)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                        mergedConfig.moduleShape === shape.value
                          ? 'border-blue-500 bg-blue-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-xl">{shape.icon}</span>
                      <span className="text-xs font-medium text-gray-700">{shape.label}</span>
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
                  type="range"
                  min="200"
                  max="2000"
                  step="50"
                  value={mergedConfig.size}
                  onChange={(e) => handleChange('size', parseInt(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>200px</span>
                  <span>2000px</span>
                </div>
              </div>

              {/* Margin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Margin (Quiet Zone): {mergedConfig.margin} modules
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={mergedConfig.margin}
                  onChange={(e) => handleChange('margin', parseInt(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              {/* Error Correction */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Error Correction Level
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['L', 'M', 'Q', 'H'] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
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
                <p className="text-xs text-gray-500 mt-1">
                  Higher levels allow more damage tolerance but increase QR density. Use H when adding a logo.
                </p>
              </div>
            </TabsContent>

            {/* Fill Tab */}
            <TabsContent value="fill" className="space-y-6 mt-6">
              {/* Foreground Fill */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Foreground Color
                </label>
                {mergedConfig.foregroundFill.type === 'solid' ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={(mergedConfig.foregroundFill as any).color || '#000000'}
                      onChange={(e) =>
                        handleChange('foregroundFill', {
                          type: 'solid',
                          color: e.target.value,
                        })
                      }
                      className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={(mergedConfig.foregroundFill as any).color || '#000000'}
                      onChange={(e) =>
                        handleChange('foregroundFill', {
                          type: 'solid',
                          color: e.target.value,
                        })
                      }
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm font-mono"
                      placeholder="#000000"
                    />
                  </div>
                ) : null}
                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      if (mergedConfig.foregroundFill.type === 'solid') {
                        handleChange('foregroundFill', {
                          type: 'gradient',
                          gradientType: 'linear',
                          startColor: (mergedConfig.foregroundFill as any).color || '#000000',
                          endColor: '#333333',
                          rotation: 45,
                        })
                      } else {
                        handleChange('foregroundFill', {
                          type: 'solid',
                          color: '#000000',
                        })
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
                          type: 'gradient',
                          gradientType: gradient.type,
                          startColor: gradient.startColor,
                          endColor: gradient.endColor,
                          rotation: gradient.rotation,
                        })
                      }
                    />
                  </div>
                )}
              </div>

              {/* Background */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Background
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="transparentBg"
                      checked={mergedConfig.background.type === 'transparent'}
                      onChange={(e) =>
                        handleChange(
                          'background',
                          e.target.checked
                            ? { type: 'transparent' }
                            : { type: 'solid', color: '#FFFFFF' }
                        )
                      }
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="transparentBg" className="text-sm text-gray-700">
                      Transparent background
                    </label>
                  </div>

                  {mergedConfig.background.type !== 'transparent' && (
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={mergedConfig.background.color || '#FFFFFF'}
                        onChange={(e) =>
                          handleChange('background', {
                            type: 'solid',
                            color: e.target.value,
                          })
                        }
                        className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={mergedConfig.background.color || '#FFFFFF'}
                        onChange={(e) =>
                          handleChange('background', {
                            type: 'solid',
                            color: e.target.value,
                          })
                        }
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm font-mono"
                        placeholder="#FFFFFF"
                      />
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Corners Tab */}
            <TabsContent value="corners" className="space-y-6 mt-6">
              {/* Corner Frame Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Corner Frame Style
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {CORNER_FRAME_STYLES.map((style) => (
                    <button
                      key={style.value}
                      type="button"
                      onClick={() => handleChange('cornerFrameStyle', style.value)}
                      className={`p-2 rounded-lg border-2 text-xs font-medium transition-all ${
                        mergedConfig.cornerFrameStyle === style.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Corner Dot Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Corner Dot Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {CORNER_DOT_STYLES.map((style) => (
                    <button
                      key={style.value}
                      type="button"
                      onClick={() => handleChange('cornerDotStyle', style.value)}
                      className={`p-2 rounded-lg border-2 text-xs font-medium transition-all ${
                        mergedConfig.cornerDotStyle === style.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Outline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Outline
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="outlineEnabled"
                      checked={mergedConfig.outline?.enabled || false}
                      onChange={(e) =>
                        handleChange('outline', {
                          enabled: e.target.checked,
                          color: mergedConfig.outline?.color || '#000000',
                          width: mergedConfig.outline?.width || 1,
                        })
                      }
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="outlineEnabled" className="text-sm text-gray-700">
                      Add outline to modules
                    </label>
                  </div>

                  {mergedConfig.outline?.enabled && (
                    <div className="flex items-center gap-3 pl-6">
                      <input
                        type="color"
                        value={mergedConfig.outline.color || '#000000'}
                        onChange={(e) =>
                          handleChange('outline', {
                            ...mergedConfig.outline,
                            color: e.target.value,
                          })
                        }
                        className="h-8 w-14 rounded border border-gray-300 cursor-pointer"
                      />
                      <div className="flex-1">
                        <label className="text-xs text-gray-500">
                          Width: {mergedConfig.outline.width || 1}px
                        </label>
                        <input
                          type="range"
                          min="0.5"
                          max="3"
                          step="0.5"
                          value={mergedConfig.outline.width || 1}
                          onChange={(e) =>
                            handleChange('outline', {
                              ...mergedConfig.outline,
                              width: parseFloat(e.target.value),
                            })
                          }
                          className="w-full accent-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Logo Tab */}
            <TabsContent value="logo" className="space-y-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload Logo
                </label>
                <LogoUpload
                  value={mergedConfig.logo?.url ?? null}
                  onChange={(url) => {
                    if (url) {
                      handleChange('logo', {
                        ...mergedConfig.logo,
                        url,
                        size: mergedConfig.logo?.size || 0.2,
                        margin: mergedConfig.logo?.margin || 1,
                        shape: mergedConfig.logo?.shape || 'square',
                      })
                      // Auto-switch to H error correction for logo visibility
                      if (mergedConfig.errorCorrectionLevel !== 'H') {
                        handleChange('errorCorrectionLevel', 'H')
                      }
                    } else {
                      handleChange('logo', undefined)
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Tip: Error correction is automatically set to High when using a logo.
                </p>
              </div>

              {mergedConfig.logo?.url && (
                <>
                  {/* Logo Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo Size: {Math.round((mergedConfig.logo.size || 0.2) * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="0.4"
                      step="0.02"
                      value={mergedConfig.logo.size || 0.2}
                      onChange={(e) =>
                        handleChange('logo', {
                          ...mergedConfig.logo,
                          size: parseFloat(e.target.value),
                        })
                      }
                      className="w-full accent-blue-500"
                    />
                  </div>

                  {/* Logo Shape */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo Shape
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['square', 'circle'] as const).map((shape) => (
                        <button
                          key={shape}
                          type="button"
                          onClick={() =>
                            handleChange('logo', {
                              ...mergedConfig.logo,
                              shape,
                            })
                          }
                          className={`p-3 rounded-lg border-2 text-sm font-medium capitalize transition-all ${
                            mergedConfig.logo?.shape === shape
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          {shape}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Logo Margin */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo Padding: {mergedConfig.logo.margin || 1} modules
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="4"
                      value={mergedConfig.logo.margin || 1}
                      onChange={(e) =>
                        handleChange('logo', {
                          ...mergedConfig.logo,
                          margin: parseInt(e.target.value),
                        })
                      }
                      className="w-full accent-blue-500"
                    />
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Live Preview (sticky sidebar) */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Live Preview
          </h3>
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6 sticky top-6">
            <div className="flex flex-col items-center gap-4">
              {previewData ? (
                <QRCodePreview
                  ref={previewRef}
                  data={previewData}
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
              <p className="text-xs text-gray-500 text-center">
                Scan with your phone to test
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
