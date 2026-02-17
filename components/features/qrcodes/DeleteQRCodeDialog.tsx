'use client'

import { QRCode } from '@/types/entities/qrcode'

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
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <span className="text-2xl">⚠️</span>
          </div>
        </div>

        <h3 className="text-center text-lg font-semibold text-gray-900">Delete QR Code?</h3>
        
        <p className="mt-3 text-center text-sm text-gray-600">
          Are you sure you want to delete <strong>"{qrcode.name}"</strong>?
        </p>
        
        <p className="mt-2 text-center text-sm text-gray-500">
          This action cannot be undone. All scan statistics will be lost.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>

          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
