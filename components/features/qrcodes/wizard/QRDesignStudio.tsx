'use client'

import { useState, useEffect, useRef, useMemo, memo } from 'react'
import { BackendQRPreview, BackendQRPreviewRef } from '@/components/qr/BackendQRPreview'
import { WebpagePreview, WebpagePreviewRef } from '@/components/qr/WebpagePreview'
import { LogoUpload } from '@/components/qr/LogoUpload'
import { qrcodesAPI } from '@/lib/api/endpoints/qrcodes'
import { Switch } from '@/components/ui/switch'
import { DesignerConfig, DEFAULT_DESIGNER_CONFIG } from '@/types/entities/designer'
import { useDesignShapes } from '@/lib/hooks/useDesignShapes'
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Upload, Lock } from 'lucide-react'
import { LottieLoader } from '@/components/ui/lottie-loader'
import PageDesignPanel, {
  TYPES_WITH_WEBPAGE_DESIGN,
  DEFAULT_WEBPAGE_DESIGN,
} from './PageDesignPanel'
import type { WebpageDesignData } from './PageDesignPanel'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useSubscription } from '@/lib/hooks/useSubscription'
import { StickerEditor } from './StickerEditor'
import { useTranslation } from '@/lib/i18n'

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
  savedQRId?: string | null
  /** Webpage design data for dynamic types that have a landing page */
  webpageDesign?: WebpageDesignData
  /** Callback when webpage design changes */
  onWebpageDesignChange?: (data: WebpageDesignData) => void
}

type DesignMode = 'qr' | 'page'

type TabId = 'color' | 'look' | 'sticker'

const TABS: { id: TabId; label: string; emoji: string }[] = [
  { id: 'color', label: 'Select color', emoji: '🎨' },
  { id: 'look', label: 'Look & Feel', emoji: '👁' },
  { id: 'sticker', label: 'Sticker', emoji: '🎴' },
]

const PRESET_COLORS = ['#FF0000', '#8B5CF6', '#10B981', '#FFFFFF']

// Color Picker with presets (hoisted to module scope to avoid remount on every render)
const ColorPickerWithPresets = memo(
  ({
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
              value === color
                ? 'border-purple-500 scale-110'
                : 'border-gray-300 hover:border-gray-400'
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
)
ColorPickerWithPresets.displayName = 'ColorPickerWithPresets'

// Section Card Component (hoisted to module scope to avoid remount on every render)
const SectionCard = memo(
  ({
    title,
    sectionKey: _sectionKey,
    expanded,
    onToggle,
    children,
  }: {
    title: string
    sectionKey: string
    expanded: boolean
    onToggle: () => void
    children: React.ReactNode
  }) => (
    <div className="bg-white rounded-xl border border-purple-100 overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 bg-purple-50/30 hover:bg-purple-50/60 transition-colors"
      >
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-purple-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-purple-400" />
        )}
      </button>
      {expanded && <div className="px-5 py-4 space-y-4">{children}</div>}
    </div>
  )
)
SectionCard.displayName = 'SectionCard'

// Shape Grid Component with optional premium locking (hoisted to module scope to avoid remount on every render)
const ShapeGrid = memo(
  ({
    items,
    selectedValue,
    onSelect,
    showAll,
    onToggleShowAll,
    maxVisible = 15,
    premiumLocked = false,
    onPremiumBlock,
    t,
  }: {
    items: { value: string; label: string; image?: string }[]
    selectedValue: string
    onSelect: (value: string) => void
    showAll: boolean
    onToggleShowAll: () => void
    maxVisible?: number
    /** When true, all items except the first (default) are locked for free users */
    premiumLocked?: boolean
    onPremiumBlock: () => void
    t: (key: string) => string
  }) => {
    const visibleItems = showAll ? items : items.slice(0, maxVisible)
    return (
      <div>
        <div className="grid grid-cols-7 gap-2">
          {visibleItems.map((item, idx) => {
            // First item (default shape) is always free; rest are premium
            const isLocked = premiumLocked && idx > 0
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  if (isLocked) {
                    onPremiumBlock()
                    return
                  }
                  onSelect(item.value)
                }}
                className={cn(
                  'aspect-square rounded-lg border-2 flex items-center justify-center p-1.5 transition-all relative',
                  selectedValue === item.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300',
                  isLocked && 'opacity-50 cursor-not-allowed'
                )}
                title={isLocked ? `${item.label} (requires paid plan)` : item.label}
              >
                {item.image ? (
                  <img src={item.image} alt={item.label} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-[8px] text-gray-500">{item.label}</span>
                )}
                {isLocked && (
                  <Lock className="absolute bottom-0.5 right-0.5 w-3 h-3 text-gray-400" />
                )}
              </button>
            )
          })}
        </div>
        {items.length > maxVisible && (
          <button
            type="button"
            onClick={onToggleShowAll}
            className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            {showAll ? t('show less') : t('view all')}
          </button>
        )}
      </div>
    )
  }
)
ShapeGrid.displayName = 'ShapeGrid'

export default function QRDesignStudio({
  qrType,
  qrTypeLabel,
  qrData,
  design,
  onChange,
  settings: _settings,
  onSettingsChange: _onSettingsChange,
  onBack,
  isSaving: _isSaving,
  isSaved,
  savedQRId,
  webpageDesign,
  onWebpageDesignChange,
}: QRDesignStudioProps) {
  const { t } = useTranslation()
  const {
    MODULE_SHAPES,
    FINDER_STYLES,
    FINDER_DOT_STYLES,
    OUTLINED_SHAPES,
    ADVANCED_SHAPES,
    PRESET_LOGOS,
  } = useDesignShapes()

  // Subscription-based premium feature gating
  const { plan, isOnTrial } = useSubscription()
  const isFreePlan = !plan || isOnTrial || plan.is_trial || parseFloat(plan.price || '0') === 0
  const handlePremiumBlock = () => {
    toast.info(
      t('This design feature requires a paid plan. Upgrade to unlock advanced shapes and effects.')
    )
  }

  // Determine if this QR type supports webpage design
  const hasWebpageDesign = TYPES_WITH_WEBPAGE_DESIGN.has(qrType)
  const [designMode, setDesignMode] = useState<DesignMode>('qr')

  // Local webpage design state (used when parent doesn't manage it)
  const [localWebpageDesign, setLocalWebpageDesign] = useState<WebpageDesignData>(
    webpageDesign || { ...DEFAULT_WEBPAGE_DESIGN }
  )
  const currentWebpageDesign = webpageDesign || localWebpageDesign
  const handleWebpageDesignChange = (data: WebpageDesignData) => {
    if (onWebpageDesignChange) {
      onWebpageDesignChange(data)
    } else {
      setLocalWebpageDesign(data)
    }
  }

  const previewRef = useRef<BackendQRPreviewRef>(null)
  const webpagePreviewRef = useRef<WebpagePreviewRef>(null)

  // Refresh the webpage iframe whenever a save completes (isSaved flips to true)
  const prevIsSavedRef = useRef(isSaved)
  useEffect(() => {
    if (isSaved && !prevIsSavedRef.current && designMode === 'page') {
      webpagePreviewRef.current?.refresh()
    }
    prevIsSavedRef.current = isSaved
  }, [isSaved, designMode])
  const [activeTab, setActiveTab] = useState<TabId>('color')
  const colorSectionRef = useRef<HTMLDivElement>(null)
  const lookSectionRef = useRef<HTMLDivElement>(null)
  const stickerSectionRef = useRef<HTMLDivElement>(null)

  const sectionRefs: Record<TabId, React.RefObject<HTMLDivElement>> = {
    color: colorSectionRef,
    look: lookSectionRef,
    sticker: stickerSectionRef,
  }

  useEffect(() => {
    if (designMode !== 'qr') return
    const entries: Record<string, number> = {}
    const observer = new IntersectionObserver(
      observed => {
        observed.forEach(entry => {
          const id = (entry.target as HTMLElement).dataset.tabSection
          if (id) entries[id] = entry.intersectionRatio
        })
        const best = Object.entries(entries).sort((a, b) => b[1] - a[1])[0]
        if (best && best[1] > 0) setActiveTab(best[0] as TabId)
      },
      { threshold: [0, 0.1, 0.5], rootMargin: '0px 0px -40% 0px' }
    )
    const refs = [colorSectionRef, lookSectionRef, stickerSectionRef]
    refs.forEach(r => {
      if (r.current) observer.observe(r.current)
    })
    return () => observer.disconnect()
  }, [designMode])

  const scrollToTab = (tabId: TabId) => {
    setActiveTab(tabId)
    sectionRefs[tabId]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [hasUploadedImage, setHasUploadedImage] = useState(false)

  const mergedConfig = useMemo(() => ({ ...DEFAULT_DESIGNER_CONFIG, ...design }), [design])

  // Keep solid fill for preview until image is uploaded to backend
  const previewDesign = useMemo(() => {
    if ((design.foregroundFill as any)?.type === 'foreground_image' && !hasUploadedImage) {
      return { ...design, foregroundFill: { type: 'solid' as const, color: '#000000' } }
    }
    return design
  }, [design, hasUploadedImage])

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

  const resetToDefaults = () => {
    onChange({ ...DEFAULT_DESIGNER_CONFIG })
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className="min-h-screen karsaaz-bg">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-14 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="text-purple-600 hover:text-purple-700 transition-colors text-xl font-bold"
              >
                &lt;
              </button>
            )}
            <h1 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
              {qrTypeLabel || qrType}
            </h1>
          </div>

          {/* Designer Mode Toggle - only for types with webpage designs */}
          {hasWebpageDesign && (
            <div className="flex items-center gap-1 mt-4 p-1 bg-gray-100 rounded-lg w-fit">
              <button
                onClick={() => setDesignMode('qr')}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-all',
                  designMode === 'qr'
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {t('QR Design')}
              </button>
              <button
                onClick={() => setDesignMode('page')}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-all',
                  designMode === 'page'
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {t('Page Design')}
              </button>
            </div>
          )}

          {/* Tabs - Figma pill style with emoji icons (only shown in QR Design mode) */}
          {designMode === 'qr' && (
            <div className="flex items-center gap-3 mt-4 pb-2 overflow-x-auto">
              {TABS.map(tab => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => scrollToTab(tab.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap',
                      isActive
                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                        : 'text-gray-500 hover:text-gray-700'
                    )}
                  >
                    {t(tab.label)}
                    <span className="text-base">{tab.emoji}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-3 space-y-4">
            {/* ==================== PAGE DESIGN PANEL ==================== */}
            {designMode === 'page' && hasWebpageDesign && (
              <PageDesignPanel value={currentWebpageDesign} onChange={handleWebpageDesignChange} />
            )}

            {/* ==================== QR COLOR SECTION ==================== */}
            {designMode === 'qr' && (
              <div ref={colorSectionRef} data-tab-section="color">
                <SectionCard
                  title={t('QR Color')}
                  sectionKey="qrColor"
                  expanded={!!expandedSections['qrColor']}
                  onToggle={() => toggleSection('qrColor')}
                >
                  {/* Fill Type */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{t('Fill Type')}</span>
                    <select
                      value={
                        (mergedConfig.foregroundFill as any)?.type === 'gradient'
                          ? 'gradient'
                          : (mergedConfig.foregroundFill as any)?.type === 'foreground_image'
                            ? 'image'
                            : 'solid'
                      }
                      onChange={e => {
                        if (e.target.value !== 'solid' && isFreePlan) {
                          handlePremiumBlock()
                          return
                        }
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
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-purple-300 focus:border-purple-400 cursor-pointer"
                    >
                      <option value="solid">{t('Solid Color')}</option>
                      <option value="gradient">{t('Gradient')}</option>
                      <option value="image">{t('Image Fill')}</option>
                    </select>
                  </div>

                  {/* Solid Color Fill */}
                  {(mergedConfig.foregroundFill as any)?.type === 'solid' && (
                    <ColorPickerWithPresets
                      label={t('Fill Color')}
                      value={(mergedConfig.foregroundFill as any)?.color || '#000000'}
                      onChange={c => handleChange('foregroundFill', { type: 'solid', color: c })}
                    />
                  )}

                  {/* Gradient Controls */}
                  {(mergedConfig.foregroundFill as any)?.type === 'gradient' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{t('Gradient Type')}</span>
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
                          <option value="linear">{t('Linear')}</option>
                          <option value="radial">{t('Radial')}</option>
                        </select>
                      </div>
                      <ColorPickerWithPresets
                        label={t('Start Color')}
                        value={(mergedConfig.foregroundFill as any).startColor || '#000000'}
                        onChange={c =>
                          handleChange('foregroundFill', {
                            ...(mergedConfig.foregroundFill as any),
                            startColor: c,
                          })
                        }
                      />
                      <ColorPickerWithPresets
                        label={t('End Color')}
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
                            {t('Angle')}: {(mergedConfig.foregroundFill as any).rotation || 45}°
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
                      <label className="block text-sm font-medium text-gray-700">
                        {t('Foreground Image')}
                      </label>

                      {!savedQRId ? (
                        // Show message when QR is not saved yet
                        <div className="border-2 border-dashed border-yellow-300 rounded-lg p-4 bg-yellow-50">
                          <div className="flex items-start gap-3">
                            <div className="text-yellow-600 text-xl">⚠️</div>
                            <div>
                              <p className="text-sm font-medium text-yellow-800">
                                {t('Save QR Code First')}
                              </p>
                              <p className="text-xs text-yellow-700 mt-1">
                                {t(
                                  'Image fill requires the QR code to be saved first. Click "Next" to save, then you can upload a foreground image.'
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Show file upload when QR is saved
                        <>
                          <div
                            className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center cursor-pointer transition hover:border-purple-500 hover:bg-purple-50/30"
                            onClick={() =>
                              document.getElementById('foreground-image-input')?.click()
                            }
                          >
                            <input
                              id="foreground-image-input"
                              type="file"
                              accept="image/png,image/jpeg,image/jpg"
                              className="hidden"
                              onChange={async e => {
                                const file = e.target.files?.[0]
                                if (file && savedQRId) {
                                  // Show local preview immediately
                                  const reader = new FileReader()
                                  reader.onload = ev => {
                                    const dataUrl = ev.target?.result as string
                                    handleChange('foregroundFill', {
                                      type: 'foreground_image',
                                      imageUrl: dataUrl,
                                    })
                                  }
                                  reader.readAsDataURL(file)

                                  // Upload to backend so preview renders correctly
                                  try {
                                    setIsUploadingImage(true)
                                    await qrcodesAPI.uploadForegroundImage(savedQRId, file)
                                    setHasUploadedImage(true)
                                    setTimeout(() => previewRef.current?.refresh(), 300)
                                  } catch (err) {
                                    console.error('[ForegroundImage] Upload failed:', err)
                                  } finally {
                                    setIsUploadingImage(false)
                                  }
                                }
                              }}
                            />

                            {(mergedConfig.foregroundFill as any).imageUrl ? (
                              <div className="flex items-center justify-center gap-3">
                                {isUploadingImage ? (
                                  <LottieLoader size={80} />
                                ) : (
                                  <img
                                    src={(mergedConfig.foregroundFill as any).imageUrl}
                                    alt="Foreground preview"
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                )}
                                <div className="text-left">
                                  <p className="text-sm font-medium text-gray-900">
                                    {isUploadingImage ? t('Uploading...') : t('Image selected')}
                                  </p>
                                  <p className="text-xs text-gray-500">{t('Click to replace')}</p>
                                </div>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600 font-medium">
                                  {t('Drop your file here')}
                                </p>
                                <p className="text-xs text-gray-400 my-2">{t('or')}</p>
                                <span className="inline-block px-4 py-1.5 text-sm font-medium text-white bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors">
                                  {t('Browse Files')}
                                </span>
                              </>
                            )}
                          </div>

                          {/* Clear button */}
                          {(mergedConfig.foregroundFill as any).imageUrl && (
                            <button
                              type="button"
                              onClick={async () => {
                                handleChange('foregroundFill', {
                                  type: 'foreground_image',
                                  imageUrl: '',
                                })
                                setHasUploadedImage(false)
                                if (savedQRId) {
                                  try {
                                    await qrcodesAPI.deleteForegroundImage(savedQRId)
                                  } catch {
                                    // ignore — backend may not have an image to delete
                                  }
                                }
                              }}
                              className="text-sm text-red-600 hover:text-red-700"
                            >
                              {t('Remove image')}
                            </button>
                          )}

                          <p className="text-xs text-gray-500">
                            {t('The image will be used as a pattern fill for the QR code modules.')}
                          </p>
                        </>
                      )}
                    </div>
                  )}

                  {/* Eye Colors */}
                  <ColorPickerWithPresets
                    label={t('Eye External Color')}
                    value={mergedConfig.eyeExternalColor || '#000000'}
                    onChange={c => handleChange('eyeExternalColor', c)}
                  />
                  <ColorPickerWithPresets
                    label={t('Eye Internal Color')}
                    value={mergedConfig.eyeInternalColor || '#000000'}
                    onChange={c => handleChange('eyeInternalColor', c)}
                  />

                  {/* Background Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{t('Background')}</span>
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
                      label={t('Background Color')}
                      value={mergedConfig.background?.color || '#FFFFFF'}
                      onChange={c => handleChange('background', { type: 'solid', color: c })}
                    />
                  )}
                </SectionCard>
              </div>
            )}

            {/* ==================== LOOK & FEEL SECTION ==================== */}
            {designMode === 'qr' && (
              <div ref={lookSectionRef} data-tab-section="look">
                <SectionCard
                  title={t('Look & Feel')}
                  sectionKey="lookFeel"
                  expanded={!!expandedSections['lookFeel']}
                  onToggle={() => toggleSection('lookFeel')}
                >
                  {/* Module */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Module')}
                    </label>
                    <ShapeGrid
                      items={MODULE_SHAPES}
                      selectedValue={mergedConfig.moduleShape || 'square'}
                      onSelect={value => handleChange('moduleShape', value)}
                      showAll={showAllModules}
                      onToggleShowAll={() => setShowAllModules(!showAllModules)}
                      premiumLocked={isFreePlan}
                      onPremiumBlock={handlePremiumBlock}
                      t={t}
                    />
                  </div>

                  {/* Finder */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Finder')}
                    </label>
                    <ShapeGrid
                      items={FINDER_STYLES}
                      selectedValue={mergedConfig.finder || 'default'}
                      onSelect={value => handleChange('finder', value)}
                      showAll={showAllFinders}
                      onToggleShowAll={() => setShowAllFinders(!showAllFinders)}
                      premiumLocked={isFreePlan}
                      onPremiumBlock={handlePremiumBlock}
                      t={t}
                    />
                  </div>

                  {/* Finder Dot */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Finder Dot')}
                    </label>
                    <ShapeGrid
                      items={FINDER_DOT_STYLES}
                      selectedValue={mergedConfig.finderDot || 'default'}
                      onSelect={value => handleChange('finderDot', value)}
                      showAll={showAllFinderDots}
                      onToggleShowAll={() => setShowAllFinderDots(!showAllFinderDots)}
                      premiumLocked={isFreePlan}
                      onPremiumBlock={handlePremiumBlock}
                      t={t}
                    />
                  </div>

                  {/* Shape (Outline) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Shape')}
                    </label>
                    <ShapeGrid
                      items={OUTLINED_SHAPES}
                      selectedValue={mergedConfig.shape || 'none'}
                      onSelect={value => handleChange('shape', value)}
                      showAll={showAllShapes}
                      onToggleShowAll={() => setShowAllShapes(!showAllShapes)}
                      premiumLocked={isFreePlan}
                      onPremiumBlock={handlePremiumBlock}
                      t={t}
                    />
                  </div>

                  {/* Frame Color */}
                  {mergedConfig.shape && mergedConfig.shape !== 'none' && (
                    <ColorPickerWithPresets
                      label={t('Frame Color')}
                      value={mergedConfig.frameColor || '#000000'}
                      onChange={c => handleChange('frameColor', c)}
                    />
                  )}

                  {/* Logo Type */}
                  <div className="border-t border-gray-200 pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Logo Type')}
                    </label>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="logoType"
                          checked={(mergedConfig.logo?.logoType || 'preset') === 'preset'}
                          onChange={() => handleLogoChange({ logoType: 'preset' })}
                          className="text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">{t('Preset')}</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="logoType"
                          checked={mergedConfig.logo?.logoType === 'custom'}
                          onChange={() => handleLogoChange({ logoType: 'custom' })}
                          className="text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">{t('Your logo')}</span>
                      </label>
                    </div>

                    {/* Preset Logos */}
                    {(mergedConfig.logo?.logoType || 'preset') === 'preset' && (
                      <div className="mt-3">
                        <div className="grid grid-cols-7 gap-2 max-h-[200px] overflow-y-auto">
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
                            {t('NONE')}
                          </button>
                          {PRESET_LOGOS.map(logo => (
                            <button
                              key={logo.value}
                              type="button"
                              onClick={() => {
                                // Use DB thumbnail_url if available, fallback to hardcoded path
                                const logoUrl =
                                  logo.image || `/assets/images/png-logos/${logo.value}.png`
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
                          {t(
                            'Upload your logo (PNG, JPG). The logo will be embedded in the QR code.'
                          )}
                        </p>
                      </div>
                    )}

                    {/* Logo Customization Controls - Show when logo is selected */}
                    {mergedConfig.logo?.url && (
                      <div className="mt-4 space-y-4 border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-semibold text-gray-900">
                          {t('Logo Settings')}
                        </h4>

                        {/* Logo Scale */}
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">
                            {t('Logo Scale')}: {Math.round((mergedConfig.logo.size || 0.2) * 100)}%
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
                            {t('Horizontal Position')}:{' '}
                            {Math.round((mergedConfig.logo.positionX ?? 0.5) * 100)}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={mergedConfig.logo.positionX ?? 0.5}
                            onChange={e =>
                              handleLogoChange({ positionX: parseFloat(e.target.value) })
                            }
                            className="w-full accent-purple-500"
                          />
                        </div>

                        {/* Logo Position Y */}
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">
                            {t('Vertical Position')}:{' '}
                            {Math.round((mergedConfig.logo.positionY ?? 0.5) * 100)}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={mergedConfig.logo.positionY ?? 0.5}
                            onChange={e =>
                              handleLogoChange({ positionY: parseFloat(e.target.value) })
                            }
                            className="w-full accent-purple-500"
                          />
                        </div>

                        {/* Logo Rotation */}
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">
                            {t('Rotation')}: {mergedConfig.logo.rotate ?? 0}°
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
                          <span className="text-sm text-gray-700">{t('Logo Background')}</span>
                          <Switch
                            checked={mergedConfig.logo.backgroundEnabled ?? true}
                            onCheckedChange={checked =>
                              handleLogoChange({ backgroundEnabled: checked })
                            }
                          />
                        </div>

                        {/* Logo Background Options */}
                        {(mergedConfig.logo.backgroundEnabled ?? true) && (
                          <>
                            {/* Background Shape */}
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-700">{t('Background Shape')}</span>
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
                                    {t(shape)}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Background Color */}
                            <ColorPickerWithPresets
                              label={t('Background Color')}
                              value={mergedConfig.logo.backgroundFill || '#ffffff'}
                              onChange={c => handleLogoChange({ backgroundFill: c })}
                            />

                            {/* Background Scale */}
                            <div>
                              <label className="block text-sm text-gray-700 mb-2">
                                {t('Background Size')}:{' '}
                                {(mergedConfig.logo.backgroundScale ?? 1.3).toFixed(1)}x
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
              </div>
            )}

            {/* ==================== STICKER SECTION ==================== */}
            {designMode === 'qr' && (
              <div ref={stickerSectionRef} data-tab-section="sticker">
                <SectionCard
                  title={t('Sticker')}
                  sectionKey="sticker"
                  expanded={!!expandedSections['sticker']}
                  onToggle={() => toggleSection('sticker')}
                >
                  <StickerEditor
                    config={mergedConfig}
                    advancedShapes={ADVANCED_SHAPES}
                    onChange={handleChange}
                    variant="compact"
                    ColorPicker={ColorPickerWithPresets}
                  />
                </SectionCard>
              </div>
            )}
          </div>

          {/* ==================== RIGHT PANEL - PREVIEW ==================== */}
          <div className="lg:col-span-2">
            {designMode === 'page' && hasWebpageDesign ? (
              /* Screen / landing-page preview (mirrors Lit's qrcg-webpage-preview) */
              <div className="sticky top-28">
                <WebpagePreview ref={webpagePreviewRef} qrcodeId={savedQRId ?? null} />
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-purple-100 p-6 sticky top-28 shadow-sm">
                {/* QR Preview */}
                <div className="flex justify-center mb-4">
                  {hasPreviewData ? (
                    <BackendQRPreview
                      ref={previewRef}
                      data={qrData}
                      qrType={qrType}
                      config={previewDesign}
                      qrId={savedQRId || undefined}
                      className="w-full max-w-[280px]"
                    />
                  ) : (
                    <div className="w-[280px] h-[280px] bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <div className="text-5xl mb-2">⊞</div>
                        <p className="text-sm">{t('No data to preview')}</p>
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
                  {t('Create With AI')}
                </button>

                {/* AI Options */}
                {mergedConfig.isAi && (
                  <div className="space-y-3 mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div>
                      <label className="block text-xs text-purple-700 mb-1">{t('AI Prompt')}</label>
                      <textarea
                        value={mergedConfig.aiPrompt || ''}
                        onChange={e => handleChange('aiPrompt', e.target.value)}
                        placeholder={t('Describe your desired design...')}
                        rows={2}
                        className="w-full text-sm border border-purple-200 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-purple-700 mb-1">
                        {t('Strength')}: {(mergedConfig.aiStrength ?? 1.8).toFixed(1)}
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

                {/* Reset Settings */}
                <button
                  type="button"
                  onClick={resetToDefaults}
                  className="w-full text-sm text-gray-500 hover:text-gray-700 mt-3 underline"
                >
                  {t('Reset Settings')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation - Figma style */}
        <div className="flex items-center justify-end gap-3 mt-6 pb-6">
          <button
            type="button"
            onClick={() => {
              const currentIndex = TABS.findIndex(tb => tb.id === activeTab)
              if (currentIndex === TABS.length - 1) {
                // Last step - finish
              }
            }}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium mr-auto"
          >
            {t('Skip')}
          </button>
          <button
            type="button"
            onClick={() => {
              const currentIndex = TABS.findIndex(tb => tb.id === activeTab)
              if (currentIndex > 0) {
                setActiveTab(TABS[currentIndex - 1]!.id)
              } else if (onBack) {
                onBack()
              }
            }}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('Back')}
          </button>
          <button
            type="button"
            onClick={() => {
              const currentIndex = TABS.findIndex(tb => tb.id === activeTab)
              if (currentIndex < TABS.length - 1) {
                setActiveTab(TABS[currentIndex + 1]!.id)
              }
            }}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t('Next')}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
