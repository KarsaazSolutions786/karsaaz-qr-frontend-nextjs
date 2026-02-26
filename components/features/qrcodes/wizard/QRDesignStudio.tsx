'use client'

import { useState, useRef, useMemo, useCallback } from 'react'
import { BackendQRPreview, BackendQRPreviewRef } from '@/components/qr/BackendQRPreview'
import { LogoUpload } from '@/components/qr/LogoUpload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { DesignerConfig, DEFAULT_DESIGNER_CONFIG } from '@/types/entities/designer'
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
  Sparkles,
  Sticker,
  Download,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Wand2,
  Loader2,
  Upload,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface QRDesignStudioProps {
  qrType: string
  qrTypeLabel?: string
  qrData: Record<string, any>
  design: Partial<DesignerConfig>
  onChange: (design: Partial<DesignerConfig>) => void
  settings: {
    name: string
    folderId: string | null
    pinProtected: boolean
    pin: string | null
    hasExpiration: boolean
    expiresAt: string | null
    tags: string[]
  }
  onSettingsChange: (settings: any) => void
  onBack?: () => void
  isSaving?: boolean
  isSaved?: boolean
}

type TabId = 'color' | 'look' | 'sticker' | 'download'

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'color', label: 'Select color', icon: <Palette className="w-4 h-4" /> },
  { id: 'look', label: 'Look & Feel', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'sticker', label: 'Sticker', icon: <Sticker className="w-4 h-4" /> },
  { id: 'download', label: 'Download', icon: <Download className="w-4 h-4" /> },
]

const PRESET_COLORS = ['#FF0000', '#8B5CF6', '#10B981', '#FFFFFF']

const SIZE_OPTIONS = [
  { value: '600x600', label: '600×600' },
  { value: '1200x1200', label: '1200×1200' },
  { value: '1200x2000', label: '1200×2000' },
  { value: '2000x2000', label: '2000×2000' },
]

const FORMAT_OPTIONS = [
  { value: 'png', label: 'PNG' },
  { value: 'svg', label: 'SVG' },
  { value: 'pdf', label: 'PDF' },
]

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

// Review Collector preset logos
const REVIEW_COLLECTOR_LOGOS = [
  'airbnb', 'ebay', 'linkedin', 'tripadvisor', 'yelp', 'aliexpress',
  'facebook', 'pinterest', 'trustpilot', 'amazon', 'foursquare', 'skype',
  'twitch', 'youtube', 'appstore', 'google-maps', 'snapchat', 'twitter',
  'zoom', 'bitcoin', 'google', 'telegram', 'wechat', 'booking',
  'googleplay', 'tiktok', 'whatsapp', 'discord', 'instagram', 'trendyol',
]

export default function QRDesignStudio({
  qrType,
  qrTypeLabel,
  qrData,
  design,
  onChange,
  settings,
  onSettingsChange,
  onBack,
  isSaving,
  isSaved,
}: QRDesignStudioProps) {
  const previewRef = useRef<BackendQRPreviewRef>(null)
  const [activeTab, setActiveTab] = useState<TabId>('color')
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    qrColor: true,
    lookFeel: true,
    sticker: true,
    download: true,
  })
  const [showAllModules, setShowAllModules] = useState(false)
  const [showAllFinders, setShowAllFinders] = useState(false)
  const [showAllFinderDots, setShowAllFinderDots] = useState(false)
  const [showAllShapes, setShowAllShapes] = useState(false)
  const [downloadFormat, setDownloadFormat] = useState('png')
  const [downloadSize, setDownloadSize] = useState('1200x2000')
  const [isDownloading, setIsDownloading] = useState(false)

  const mergedConfig = useMemo(() => ({ ...DEFAULT_DESIGNER_CONFIG, ...design }), [design])

  const hasPreviewData =
    Object.keys(qrData).length > 0 &&
    Object.values(qrData).some(v => v !== '' && v !== null && v !== undefined)

  const handleChange = (field: string, value: any) => {
    onChange({ ...design, [field]: value })
  }

  const handleLogoChange = (logoUpdates: Partial<DesignerConfig['logo']>) => {
    onChange({
      ...design,
      logo: {
        ...mergedConfig.logo,
        ...logoUpdates,
      } as DesignerConfig['logo'],
    })
  }

  const handleSettingsChange = (field: string, value: any) => {
    onSettingsChange({ ...settings, [field]: value })
  }

  const resetToDefaults = () => {
    onChange({ ...DEFAULT_DESIGNER_CONFIG })
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const handleDownload = useCallback(async () => {
    if (!previewRef.current) return
    setIsDownloading(true)

    try {
      const filename = settings.name || `qr-code-${qrType}`
      const svgStr = previewRef.current.getSVG()
      if (!svgStr) throw new Error('No QR code preview available')

      if (downloadFormat === 'svg') {
        const blob = new Blob([svgStr], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${filename}.svg`
        a.click()
        URL.revokeObjectURL(url)
      } else if (downloadFormat === 'png') {
        const dataURL = previewRef.current.getDataURL()
        if (!dataURL) throw new Error('Cannot generate data URL')
        const [width, height] = downloadSize.split('x').map(Number) as [number, number]
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height)
            canvas.toBlob(blob => {
              if (blob) {
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `${filename}.png`
                a.click()
                URL.revokeObjectURL(url)
              }
              setIsDownloading(false)
            }, 'image/png')
          }
        }
        img.onerror = () => setIsDownloading(false)
        img.src = dataURL
        return
      } else {
        const blob = new Blob([svgStr], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${filename}.${downloadFormat}`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setIsDownloading(false)
    }
  }, [settings.name, qrType, downloadFormat, downloadSize])

  // Color Picker with presets
  const ColorPickerWithPresets = ({
    label,
    value,
    onChange: onColorChange,
  }: {
    label: string
    value: string
    onChange: (c: string) => void
  }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center gap-1">
        {PRESET_COLORS.map(color => (
          <button
            key={color}
            type="button"
            onClick={() => onColorChange(color)}
            className={cn(
              'w-7 h-7 rounded border-2 transition-all',
              value === color ? 'border-purple-500 scale-110' : 'border-gray-300 hover:border-gray-400'
            )}
            style={{ backgroundColor: color }}
          />
        ))}
        <div className="relative ml-1">
          <input
            type="color"
            value={value}
            onChange={e => onColorChange(e.target.value)}
            className="absolute inset-0 opacity-0 w-14 h-7 cursor-pointer"
          />
          <button className="px-2 py-1 text-xs font-medium bg-gray-800 text-white rounded">
            RGB
          </button>
        </div>
      </div>
    </div>
  )

  // Section Card Component
  const SectionCard = ({
    title,
    sectionKey,
    children,
  }: {
    title: string
    sectionKey: string
    children: React.ReactNode
  }) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {expandedSections[sectionKey] && <div className="px-5 py-4 space-y-4">{children}</div>}
    </div>
  )

  // Shape Grid Component
  const ShapeGrid = ({
    items,
    selectedValue,
    onSelect,
    showAll,
    onToggleShowAll,
    maxVisible = 15,
  }: {
    items: { value: string; label: string; image?: string }[]
    selectedValue: string
    onSelect: (value: string) => void
    showAll: boolean
    onToggleShowAll: () => void
    maxVisible?: number
  }) => {
    const visibleItems = showAll ? items : items.slice(0, maxVisible)
    return (
      <div>
        <div className="grid grid-cols-6 gap-2">
          {visibleItems.map(item => (
            <button
              key={item.value}
              type="button"
              onClick={() => onSelect(item.value)}
              className={cn(
                'aspect-square rounded-lg border-2 flex items-center justify-center p-1.5 transition-all',
                selectedValue === item.value
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              )}
              title={item.label}
            >
              {item.image ? (
                <img src={item.image} alt={item.label} className="w-full h-full object-contain" />
              ) : (
                <span className="text-[8px] text-gray-500">{item.label}</span>
              )}
            </button>
          ))}
        </div>
        {items.length > maxVisible && (
          <button
            type="button"
            onClick={onToggleShowAll}
            className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            {showAll ? 'show less' : 'view all'}
          </button>
        )}
      </div>
    )
  }

  // Get current sticker for conditional controls
  const currentSticker = ADVANCED_SHAPES.find(s => s.value === mergedConfig.advancedShape)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {onBack && (
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <h1 className="text-lg font-bold text-gray-900 uppercase">{qrTypeLabel || qrType}</h1>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap',
                  activeTab === tab.id
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-3 space-y-4">
            {/* ==================== QR COLOR SECTION ==================== */}
            {(activeTab === 'color' || activeTab === 'look') && (
              <SectionCard title="QR Color" sectionKey="qrColor">
                {/* Fill Type */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Fill Type</span>
                  <select
                    value={
                      (mergedConfig.foregroundFill as any)?.type === 'gradient'
                        ? 'gradient'
                        : (mergedConfig.foregroundFill as any)?.type === 'foreground_image'
                          ? 'image'
                          : 'solid'
                    }
                    onChange={e => {
                      if (e.target.value === 'solid') {
                        handleChange('foregroundFill', { type: 'solid', color: '#000000' })
                      } else if (e.target.value === 'gradient') {
                        handleChange('foregroundFill', {
                          type: 'gradient',
                          gradientType: 'linear',
                          startColor: '#000000',
                          endColor: '#333333',
                          rotation: 45,
                        })
                      } else {
                        handleChange('foregroundFill', { type: 'foreground_image', imageUrl: '' })
                      }
                    }}
                    className="px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-full font-medium border-0 focus:ring-2 focus:ring-purple-300"
                  >
                    <option value="solid">Solid Color</option>
                    <option value="gradient">Gradient</option>
                    <option value="image">Image Fill</option>
                  </select>
                </div>

                {/* Solid Color Fill */}
                {(mergedConfig.foregroundFill as any)?.type === 'solid' && (
                  <ColorPickerWithPresets
                    label="Fill Color"
                    value={(mergedConfig.foregroundFill as any)?.color || '#000000'}
                    onChange={c => handleChange('foregroundFill', { type: 'solid', color: c })}
                  />
                )}

                {/* Gradient Controls */}
                {(mergedConfig.foregroundFill as any)?.type === 'gradient' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Gradient Type</span>
                      <select
                        value={(mergedConfig.foregroundFill as any).gradientType || 'linear'}
                        onChange={e =>
                          handleChange('foregroundFill', {
                            ...(mergedConfig.foregroundFill as any),
                            gradientType: e.target.value,
                          })
                        }
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
                      >
                        <option value="linear">Linear</option>
                        <option value="radial">Radial</option>
                      </select>
                    </div>
                    <ColorPickerWithPresets
                      label="Start Color"
                      value={(mergedConfig.foregroundFill as any).startColor || '#000000'}
                      onChange={c =>
                        handleChange('foregroundFill', {
                          ...(mergedConfig.foregroundFill as any),
                          startColor: c,
                        })
                      }
                    />
                    <ColorPickerWithPresets
                      label="End Color"
                      value={(mergedConfig.foregroundFill as any).endColor || '#333333'}
                      onChange={c =>
                        handleChange('foregroundFill', {
                          ...(mergedConfig.foregroundFill as any),
                          endColor: c,
                        })
                      }
                    />
                    {(mergedConfig.foregroundFill as any).gradientType === 'linear' && (
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Angle: {(mergedConfig.foregroundFill as any).rotation || 45}°
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={(mergedConfig.foregroundFill as any).rotation || 45}
                          onChange={e =>
                            handleChange('foregroundFill', {
                              ...(mergedConfig.foregroundFill as any),
                              rotation: parseInt(e.target.value),
                            })
                          }
                          className="w-full accent-purple-500"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Image Fill */}
                {(mergedConfig.foregroundFill as any)?.type === 'foreground_image' && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Foreground Image</label>

                    {!isSaved ? (
                      // Show message when QR is not saved yet
                      <div className="border-2 border-dashed border-yellow-300 rounded-lg p-4 bg-yellow-50">
                        <div className="flex items-start gap-3">
                          <div className="text-yellow-600 text-xl">⚠️</div>
                          <div>
                            <p className="text-sm font-medium text-yellow-800">Save QR Code First</p>
                            <p className="text-xs text-yellow-700 mt-1">
                              Image fill requires the QR code to be saved first. Click "Next" to save,
                              then you can upload a foreground image.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Show file upload when QR is saved
                      <>
                        <div
                          className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition hover:border-purple-400 hover:bg-purple-50"
                          onClick={() => document.getElementById('foreground-image-input')?.click()}
                        >
                          <input
                            id="foreground-image-input"
                            type="file"
                            accept="image/png,image/jpeg,image/jpg"
                            className="hidden"
                            onChange={e => {
                              const file = e.target.files?.[0]
                              if (file) {
                                // Convert to data URL for local preview
                                const reader = new FileReader()
                                reader.onload = ev => {
                                  const dataUrl = ev.target?.result as string
                                  handleChange('foregroundFill', {
                                    type: 'foreground_image',
                                    imageUrl: dataUrl,
                                  })
                                }
                                reader.readAsDataURL(file)
                              }
                            }}
                          />

                          {(mergedConfig.foregroundFill as any).imageUrl ? (
                            <div className="flex items-center justify-center gap-3">
                              <img
                                src={(mergedConfig.foregroundFill as any).imageUrl}
                                alt="Foreground preview"
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="text-left">
                                <p className="text-sm font-medium text-gray-900">Image selected</p>
                                <p className="text-xs text-gray-500">Click to replace</p>
                              </div>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">Click to upload image</p>
                              <p className="text-xs text-gray-400 mt-1">PNG, JPG (max 5MB)</p>
                            </>
                          )}
                        </div>

                        {/* Clear button */}
                        {(mergedConfig.foregroundFill as any).imageUrl && (
                          <button
                            type="button"
                            onClick={() =>
                              handleChange('foregroundFill', {
                                type: 'foreground_image',
                                imageUrl: '',
                              })
                            }
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            Remove image
                          </button>
                        )}

                        <p className="text-xs text-gray-500">
                          The image will be used as a pattern fill for the QR code modules.
                        </p>
                      </>
                    )}
                  </div>
                )}

                {/* Eye Colors */}
                <ColorPickerWithPresets
                  label="Eye External Color"
                  value={mergedConfig.eyeExternalColor || '#000000'}
                  onChange={c => handleChange('eyeExternalColor', c)}
                />
                <ColorPickerWithPresets
                  label="Eye Internal Color"
                  value={mergedConfig.eyeInternalColor || '#000000'}
                  onChange={c => handleChange('eyeInternalColor', c)}
                />

                {/* Background Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Background</span>
                  <Switch
                    checked={mergedConfig.background?.type !== 'transparent'}
                    onCheckedChange={checked =>
                      handleChange(
                        'background',
                        checked ? { type: 'solid', color: '#FFFFFF' } : { type: 'transparent' }
                      )
                    }
                  />
                </div>

                {/* Background Color */}
                {mergedConfig.background?.type !== 'transparent' && (
                  <ColorPickerWithPresets
                    label="Background Color"
                    value={mergedConfig.background?.color || '#FFFFFF'}
                    onChange={c => handleChange('background', { type: 'solid', color: c })}
                  />
                )}
              </SectionCard>
            )}

            {/* ==================== LOOK & FEEL SECTION ==================== */}
            {(activeTab === 'look' || activeTab === 'color') && (
              <SectionCard title="Look & Feel" sectionKey="lookFeel">
                {/* Module */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Module</label>
                  <ShapeGrid
                    items={MODULE_SHAPES}
                    selectedValue={mergedConfig.moduleShape || 'square'}
                    onSelect={value => handleChange('moduleShape', value)}
                    showAll={showAllModules}
                    onToggleShowAll={() => setShowAllModules(!showAllModules)}
                  />
                </div>

                {/* Finder */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Finder</label>
                  <ShapeGrid
                    items={FINDER_STYLES}
                    selectedValue={mergedConfig.finder || 'default'}
                    onSelect={value => handleChange('finder', value)}
                    showAll={showAllFinders}
                    onToggleShowAll={() => setShowAllFinders(!showAllFinders)}
                  />
                </div>

                {/* Finder Dot */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Finder Dot</label>
                  <ShapeGrid
                    items={FINDER_DOT_STYLES}
                    selectedValue={mergedConfig.finderDot || 'default'}
                    onSelect={value => handleChange('finderDot', value)}
                    showAll={showAllFinderDots}
                    onToggleShowAll={() => setShowAllFinderDots(!showAllFinderDots)}
                  />
                </div>

                {/* Shape (Outline) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shape</label>
                  <ShapeGrid
                    items={OUTLINED_SHAPES}
                    selectedValue={mergedConfig.shape || 'none'}
                    onSelect={value => handleChange('shape', value)}
                    showAll={showAllShapes}
                    onToggleShowAll={() => setShowAllShapes(!showAllShapes)}
                  />
                </div>

                {/* Frame Color */}
                {mergedConfig.shape && mergedConfig.shape !== 'none' && (
                  <ColorPickerWithPresets
                    label="Frame Color"
                    value={mergedConfig.frameColor || '#000000'}
                    onChange={c => handleChange('frameColor', c)}
                  />
                )}

                {/* Logo Type */}
                <div className="border-t border-gray-200 pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo Type</label>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="logoType"
                        checked={(mergedConfig.logo?.logoType || 'preset') === 'preset'}
                        onChange={() => handleLogoChange({ logoType: 'preset' })}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">Preset</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="logoType"
                        checked={mergedConfig.logo?.logoType === 'custom'}
                        onChange={() => handleLogoChange({ logoType: 'custom' })}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">Your logo</span>
                    </label>
                  </div>

                  {/* Preset Logos */}
                  {(mergedConfig.logo?.logoType || 'preset') === 'preset' && (
                    <div className="mt-3">
                      <div className="grid grid-cols-6 gap-2 max-h-[200px] overflow-y-auto">
                        {/* None option */}
                        <button
                          type="button"
                          onClick={() => handleLogoChange({ url: undefined })}
                          className={cn(
                            'aspect-square rounded-lg border-2 flex items-center justify-center text-xs transition-all',
                            !mergedConfig.logo?.url
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          )}
                        >
                          NONE
                        </button>
                        {PRESET_LOGOS.map(logo => (
                          <button
                            key={logo.value}
                            type="button"
                            onClick={() => {
                              // Use the backend's expected path for preset logos
                              const logoUrl = `/assets/images/png-logos/${logo.value}.png`
                              handleLogoChange({
                                url: logoUrl,
                                logoType: 'preset',
                                size: mergedConfig.logo?.size || 0.2,
                                positionX: mergedConfig.logo?.positionX ?? 0.5,
                                positionY: mergedConfig.logo?.positionY ?? 0.5,
                                rotate: mergedConfig.logo?.rotate ?? 0,
                                backgroundEnabled: mergedConfig.logo?.backgroundEnabled ?? true,
                                backgroundFill: mergedConfig.logo?.backgroundFill || '#ffffff',
                                backgroundScale: mergedConfig.logo?.backgroundScale ?? 1.3,
                                backgroundShape: mergedConfig.logo?.backgroundShape || 'circle',
                              })
                              // Auto-set error correction to H for better scanning with logo
                              if (mergedConfig.errorCorrectionLevel !== 'H') {
                                handleChange('errorCorrectionLevel', 'H')
                              }
                            }}
                            className={cn(
                              'aspect-square rounded-full border-2 p-1 transition-all overflow-hidden',
                              mergedConfig.logo?.url?.includes(logo.value)
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300'
                            )}
                            title={logo.label}
                          >
                            <img
                              src={`/images/logos/${logo.value}.png`}
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
                  {mergedConfig.logo?.logoType === 'custom' && (
                    <div className="mt-3">
                      <LogoUpload
                        value={mergedConfig.logo?.url ?? null}
                        onChange={url => {
                          if (url) {
                            // For custom logos, use logoType 'preset' with data URL
                            // The backend can load data URLs via file_get_contents
                            handleLogoChange({
                              url,
                              // Use 'preset' type so backend loads from URL/dataURL
                              logoType: 'preset',
                              size: mergedConfig.logo?.size || 0.2,
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
                            handleLogoChange({ url: undefined, logoType: 'custom' })
                          }
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Upload your logo (PNG, JPG). The logo will be embedded in the QR code.
                      </p>
                    </div>
                  )}

                  {/* Logo Customization Controls - Show when logo is selected */}
                  {mergedConfig.logo?.url && (
                    <div className="mt-4 space-y-4 border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-semibold text-gray-900">Logo Settings</h4>

                      {/* Logo Scale */}
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Logo Scale: {Math.round((mergedConfig.logo.size || 0.2) * 100)}%
                        </label>
                        <input
                          type="range"
                          min="0.05"
                          max="0.5"
                          step="0.01"
                          value={mergedConfig.logo.size || 0.2}
                          onChange={e => handleLogoChange({ size: parseFloat(e.target.value) })}
                          className="w-full accent-purple-500"
                        />
                      </div>

                      {/* Logo Position X */}
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Horizontal Position: {Math.round((mergedConfig.logo.positionX ?? 0.5) * 100)}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={mergedConfig.logo.positionX ?? 0.5}
                          onChange={e => handleLogoChange({ positionX: parseFloat(e.target.value) })}
                          className="w-full accent-purple-500"
                        />
                      </div>

                      {/* Logo Position Y */}
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Vertical Position: {Math.round((mergedConfig.logo.positionY ?? 0.5) * 100)}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={mergedConfig.logo.positionY ?? 0.5}
                          onChange={e => handleLogoChange({ positionY: parseFloat(e.target.value) })}
                          className="w-full accent-purple-500"
                        />
                      </div>

                      {/* Logo Rotation */}
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Rotation: {mergedConfig.logo.rotate ?? 0}°
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          step="1"
                          value={mergedConfig.logo.rotate ?? 0}
                          onChange={e => handleLogoChange({ rotate: parseInt(e.target.value) })}
                          className="w-full accent-purple-500"
                        />
                      </div>

                      {/* Logo Background Toggle */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Logo Background</span>
                        <Switch
                          checked={mergedConfig.logo.backgroundEnabled ?? true}
                          onCheckedChange={checked => handleLogoChange({ backgroundEnabled: checked })}
                        />
                      </div>

                      {/* Logo Background Options */}
                      {(mergedConfig.logo.backgroundEnabled ?? true) && (
                        <>
                          {/* Background Shape */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Background Shape</span>
                            <div className="flex gap-2">
                              {(['circle', 'square'] as const).map(shape => (
                                <button
                                  key={shape}
                                  type="button"
                                  onClick={() => handleLogoChange({ backgroundShape: shape })}
                                  className={cn(
                                    'px-3 py-1 text-sm rounded-lg border-2 capitalize transition-all',
                                    (mergedConfig.logo?.backgroundShape || 'circle') === shape
                                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                  )}
                                >
                                  {shape}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Background Color */}
                          <ColorPickerWithPresets
                            label="Background Color"
                            value={mergedConfig.logo.backgroundFill || '#ffffff'}
                            onChange={c => handleLogoChange({ backgroundFill: c })}
                          />

                          {/* Background Scale */}
                          <div>
                            <label className="block text-sm text-gray-700 mb-2">
                              Background Size: {(mergedConfig.logo.backgroundScale ?? 1.3).toFixed(1)}x
                            </label>
                            <input
                              type="range"
                              min="1"
                              max="2"
                              step="0.1"
                              value={mergedConfig.logo.backgroundScale ?? 1.3}
                              onChange={e =>
                                handleLogoChange({ backgroundScale: parseFloat(e.target.value) })
                              }
                              className="w-full accent-purple-500"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </SectionCard>
            )}

            {/* ==================== STICKER SECTION ==================== */}
            {(activeTab === 'sticker' || activeTab === 'look') && (
              <SectionCard title="Sticker" sectionKey="sticker">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Sticker</label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {ADVANCED_SHAPES.map(shape => (
                      <button
                        key={shape.value}
                        type="button"
                        onClick={() => handleChange('advancedShape', shape.value)}
                        className={cn(
                          'aspect-square rounded-lg border-2 p-1 transition-all',
                          mergedConfig.advancedShape === shape.value
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                        title={shape.label}
                      >
                        {shape.image ? (
                          <img src={shape.image} alt={shape.label} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-[8px] text-gray-500">{shape.label}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sticker-specific controls */}
                {mergedConfig.advancedShape && mergedConfig.advancedShape !== 'none' && (
                  <div className="space-y-4 border-t border-gray-200 pt-4">
                    {/* Dropshadow Toggle */}
                    {(mergedConfig.advancedShape?.startsWith('rect-frame') ||
                      mergedConfig.advancedShape?.includes('frame')) && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Dropshadow</span>
                        <Switch
                          checked={mergedConfig.advancedShapeDropShadow || false}
                          onCheckedChange={checked => handleChange('advancedShapeDropShadow', checked)}
                        />
                      </div>
                    )}

                    {/* Four-corners frame color */}
                    {mergedConfig.advancedShape?.startsWith('four-corners') && (
                      <ColorPickerWithPresets
                        label="Frame Color"
                        value={mergedConfig.advancedShapeFrameColor || '#000000'}
                        onChange={c => handleChange('advancedShapeFrameColor', c)}
                      />
                    )}

                    {/* Healthcare specific */}
                    {mergedConfig.advancedShape === 'healthcare' && (
                      <>
                        <ColorPickerWithPresets
                          label="Frame Color"
                          value={mergedConfig.healthcareFrameColor || '#000000'}
                          onChange={c => handleChange('healthcareFrameColor', c)}
                        />
                        <ColorPickerWithPresets
                          label="Heart Color"
                          value={mergedConfig.healthcareHeartColor || '#ff0000'}
                          onChange={c => handleChange('healthcareHeartColor', c)}
                        />
                      </>
                    )}

                    {/* Review Collector specific */}
                    {mergedConfig.advancedShape === 'review-collector' && (
                      <>
                        <ColorPickerWithPresets
                          label="Circle Color"
                          value={mergedConfig.reviewCollectorCircleColor || '#000000'}
                          onChange={c => handleChange('reviewCollectorCircleColor', c)}
                        />
                        <ColorPickerWithPresets
                          label="Stars Color"
                          value={mergedConfig.reviewCollectorStarsColor || '#FFD700'}
                          onChange={c => handleChange('reviewCollectorStarsColor', c)}
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Review Platform Logo
                          </label>
                          <div className="grid grid-cols-6 gap-2 max-h-[150px] overflow-y-auto">
                            {REVIEW_COLLECTOR_LOGOS.map(logo => (
                              <button
                                key={logo}
                                type="button"
                                onClick={() => handleChange('reviewCollectorLogoSrc', `/images/review-collector-logos/${logo}.png`)}
                                className={cn(
                                  'aspect-square rounded-lg border-2 p-1 transition-all',
                                  mergedConfig.reviewCollectorLogoSrc?.includes(logo)
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
                      </>
                    )}

                    {/* Coupon specific */}
                    {mergedConfig.advancedShape === 'coupon' && (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <ColorPickerWithPresets
                            label="Left Color"
                            value={mergedConfig.couponLeftColor || '#1c57cb'}
                            onChange={c => handleChange('couponLeftColor', c)}
                          />
                          <ColorPickerWithPresets
                            label="Right Color"
                            value={mergedConfig.couponRightColor || '#1c57cb'}
                            onChange={c => handleChange('couponRightColor', c)}
                          />
                        </div>
                        <Input
                          placeholder="Coupon Line 1 (e.g., EXCLUSIVE)"
                          value={mergedConfig.couponTextLine1 || ''}
                          onChange={e => handleChange('couponTextLine1', e.target.value)}
                        />
                        <Input
                          placeholder="Coupon Line 2 (e.g., OFFER)"
                          value={mergedConfig.couponTextLine2 || ''}
                          onChange={e => handleChange('couponTextLine2', e.target.value)}
                        />
                        <Input
                          placeholder="Coupon Line 3 (e.g., LIMITED TIME)"
                          value={mergedConfig.couponTextLine3 || ''}
                          onChange={e => handleChange('couponTextLine3', e.target.value)}
                        />
                      </>
                    )}

                    {/* Text controls for text-based stickers */}
                    {currentSticker?.hasText && mergedConfig.advancedShape !== 'coupon' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Text to show
                          </label>
                          <Input
                            placeholder="SCAN ME"
                            value={mergedConfig.text || 'SCAN ME'}
                            onChange={e => handleChange('text', e.target.value)}
                          />
                        </div>

                        {/* Font Family */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Font</span>
                          <select
                            value={mergedConfig.fontFamily || 'Raleway'}
                            onChange={e => handleChange('fontFamily', e.target.value)}
                            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
                          >
                            {FONT_FAMILIES.map(font => (
                              <option key={font} value={font}>
                                {font}
                              </option>
                            ))}
                          </select>
                        </div>

                        <ColorPickerWithPresets
                          label="Text Color"
                          value={mergedConfig.textColor || '#ffffff'}
                          onChange={c => handleChange('textColor', c)}
                        />

                        <ColorPickerWithPresets
                          label="Text Background"
                          value={mergedConfig.textBackgroundColor || '#1c57cb'}
                          onChange={c => handleChange('textBackgroundColor', c)}
                        />

                        <div>
                          <label className="block text-sm text-gray-700 mb-2">
                            Text Size: {mergedConfig.textSize || 1}x
                          </label>
                          <input
                            type="range"
                            min="0.5"
                            max="3"
                            step="0.1"
                            value={mergedConfig.textSize || 1}
                            onChange={e => handleChange('textSize', parseFloat(e.target.value))}
                            className="w-full accent-purple-500"
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}
              </SectionCard>
            )}

            {/* ==================== DOWNLOAD SECTION ==================== */}
            {activeTab === 'download' && (
              <SectionCard title="Your Download is Ready!" sectionKey="download">
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Your Download is</h2>
                  <h2 className="text-3xl font-bold text-purple-500">Ready !</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name your QR</label>
                  <Input
                    value={settings.name || ''}
                    onChange={e => handleSettingsChange('name', e.target.value)}
                    placeholder="My QR Code"
                    className="text-sm"
                  />
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button
                    onClick={() => {
                      setDownloadFormat('svg')
                      setTimeout(handleDownload, 100)
                    }}
                    disabled={!hasPreviewData || isDownloading}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    Download SVG
                  </button>
                  <button
                    onClick={() => {
                      setDownloadFormat('png')
                      setTimeout(handleDownload, 100)
                    }}
                    disabled={!hasPreviewData || isDownloading}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    Download PNG
                  </button>
                </div>
              </SectionCard>
            )}
          </div>

          {/* ==================== RIGHT PANEL - PREVIEW ==================== */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              {/* QR Preview */}
              <div className="flex justify-center mb-4">
                {hasPreviewData ? (
                  <BackendQRPreview
                    ref={previewRef}
                    data={qrData}
                    qrType={qrType}
                    config={design}
                    className="w-full max-w-[280px]"
                  />
                ) : (
                  <div className="w-[280px] h-[280px] bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <div className="text-5xl mb-2">⊞</div>
                      <p className="text-sm">No data to preview</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Create With AI Button */}
              <button
                type="button"
                onClick={() => handleChange('isAi', !mergedConfig.isAi)}
                className={cn(
                  'w-full flex items-center justify-center gap-2 py-2.5 px-4 border rounded-lg text-sm font-medium transition-colors mb-4',
                  mergedConfig.isAi
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                )}
              >
                <Wand2 className="w-4 h-4" />
                Create With AI
              </button>

              {/* AI Options */}
              {mergedConfig.isAi && (
                <div className="space-y-3 mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div>
                    <label className="block text-xs text-purple-700 mb-1">AI Prompt</label>
                    <textarea
                      value={mergedConfig.aiPrompt || ''}
                      onChange={e => handleChange('aiPrompt', e.target.value)}
                      placeholder="Describe your desired design..."
                      rows={2}
                      className="w-full text-sm border border-purple-200 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-purple-700 mb-1">
                      Strength: {(mergedConfig.aiStrength ?? 1.8).toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={mergedConfig.aiStrength ?? 1.8}
                      onChange={e => handleChange('aiStrength', parseFloat(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>
                </div>
              )}

              {/* Format & Size Selects */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Format</label>
                  <select
                    value={downloadFormat}
                    onChange={e => setDownloadFormat(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-400"
                  >
                    {FORMAT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Size</label>
                  <select
                    value={downloadSize}
                    onChange={e => setDownloadSize(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-400"
                  >
                    {SIZE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Download Button */}
              <Button
                onClick={handleDownload}
                disabled={!hasPreviewData || isDownloading || isSaving}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-medium"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  'Download QR CODE'
                )}
              </Button>

              {/* Reset Settings */}
              <button
                type="button"
                onClick={resetToDefaults}
                className="w-full text-sm text-gray-500 hover:text-gray-700 mt-3 underline"
              >
                Reset Settings
              </button>

              {/* Terms */}
              <p className="text-xs text-gray-400 text-center mt-4">
                By clicking "Download QR CODE" you agree to our{' '}
                <a href="/terms" className="text-purple-500 hover:underline">
                  Terms & Conditions
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
