'use client'

import { useQRCode } from '@/lib/hooks/queries/useQRCode'
import { QRWizardContainer } from '@/components/features/qrcodes/wizard'
import { Loader2 } from 'lucide-react'

/**
 * Edit QR Code Page - Uses multi-step wizard in edit mode
 * 
 * Features:
 * - Pre-loads existing QR code data
 * - Same wizard flow as creation
 * - All 4 steps available for editing
 * - Updates existing QR code on save
 */
export default function EditQRCodePage({ params }: { params: { id: string } }) {
  const { data: qrcode, isLoading } = useQRCode(params.id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-4 text-gray-600">Loading QR Code...</p>
        </div>
      </div>
    )
  }

  if (!qrcode) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 text-center">
        <p className="text-red-600">QR Code not found</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <QRWizardContainer 
        mode="edit" 
        qrcodeId={params.id}
        initialData={qrcode}
      />
    </div>
  )
}
