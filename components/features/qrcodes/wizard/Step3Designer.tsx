'use client'

import { useState } from 'react'
import { QRCodeCustomizer } from '@/components/features/qrcodes/QRCodeCustomizer'
import { QRCodePreview } from '@/components/features/qrcodes/QRCodePreview'
import { GradientBuilder } from '@/components/ui/GradientBuilder'
import { LogoUpload } from '@/components/qr/LogoUpload'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Palette, Image as ImageIcon, Sparkles, RotateCcw } from 'lucide-react'

interface Step3DesignerProps {
  design: any
  onChange: (design: any) => void
  qrData: any
  qrType: string
}

const DESIGN_PRESETS = [
  {
    id: 'classic',
    name: 'Classic',
    design: {
      foregroundColor: '#000000',
      backgroundColor: '#FFFFFF',
      style: 'squares',
    },
  },
  {
    id: 'modern',
    name: 'Modern',
    design: {
      foregroundColor: '#3b82f6',
      backgroundColor: '#f0f9ff',
      style: 'rounded',
    },
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    design: {
      foregroundColor: '#ec4899',
      backgroundColor: '#fdf2f8',
      style: 'dots',
    },
  },
  {
    id: 'professional',
    name: 'Professional',
    design: {
      foregroundColor: '#1f2937',
      backgroundColor: '#f9fafb',
      style: 'rounded',
    },
  },
]

export default function Step3Designer({
  design,
  onChange,
  qrData,
  qrType,
}: Step3DesignerProps) {
  const [activeTab, setActiveTab] = useState('basic')

  const handleChange = (field: string, value: any) => {
    onChange({ ...design, [field]: value })
  }

  const applyPreset = (preset: typeof DESIGN_PRESETS[0]) => {
    onChange({ ...design, ...preset.design })
  }

  const resetToDefaults = () => {
    onChange({
      foregroundColor: '#000000',
      backgroundColor: '#FFFFFF',
      style: 'squares',
      size: 500,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Design Your QR Code
        </h2>
        <p className="text-gray-600">
          Customize colors, patterns, and add your logo
        </p>
      </div>

      {/* Design Presets */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Quick Presets
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DESIGN_PRESETS.map((preset) => (
            <Button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              variant="outline"
              className="h-auto py-3 flex flex-col items-center gap-2"
            >
              <div
                className="w-12 h-12 rounded border-2"
                style={{
                  backgroundColor: preset.design.backgroundColor,
                  borderColor: preset.design.foregroundColor,
                }}
              />
              <span className="text-sm">{preset.name}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Design Controls */}
        <div>
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic" className="gap-2">
                <Palette className="w-4 h-4" />
                Basic
              </TabsTrigger>
              <TabsTrigger value="advanced" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Advanced
              </TabsTrigger>
              <TabsTrigger value="logo" className="gap-2">
                <ImageIcon className="w-4 h-4" />
                Logo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6 mt-6">
              {/* Basic Customizer */}
              <QRCodeCustomizer customization={design} onChange={onChange} />
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6 mt-6">
              {/* Gradient Builder */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Foreground Gradient
                </label>
                <GradientBuilder
                  value={design.foregroundGradient}
                  onChange={(gradient) => handleChange('foregroundGradient', gradient)}
                />
              </div>

              {/* Background Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Background
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="transparentBg"
                      checked={design.transparentBackground || false}
                      onChange={(e) =>
                        handleChange('transparentBackground', e.target.checked)
                      }
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="transparentBg" className="text-sm text-gray-700">
                      Transparent background
                    </label>
                  </div>
                </div>
              </div>

              {/* Corner Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Corner Style
                </label>
                <select
                  value={design.cornerStyle || 'square'}
                  onChange={(e) => handleChange('cornerStyle', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="square">Square</option>
                  <option value="extra-rounded">Extra Rounded</option>
                  <option value="dot">Dot</option>
                </select>
              </div>
            </TabsContent>

            <TabsContent value="logo" className="space-y-6 mt-6">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload Logo
                </label>
                <LogoUpload
                  value={design.logoUrl ?? null}
                  onChange={(url) => handleChange('logoUrl', url)}
                />
              </div>

              {design.logoUrl && (
                <>
                  {/* Logo Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo Size: {design.logoSize || 20}%
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="40"
                      value={design.logoSize || 20}
                      onChange={(e) =>
                        handleChange('logoSize', parseInt(e.target.value))
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Logo Padding */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo Padding
                    </label>
                    <input
                      type="checkbox"
                      id="logoPadding"
                      checked={design.logoPadding !== false}
                      onChange={(e) =>
                        handleChange('logoPadding', e.target.checked)
                      }
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="logoPadding" className="ml-2 text-sm text-gray-700">
                      Add white padding around logo
                    </label>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Live Preview */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Live Preview
          </h3>
          <div className="bg-white rounded-lg border-2 border-gray-200 p-8 sticky top-6">
            <div className="flex flex-col items-center gap-6">
              <QRCodePreview
                qrcode={{
                  id: '',
                  userId: '',
                  name: '',
                  type: qrType as any,
                  data: qrData ?? {},
                  customization: { foregroundColor: design?.foregroundColor ?? '#000000', backgroundColor: design?.backgroundColor ?? '#FFFFFF', style: design?.style ?? 'squares', size: 256, logoUrl: design?.logoUrl },
                  createdAt: '',
                  updatedAt: '',
                  scans: 0,
                }}
                size={256}
              />
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Scan this QR code with your phone to test it
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
