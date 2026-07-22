'use client'

import { useState, useRef, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import { BackendQRPreview, BackendQRPreviewRef } from '@/components/qr/BackendQRPreview'
import { DesignerConfig } from '@/types/entities/designer'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Download, Loader2, Lock, Plus } from 'lucide-react'
import { useSubscription } from '@/lib/hooks/useSubscription'
import { UpgradeRequiredModal } from '@/components/subscription/UpgradeRequiredModal'
import SaveAsTemplateButton from '@/components/templates/SaveAsTemplateButton'
import { useTranslation } from '@/lib/i18n'
import { useFolders, useCreateFolder } from '@/lib/hooks/queries/useFolders'
import { FolderModal } from '@/components/qr/FolderModal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const FOLDER_COLORS = [
  { name: 'Blue', value: '#1E40AF' },
  { name: 'Red', value: '#991B1B' },
  { name: 'Green', value: '#065F46' },
  { name: 'Purple', value: '#5B21B6' },
  { name: 'Yellow', value: '#854D0E' },
]

const ALL_SIZE_OPTIONS = [
  { value: '512', label: '512px' },
  { value: '1024', label: '1024px' },
  { value: '2048', label: '2048px' },
  { value: '4096', label: '4k' },
]

interface Step4DownloadProps {
  qrType: string
  qrData: Record<string, any>
  design: Partial<DesignerConfig>
  settings: {
    name: string
    folderId: string | number | null
    pinProtected: boolean
    pin: string | null
    hasExpiration: boolean
    expiresAt: string | null
    tags: string[]
  }
  onSettingsChange: (settings: any) => void
  savedQRId?: string | null
}

/**
 * Purpose: Executes Step4Download functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export default function Step4Download({
  qrType,
  qrData,
  design,
  settings,
  onSettingsChange,
  savedQRId,
}: Step4DownloadProps) {
  const { t } = useTranslation()
  const previewRef = useRef<BackendQRPreviewRef>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  // Subscription-based download restrictions
  const { plan, isOnTrial, showUpgradeModal, upgradeReason, openUpgradeModal, closeUpgradeModal } =
    useSubscription()
  const isFreePlan = !plan || isOnTrial || plan.is_trial || parseFloat(plan.price || '0') === 0

  const [downloadSize, setDownloadSize] = useState('512')
  const { data: folders = [] } = useFolders()
  const createFolderMutation = useCreateFolder()
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false)
  const selectedFolderName = useMemo(() => {
    if (!settings.folderId) return null
    return folders.find(f => String(f.id) === String(settings.folderId))?.name ?? null
  }, [folders, settings.folderId])

  const handleSizeSelect = useCallback(
    (value: string) => {
      if (isFreePlan && value !== '512') {
        openUpgradeModal(
          t(
            'Higher resolution downloads require a paid plan. Upgrade to unlock 1024px, 2048px, and 4K.'
          )
        )
        return
      }
      setDownloadSize(value)
    },
    [isFreePlan, openUpgradeModal]
  )

  const hasPreviewData =
    Object.keys(qrData).length > 0 &&
    Object.values(qrData).some(v => v !== '' && v !== null && v !== undefined)

  const handleDownload = useCallback(
    async (format: string) => {
      if (!previewRef.current) return

      // Enforce format restrictions for free/trial plans
      if (isFreePlan && format === 'svg') {
        openUpgradeModal(
          `${format.toUpperCase()} ${t('download requires a paid plan. Upgrade to unlock all formats.')}`
        )
        return
      }

      setIsDownloading(true)

      try {
        const filename = settings.name || `qr-code-${qrType}`
        const svgStr = previewRef.current.getSVG()
        if (!svgStr) throw new Error('No QR code preview available')

        if (format === 'svg') {
          const blob = new Blob([svgStr], { type: 'image/svg+xml' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${filename}.svg`
          a.click()
          URL.revokeObjectURL(url)
        } else if (format === 'png') {
          const dataURL = previewRef.current.getDataURL()
          if (!dataURL) throw new Error('Cannot generate data URL')
          const size = Number(downloadSize)
          const img = new Image()
          img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = size
            canvas.height = size
            const ctx = canvas.getContext('2d')
            if (ctx) {
              ctx.drawImage(img, 0, 0, size, size)
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
          img.onerror = () => {
            setIsDownloading(false)
            toast.error(t('PNG download failed. Please try again.'))
          }
          img.src = dataURL
          return
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') console.error('Download failed:', error)
        toast.error(t('Download failed. Please try again.'))
      } finally {
        setIsDownloading(false)
      }
    },
    [settings.name, qrType, downloadSize, isFreePlan, openUpgradeModal]
  )

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Heading */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{t('Your Download is')}</h2>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mt-1">
          {t('Ready!')}
        </h2>
      </div>

      {/* Name input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('Give it a name')}
        </label>
        <Input
          value={settings.name || ''}
          onChange={e => onSettingsChange({ name: e.target.value })}
          placeholder={t('My QR Code')}
          className="text-sm border-gray-300 rounded-lg"
        />
      </div>

      {/* Folder selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('Select Folder')}</label>
        <div className="flex gap-2">
          <div className="flex-1">
            <Select
              value={settings.folderId ? String(settings.folderId) : 'no-folder'}
              onValueChange={value => {
                onSettingsChange({ folderId: value === 'no-folder' ? null : Number(value) })
              }}
            >
              <SelectTrigger className="w-full text-sm border-gray-300 rounded-lg bg-white h-10 px-3 py-2 text-left">
                <SelectValue placeholder={t('No Folder (All QR Codes)')}>
                  {selectedFolderName}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-folder">{t('No Folder (All QR Codes)')}</SelectItem>
                {folders.map(folder => (
                  <SelectItem key={folder.id} value={String(folder.id)}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsFolderModalOpen(true)}
            className="h-10 px-3 border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
            title={t('Create New Folder')}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <FolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        mode="create"
        colors={FOLDER_COLORS}
        onSave={async data => {
          try {
            const newFolder = await createFolderMutation.mutateAsync({ folder_name: data.name })
            const folderId = newFolder?.id || (newFolder as any)?.data?.id
            if (folderId) {
              onSettingsChange({ folderId: Number(folderId) })
              toast.success(t('Folder created successfully!'))
            }
          } catch {
            toast.error(t('Failed to create folder.'))
          }
        }}
      />

      {/* Size selector (for PNG) */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('Select Size')}</label>
        <div className="flex gap-2">
          {ALL_SIZE_OPTIONS.map(opt => {
            const isLocked = isFreePlan && opt.value !== '512'
            return (
              <button
                key={opt.value}
                onClick={() => handleSizeSelect(opt.value)}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg border transition-colors relative ${
                  downloadSize === opt.value
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : isLocked
                      ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
                title={isLocked ? t('Requires paid plan') : undefined}
              >
                {opt.label}
                {isLocked && <Lock className="inline-block ml-1 h-3 w-3" />}
              </button>
            )
          })}
        </div>
        {isFreePlan && (
          <p className="mt-2 text-xs text-gray-500">
            {t('Free plan: PNG at 512px only. Upgrade for higher resolutions and more formats.')}
          </p>
        )}
      </div>

      {/* Download buttons */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => handleDownload('svg')}
          disabled={!hasPreviewData || isDownloading}
          variant={isFreePlan ? 'ghost' : 'outline'}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium ${isFreePlan ? 'opacity-50' : ''}`}
          title={isFreePlan ? t('SVG download requires a paid plan') : undefined}
        >
          <Download className="w-4 h-4" />
          SVG
          {isFreePlan && <Lock className="ml-1 h-3 w-3" />}
        </Button>
        <Button
          onClick={() => handleDownload('png')}
          disabled={!hasPreviewData || isDownloading}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium bg-gradient-to-r from-pink-500 via-purple-500 to-purple-600 hover:from-pink-600 hover:via-purple-600 hover:to-purple-700 text-white"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t('Downloading...')}
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              PNG
            </>
          )}
        </Button>
      </div>

      {/* Save as Template */}
      {savedQRId && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-gray-500">
              {t('Want to reuse this design? Save it as a template.')}
            </p>
            <SaveAsTemplateButton
              qrcodeId={savedQRId}
              qrcodeName={settings.name}
              qrcodeType={qrType}
            />
          </div>
        </div>
      )}

      {/* Hidden preview for SVG/PNG generation */}
      <div className="sr-only">
        <BackendQRPreview
          ref={previewRef}
          data={qrData}
          qrType={qrType}
          config={design}
          qrId={savedQRId || undefined}
        />
      </div>

      {/* Upgrade modal for free/trial plan restrictions */}
      <UpgradeRequiredModal
        open={showUpgradeModal}
        onClose={closeUpgradeModal}
        title={t('Upgrade Required')}
        message={upgradeReason}
      />
    </div>
  )
}
