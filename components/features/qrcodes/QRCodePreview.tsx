'use client'

import { QRCode } from '@/types/entities/qrcode'

interface QRCodePreviewProps {
  qrcode: QRCode
  size?: number
}

export function QRCodePreview({ qrcode, size = 256 }: QRCodePreviewProps) {
  // In a real implementation, this would use qrcode.react or similar library
  // For now, it's a placeholder showing the pattern

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="rounded-lg border-4 border-white bg-white shadow-lg"
        style={{
          width: size,
          height: size,
        }}
      >
        {/* Placeholder for actual QR code */}
        <div className="flex h-full w-full items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="text-6xl">⊞</div>
            <div className="mt-2 text-xs text-gray-500">QR Code</div>
          </div>
        </div>
      </div>

      {qrcode.customization?.logoUrl && (
        <div className="text-xs text-gray-500">Logo: {qrcode.customization.logoUrl}</div>
      )}

      <div className="text-sm text-gray-600">
        Style: {qrcode.customization?.style || 'squares'}
      </div>
    </div>
  )
}
