import { useState, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { useSubscription } from '@/lib/hooks/useSubscription'
import { useQRActions } from '@/lib/hooks/useQRActions'
import { toast } from 'sonner'

const ALL_SIZE_OPTIONS = [
  { value: '512', label: '512px' },
  { value: '1024', label: '1024px' },
  { value: '2048', label: '2048px' },
  { value: '4096', label: '4k' },
]

interface QRDownloadModalProps {
  isOpen: boolean
  onClose: () => void
  qrCodeIds: string[]
}

export function QRDownloadModal({ isOpen, onClose, qrCodeIds }: QRDownloadModalProps) {
  const { t } = useTranslation()
  const { downloadQRCode, bulkDownloadQRCodes } = useQRActions()
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadSize, setDownloadSize] = useState('512')

  const { plan, isOnTrial, openUpgradeModal } = useSubscription()
  const isFreePlan = !plan || isOnTrial || plan.is_trial || parseFloat(plan.price || '0') === 0

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
    [isFreePlan, openUpgradeModal, t]
  )

  const handleDownload = async (format: 'png' | 'svg') => {
    if (qrCodeIds.length === 0) return

    if (isFreePlan && format !== 'png') {
      openUpgradeModal(
        `${format.toUpperCase()} ${t('download requires a paid plan. Upgrade to unlock all formats.')}`
      )
      return
    }

    setIsDownloading(true)
    const size = parseInt(downloadSize, 10)

    try {
      if (qrCodeIds.length === 1) {
        await downloadQRCode(qrCodeIds[0] as string, format, undefined, size)
      } else {
        await bulkDownloadQRCodes(qrCodeIds, format, size)
      }
      toast.success(
        qrCodeIds.length === 1
          ? t('QR code downloaded successfully')
          : t('QR codes downloaded successfully')
      )
      onClose()
    } catch {
      toast.error(t('Failed to download QR code. Please try again.'))
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('Download QR Code')}</DialogTitle>
          <DialogDescription>
            {t('Select your preferred size and format for the download.')}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Size Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('Select Size')}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {ALL_SIZE_OPTIONS.map(opt => {
                const isSelected = downloadSize === opt.value
                const isRestricted = isFreePlan && opt.value !== '512'

                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSizeSelect(opt.value)}
                    className={`
                      relative py-2 px-1 rounded-lg text-sm font-medium transition-all duration-200
                      ${
                        isSelected
                          ? 'border-2 border-purple-500 text-purple-700 bg-purple-50 shadow-sm'
                          : 'border border-gray-200 text-gray-600 hover:border-purple-300 hover:bg-gray-50'
                      }
                      ${isRestricted ? 'opacity-70 cursor-not-allowed' : ''}
                    `}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
            {isFreePlan && (
              <p className="text-xs text-amber-600 mt-2 flex justify-between">
                <span>{t('Free plan is limited to 512px')}</span>
              </p>
            )}
          </div>

          {/* Format Selection & Download */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('Select Format')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['svg', 'png'] as const).map(format => {
                const isRestricted = isFreePlan && format !== 'png'

                return (
                  <Button
                    key={format}
                    variant={format === 'png' ? 'default' : 'outline'}
                    onClick={() => handleDownload(format)}
                    disabled={isDownloading}
                    className={`
                      flex items-center justify-center gap-1.5 h-12
                      ${
                        format === 'png'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0'
                          : ''
                      }
                      ${isRestricted ? 'opacity-70' : ''}
                    `}
                  >
                    {isDownloading && format === 'png' ? ( // Simplified loading UI just for the button clicked, though they all disable
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span className="uppercase text-sm">{format}</span>
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
