'use client'

import { QRCode } from '@/types/entities/qrcode'
import { QRCodeCard } from './QRCodeCard'

interface QRCodeListProps {
  qrcodes: QRCode[]
  isLoading?: boolean
}

export function QRCodeList({ qrcodes, isLoading }: QRCodeListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    )
  }

  if (qrcodes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No QR codes found. Create your first one!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {qrcodes.map((qrcode) => (
        <QRCodeCard key={qrcode.id} qrcode={qrcode} />
      ))}
    </div>
  )
}
