'use client'

import { useState, useRef, useCallback } from 'react'
import { BackendQRPreview, BackendQRPreviewRef } from '@/components/qr/BackendQRPreview'
import { DesignerConfig } from '@/types/entities/designer'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'

const SIZE_OPTIONS = [
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
    folderId: string | null
    pinProtected: boolean
    pin: string | null
    hasExpiration: boolean
    expiresAt: string | null
    tags: string[]
  }
  onSettingsChange: (settings: any) => void
  savedQRId?: string | null
}

export default function Step4Download({
  qrType,
  qrData,
  design,
  settings,
  onSettingsChange,
  savedQRId,
}: Step4DownloadProps) {
  const previewRef = useRef<BackendQRPreviewRef>(null)
  const [downloadSize, setDownloadSize] = useState('1024')
  const [isDownloading, setIsDownloading] = useState(false)

  const hasPreviewData =
    Object.keys(qrData).length > 0 &&
    Object.values(qrData).some(v => v !== '' && v !== null && v !== undefined)

  const handleDownload = useCallback(
    async (format: string) => {
      if (!previewRef.current) return
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
          img.onerror = () => setIsDownloading(false)
          img.src = dataURL
          return
        }
      } catch (error) {
        console.error('Download failed:', error)
      } finally {
        setIsDownloading(false)
      }
    },
    [settings.name, qrType, downloadSize]
  )

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Heading */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Your Download is</h2>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mt-1">
          Ready !
        </h2>
      </div>

      {/* Name input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Give it a name</label>
        <Input
          value={settings.name || ''}
          onChange={e => onSettingsChange({ name: e.target.value })}
          placeholder="My QR Code"
          className="text-sm border-gray-300 rounded-lg"
        />
      </div>

      {/* Size selector (for PNG) */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Size</label>
        <div className="flex gap-2">
          {SIZE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setDownloadSize(opt.value)}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg border transition-colors ${
                downloadSize === opt.value
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Download buttons */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => handleDownload('svg')}
          disabled={!hasPreviewData || isDownloading}
          variant="outline"
          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          SVG
        </Button>
        <Button
          onClick={() => handleDownload('png')}
          disabled={!hasPreviewData || isDownloading}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium bg-gradient-to-r from-pink-500 via-purple-500 to-purple-600 hover:from-pink-600 hover:via-purple-600 hover:to-purple-700 text-white"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              PNG
            </>
          )}
        </Button>
      </div>

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
    </div>
  )
}
