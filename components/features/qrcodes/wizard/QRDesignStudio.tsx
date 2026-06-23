'use client'

import { useState, useEffect, useRef, useMemo, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { BackendQRPreviewRef } from '@/components/qr/BackendQRPreview'
import { WebpagePreview, WebpagePreviewRef } from '@/components/qr/WebpagePreview'
import { DesignerConfig, DEFAULT_DESIGNER_CONFIG } from '@/types/entities/designer'
import { useDesignShapes } from '@/lib/hooks/useDesignShapes'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import PageDesignPanel, {
  TYPES_WITH_WEBPAGE_DESIGN,
  DEFAULT_WEBPAGE_DESIGN,
} from './PageDesignPanel'
import type { WebpageDesignData } from './PageDesignPanel'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useSubscription } from '@/lib/hooks/useSubscription'
import { useTranslation } from '@/lib/i18n'
import { ColorPickerWithPresets } from '../designer/ColorPickerWithPresets'
import { SectionCard } from '../designer/SectionCard'
import { WizardDesignPanelSkeleton } from './WizardStepSkeleton'

const QRColorPanel = dynamic(
  () => import('../designer/QRColorPanel').then(mod => ({ default: mod.QRColorPanel })),
  { loading: () => <WizardDesignPanelSkeleton /> }
)
const QRLookPanel = dynamic(
  () => import('../designer/QRLookPanel').then(mod => ({ default: mod.QRLookPanel })),
  { loading: () => <WizardDesignPanelSkeleton /> }
)
const StickerEditor = dynamic(
  () => import('./StickerEditor').then(mod => ({ default: mod.StickerEditor })),
  { loading: () => <WizardDesignPanelSkeleton /> }
)
import { QRPreviewSidebar } from '../designer/QRPreviewSidebar'

interface QRDesignStudioProps {
  qrType: string
  qrTypeLabel?: string
  qrData: Record<string, unknown>
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
  onSettingsChange: (settings: Record<string, unknown>) => void
  onBack?: () => void
  isSaving?: boolean
  isSaved?: boolean
  savedQRId?: string | null
  webpageDesign?: WebpageDesignData
  onWebpageDesignChange?: (data: WebpageDesignData) => void
}

type DesignMode = 'qr' | 'page'
type TabId = 'color' | 'look' | 'sticker'

const TABS: { id: TabId; label: string; emoji: string }[] = [
  { id: 'color', label: 'Select color', emoji: '🎨' },
  { id: 'look', label: 'Look & Feel', emoji: '👁' },
  { id: 'sticker', label: 'Sticker', emoji: '🎴' },
]

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
  const { ADVANCED_SHAPES } = useDesignShapes()
  const { plan, isOnTrial } = useSubscription()
  const isFreePlan = !plan || isOnTrial || plan.is_trial || parseFloat(plan.price || '0') === 0

  const handlePremiumBlock = () => {
    toast.info(
      t('This design feature requires a paid plan. Upgrade to unlock advanced shapes and effects.')
    )
  }

  const hasWebpageDesign = TYPES_WITH_WEBPAGE_DESIGN.has(qrType)
  const [designMode, setDesignMode] = useState<DesignMode>('qr')
  const [localWebpageDesign, setLocalWebpageDesign] = useState<WebpageDesignData>(
    webpageDesign || { ...DEFAULT_WEBPAGE_DESIGN }
  )
  const currentWebpageDesign = webpageDesign || localWebpageDesign

  const [activeTab, setActiveTab] = useState<TabId>('color')
  const [hasUploadedImage, setHasUploadedImage] = useState(false)
  const [stickerExpanded, setStickerExpanded] = useState(true)

  const previewRef = useRef<BackendQRPreviewRef>(null)
  const webpagePreviewRef = useRef<WebpagePreviewRef>(null)
  const colorSectionRef = useRef<HTMLDivElement>(null)
  const lookSectionRef = useRef<HTMLDivElement>(null)
  const stickerSectionRef = useRef<HTMLDivElement>(null)

  const mergedConfig = useMemo(() => ({ ...DEFAULT_DESIGNER_CONFIG, ...design }), [design])

  // Refresh webpage preview when save completes
  const prevIsSavedRef = useRef(isSaved)
  useEffect(() => {
    if (isSaved && !prevIsSavedRef.current && designMode === 'page') {
      webpagePreviewRef.current?.refresh()
    }
    prevIsSavedRef.current = isSaved
  }, [isSaved, designMode])

  // Sync active tab to scrolled section via IntersectionObserver
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
    ;[colorSectionRef, lookSectionRef, stickerSectionRef].forEach(r => {
      if (r.current) observer.observe(r.current)
    })
    return () => observer.disconnect()
  }, [designMode])

  const handleWebpageDesignChange = (data: WebpageDesignData) => {
    if (onWebpageDesignChange) onWebpageDesignChange(data)
    else setLocalWebpageDesign(data)
  }

  const scrollToTab = (tabId: TabId) => {
    setActiveTab(tabId)
    const refMap = { color: colorSectionRef, look: lookSectionRef, sticker: stickerSectionRef }
    refMap[tabId]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleChange = (field: string, value: unknown) => {
    onChange({ ...design, [field]: value })
  }

  const handleLogoChange = (logoUpdates: Partial<DesignerConfig['logo']>) => {
    onChange({
      ...design,
      logo: { ...mergedConfig.logo, ...logoUpdates } as DesignerConfig['logo'],
    })
  }

  const handleImageUploaded = () => {
    setHasUploadedImage(true)
    setTimeout(() => previewRef.current?.refresh(), 300)
  }

  const resetToDefaults = () => onChange({ ...DEFAULT_DESIGNER_CONFIG })

  return (
    <div className="min-h-screen karsaaz-bg">
      {/* Sticky Header */}
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

          {/* QR / Page mode toggle */}
          {hasWebpageDesign && (
            <div className="flex items-center gap-1 mt-4 p-1 bg-gray-100 rounded-lg w-fit">
              {(['qr', 'page'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setDesignMode(mode)}
                  className={cn(
                    'px-4 py-2 rounded-md text-sm font-medium transition-all',
                    designMode === mode
                      ? 'bg-white text-purple-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  {mode === 'qr' ? t('QR Design') : t('Page Design')}
                </button>
              ))}
            </div>
          )}

          {/* Tab pills */}
          {designMode === 'qr' && (
            <div className="flex items-center gap-3 mt-4 pb-2 overflow-x-auto">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => scrollToTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap',
                    activeTab === tab.id
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  {t(tab.label)}
                  <span className="text-base">{tab.emoji}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Panel — Controls */}
          <div className="lg:col-span-3 space-y-4">
            {designMode === 'page' && hasWebpageDesign && (
              <PageDesignPanel value={currentWebpageDesign} onChange={handleWebpageDesignChange} />
            )}

            {designMode === 'qr' && (
              <>
                <div ref={colorSectionRef} data-tab-section="color">
                  <Suspense fallback={<WizardDesignPanelSkeleton />}>
                    <QRColorPanel
                      value={mergedConfig}
                      onFieldChange={handleChange}
                      savedQRId={savedQRId}
                      isFreePlan={isFreePlan}
                      onPremiumBlock={handlePremiumBlock}
                      onImageUploaded={handleImageUploaded}
                    />
                  </Suspense>
                </div>

                <div ref={lookSectionRef} data-tab-section="look">
                  <Suspense fallback={<WizardDesignPanelSkeleton />}>
                    <QRLookPanel
                      value={mergedConfig}
                      onFieldChange={handleChange}
                      onLogoChange={handleLogoChange}
                      isFreePlan={isFreePlan}
                      onPremiumBlock={handlePremiumBlock}
                    />
                  </Suspense>
                </div>

                <div ref={stickerSectionRef} data-tab-section="sticker">
                  <SectionCard
                    title={t('Sticker')}
                    sectionKey="sticker"
                    expanded={stickerExpanded}
                    onToggle={() => setStickerExpanded(e => !e)}
                  >
                    <Suspense fallback={<WizardDesignPanelSkeleton />}>
                      <StickerEditor
                        config={mergedConfig}
                        advancedShapes={ADVANCED_SHAPES}
                        onChange={handleChange}
                        variant="compact"
                        ColorPicker={ColorPickerWithPresets}
                      />
                    </Suspense>
                  </SectionCard>
                </div>
              </>
            )}
          </div>

          {/* Right Panel — Preview */}
          <div className="lg:col-span-2">
            {designMode === 'page' && hasWebpageDesign ? (
              <div className="sticky top-28">
                <WebpagePreview ref={webpagePreviewRef} qrcodeId={savedQRId ?? null} />
              </div>
            ) : (
              <QRPreviewSidebar
                qrData={qrData}
                qrType={qrType}
                mergedConfig={mergedConfig}
                hasImageBeenUploaded={hasUploadedImage}
                savedQRId={savedQRId}
                previewRef={previewRef}
                onFieldChange={handleChange}
                onReset={resetToDefaults}
              />
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-end gap-3 mt-6 pb-6">
          <button
            type="button"
            onClick={() => {
              const currentIndex = TABS.findIndex(tb => tb.id === activeTab)
              if (currentIndex === TABS.length - 1) {
                // Last step — finish
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
              if (currentIndex > 0) setActiveTab(TABS[currentIndex - 1]!.id)
              else if (onBack) onBack()
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
              if (currentIndex < TABS.length - 1) setActiveTab(TABS[currentIndex + 1]!.id)
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
