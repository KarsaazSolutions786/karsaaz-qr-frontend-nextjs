'use client'

import { QRCode } from '@/types/entities/qrcode'
import { BackendQRPreview } from '@/components/qr/BackendQRPreview'

interface QRCodePreviewProps {
  qrcode: QRCode
  size?: number
}

export function QRCodePreview({ qrcode, size = 256 }: QRCodePreviewProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative rounded-lg border-4 border-white bg-white shadow-lg overflow-hidden"
        style={{ width: size, height: size }}
      >
        <BackendQRPreview
          data={qrcode.data as Record<string, any>}
          qrType={qrcode.type}
          config={qrcode.designerConfig}
          qrId={qrcode.id}
          className="w-full h-full"
        />
      </div>

      <div className="text-sm text-gray-600">
        Style: {qrcode.customization?.style || qrcode.designerConfig?.moduleShape || 'squares'}
      </div>
    </div>
  )
}
