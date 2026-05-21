'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import { RefreshCw, AlertTriangle, Loader2 } from 'lucide-react'
import apiClient from '@/lib/api/client'
import { toast } from 'sonner'

const STATIC_TYPES = [
  'url',
  'text',
  'email',
  'phone',
  'sms',
  'wifi',
  'vcard',
  'location',
]

const DYNAMIC_TYPES = [
  'dynamic_url',
  'dynamic_vcard',
  'dynamic_pdf',
  'dynamic_menu',
  'dynamic_landing',
]

/**
 * Purpose: Executes formatTypeName functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function formatTypeName(type: string): string {
  return type
    .replace(/^dynamic_/, 'Dynamic ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

interface BulkChangeTypeModalProps {
  open: boolean
  onClose: () => void
  selectedIds: string[]
  onComplete: () => void
}

/**
 * Purpose: Executes BulkChangeTypeModal functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function BulkChangeTypeModal({
  open,
  onClose,
  selectedIds,
  onComplete,
}: BulkChangeTypeModalProps) {
  const { t } = useTranslation()
  const [selectedType, setSelectedType] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedCount, setProcessedCount] = useState(0)

  /**
   * Purpose: Executes handleSubmit functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
  const handleSubmit = async () => {
    if (!selectedType || selectedIds.length === 0) return

    setIsProcessing(true)
    setProcessedCount(0)

    let successCount = 0
    let failCount = 0

    for (const id of selectedIds) {
      try {
        await apiClient.post(`/qrcodes/${id}/change-type`, {
          type: selectedType,
        })
        successCount++
      } catch {
        failCount++
      }
      setProcessedCount((prev) => prev + 1)
    }

    setIsProcessing(false)

    if (failCount > 0) {
      toast.error(
        t('Changed {{success}} QR codes. {{fail}} failed.')
          .replace('{{success}}', String(successCount))
          .replace('{{fail}}', String(failCount))
      )
    } else {
      toast.success(
        t('Successfully changed type for {{count}} QR codes').replace(
          '{{count}}',
          String(successCount)
        )
      )
    }

    onComplete()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && !isProcessing && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-purple-600" />
            {t('Change QR Code Type')}
          </DialogTitle>
          <DialogDescription>
            {t('Change the type for {{count}} selected QR codes').replace(
              '{{count}}',
              String(selectedIds.length)
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Warning */}
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
            <p className="text-sm text-amber-800">
              {t(
                'Changing the type will reset QR code data to match the new type. This cannot be undone.'
              )}
            </p>
          </div>

          {/* Type selector */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('New Type')}
            </label>

            <div className="mb-2">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                {t('Static')}
              </p>
            </div>
            <div className="mb-3 grid grid-cols-3 gap-2">
              {STATIC_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  disabled={isProcessing}
                  className={`rounded-lg border-2 px-3 py-2 text-sm font-medium capitalize transition-all ${
                    selectedType === type
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {formatTypeName(type)}
                </button>
              ))}
            </div>

            <div className="mb-2">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                {t('Dynamic')}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {DYNAMIC_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  disabled={isProcessing}
                  className={`rounded-lg border-2 px-3 py-2 text-sm font-medium capitalize transition-all ${
                    selectedType === type
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {formatTypeName(type)}
                </button>
              ))}
            </div>
          </div>

          {/* Progress */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-purple-600 transition-all duration-300"
                  style={{
                    width: `${(processedCount / selectedIds.length) * 100}%`,
                  }}
                />
              </div>
              <p className="text-center text-sm text-gray-600">
                {processedCount} / {selectedIds.length} {t('processed')}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
          >
            {t('Cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedType || isProcessing}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('Processing...')}
              </>
            ) : (
              t('Change Type')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
