'use client'

import { QRCode } from '@/types/entities/qrcode'
import { useTranslation } from '@/lib/i18n'

interface DeleteQRCodeDialogProps {
  qrcode: QRCode
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isDeleting?: boolean
}

export function DeleteQRCodeDialog({
  qrcode,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteQRCodeDialogProps) {
  const { t } = useTranslation()
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <span className="text-2xl">🗑️</span>
          </div>
        </div>

        <h3 className="text-center text-lg font-semibold text-gray-900">{t('Move to Trash?')}</h3>

        <p className="mt-3 text-center text-sm text-gray-600">
          {t('Are you sure you want to move')} <strong>&quot;{qrcode.name}&quot;</strong> {t('to trash?')}
        </p>

        <p className="mt-2 text-center text-sm text-gray-500">
          {t('The QR code will be moved to your trash and can be restored or permanently deleted from there.')}
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? t('Moving to trash...') : t('Move to Trash')}
          </button>

          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t('Cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}
