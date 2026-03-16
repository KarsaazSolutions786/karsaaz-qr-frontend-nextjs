'use client'

import { toast } from 'sonner'
import { QRCode } from '@/types/entities/qrcode'
import { useTranslation } from '@/lib/i18n'

interface QRCodeDownloaderProps {
  qrcode: QRCode
}

export function QRCodeDownloader({ qrcode: _qrcode }: QRCodeDownloaderProps) {
  const { t } = useTranslation()
  const handleDownload = async (format: 'png' | 'svg' | 'pdf') => {
    // In a real implementation, this would call the API to get the image
    toast.info(`${t('Download as')} ${format.toUpperCase()} — ${t('coming soon!')}`)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">{t('Download QR Code')}</h3>
      
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <button
          onClick={() => handleDownload('png')}
          className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span>📥</span>
          <span>PNG</span>
        </button>

        <button
          onClick={() => handleDownload('svg')}
          className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span>📥</span>
          <span>SVG</span>
        </button>

        <button
          onClick={() => handleDownload('pdf')}
          className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span>📥</span>
          <span>PDF</span>
        </button>
      </div>

      <div className="text-xs text-gray-500">
        {t('Downloads are optimized for print and digital use')}
      </div>
    </div>
  )
}
