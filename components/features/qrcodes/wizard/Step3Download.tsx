'use client'

import { useState, useRef, useMemo, useCallback } from 'react'
import { BackendQRPreview, BackendQRPreviewRef } from '@/components/qr/BackendQRPreview'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DesignerConfig, DEFAULT_DESIGNER_CONFIG } from '@/types/entities/designer'
import {
  Download,
  FileImage,
  FileCode2,
  FileText,
  Check,
  Loader2,
  FolderOpen,
  Tag,
  Lock,
  Calendar,
} from 'lucide-react'
import { FolderTree } from '@/components/qr/FolderTree'
import { useFolders } from '@/hooks/useFolders'

interface Step3DownloadProps {
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
  isSubmitting: boolean
  isSaved: boolean
}

const SIZE_OPTIONS = [
  { value: 500, label: 'Small (500px)', desc: 'Social media' },
  { value: 1000, label: 'Medium (1000px)', desc: 'Web & email' },
  { value: 2000, label: 'Large (2000px)', desc: 'Print quality' },
  { value: 4000, label: 'Extra Large (4000px)', desc: 'High-res print' },
]

export default function Step3Download({
  qrType,
  qrData,
  design,
  settings,
  onSettingsChange,
  isSubmitting,
  isSaved,
}: Step3DownloadProps) {
  const previewRef = useRef<BackendQRPreviewRef>(null)
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null)
  const [downloadedFormats, setDownloadedFormats] = useState<Set<string>>(new Set())
  const [selectedSize, setSelectedSize] = useState(1000)
  const [showFolderPicker, setShowFolderPicker] = useState(false)
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)
  const folderManager = useFolders([])

  // Merge design with defaults
  const mergedConfig: DesignerConfig = useMemo(
    () => ({
      ...DEFAULT_DESIGNER_CONFIG,
      ...design,
    }),
    [design]
  )

  // Check if qrData has at least one non-empty value
  const hasPreviewData =
    Object.keys(qrData).length > 0 &&
    Object.values(qrData).some(v => v !== '' && v !== null && v !== undefined)

  const handleSettingsChange = (field: string, value: any) => {
    onSettingsChange({ ...settings, [field]: value })
  }

  const handleDownload = useCallback(
    async (format: string) => {
      if (!previewRef.current) return

      setDownloadingFormat(format)
      try {
        const filename = settings.name || `qr-code-${qrType}`
        const svgStr = previewRef.current.getSVG()
        if (!svgStr) {
          throw new Error('No QR code preview available')
        }

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
          // Create canvas from SVG for PNG export at selected size
          const img = new Image()
          img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = selectedSize
            canvas.height = selectedSize
            const ctx = canvas.getContext('2d')
            if (ctx) {
              ctx.drawImage(img, 0, 0, selectedSize, selectedSize)
              canvas.toBlob(blob => {
                if (blob) {
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `${filename}.png`
                  a.click()
                  URL.revokeObjectURL(url)
                }
                setDownloadingFormat(null)
                setDownloadedFormats(prev => new Set([...prev, format]))
              }, 'image/png')
            }
          }
          img.onerror = () => {
            setDownloadingFormat(null)
          }
          img.src = dataURL
          return // PNG download completes asynchronously in img.onload
        } else {
          // PDF/EPS — download SVG as fallback
          const blob = new Blob([svgStr], { type: 'image/svg+xml' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${filename}.${format}`
          a.click()
          URL.revokeObjectURL(url)
        }

        setDownloadedFormats(prev => new Set([...prev, format]))
      } catch (error) {
        console.error(`Download ${format} failed:`, error)
      } finally {
        setDownloadingFormat(null)
      }
    },
    [settings.name, qrType, selectedSize]
  )

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault()
      const newTag = e.currentTarget.value.trim()
      const currentTags = settings.tags || []
      if (!currentTags.includes(newTag)) {
        handleSettingsChange('tags', [...currentTags, newTag])
        e.currentTarget.value = ''
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    const currentTags = settings.tags || []
    handleSettingsChange(
      'tags',
      currentTags.filter((tag: string) => tag !== tagToRemove)
    )
  }

  const selectedFolder = settings.folderId ? folderManager.getFolder(settings.folderId) : null

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Settings + Download */}
        <div className="lg:col-span-3 space-y-6">
          {/* QR Code Name */}
          <div>
            <label htmlFor="qr-name" className="block text-sm font-semibold text-gray-900 mb-2">
              QR Code Name *
            </label>
            <Input
              id="qr-name"
              type="text"
              value={settings.name || ''}
              onChange={e => handleSettingsChange('name', e.target.value)}
              placeholder="e.g., My Website QR Code"
              className="text-base"
              autoFocus
            />
            <p className="mt-1 text-xs text-gray-500">
              Give your QR code a name for easy identification
            </p>
          </div>

          {/* Advanced Settings Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              {showAdvancedSettings ? '▾' : '▸'} Advanced Settings
              <span className="text-gray-400 font-normal">(Folder, PIN, Expiration, Tags)</span>
            </button>

            {showAdvancedSettings && (
              <div className="mt-4 space-y-5 pl-4 border-l-2 border-gray-200">
                {/* Folder Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FolderOpen className="w-4 h-4" />
                    Folder
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={selectedFolder?.name || 'No folder selected'}
                      readOnly
                      className="flex-1 bg-gray-50 text-sm"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFolderPicker(!showFolderPicker)}
                    >
                      {showFolderPicker ? 'Close' : 'Select'}
                    </Button>
                  </div>
                  {showFolderPicker && (
                    <div className="mt-2 border border-gray-200 rounded-md p-3 bg-gray-50 max-h-48 overflow-y-auto">
                      <FolderTree
                        folders={[]}
                        selectedFolderId={settings.folderId}
                        onSelectFolder={folderId => {
                          handleSettingsChange('folderId', folderId)
                          setShowFolderPicker(false)
                        }}
                        onToggleExpanded={() => {}}
                      />
                    </div>
                  )}
                </div>

                {/* PIN Protection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4" />
                    PIN Protection
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="pinProtection"
                      checked={settings.pinProtected || false}
                      onChange={e => handleSettingsChange('pinProtected', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="pinProtection" className="text-sm text-gray-700">
                      Require PIN to access
                    </label>
                  </div>
                  {settings.pinProtected && (
                    <Input
                      type="password"
                      value={settings.pin || ''}
                      onChange={e => handleSettingsChange('pin', e.target.value)}
                      placeholder="Enter 4-6 digit PIN"
                      maxLength={6}
                      className="mt-2"
                    />
                  )}
                </div>

                {/* Expiration */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4" />
                    Expiration
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="hasExpiration"
                      checked={settings.hasExpiration || false}
                      onChange={e => handleSettingsChange('hasExpiration', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="hasExpiration" className="text-sm text-gray-700">
                      Set expiration date
                    </label>
                  </div>
                  {settings.hasExpiration && (
                    <Input
                      type="datetime-local"
                      value={settings.expiresAt || ''}
                      onChange={e => handleSettingsChange('expiresAt', e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="mt-2"
                    />
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Tag className="w-4 h-4" />
                    Tags
                  </label>
                  <Input
                    type="text"
                    placeholder="Type a tag and press Enter"
                    onKeyDown={handleTagInput}
                    className="text-sm"
                  />
                  {settings.tags && settings.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {settings.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-blue-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Size Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Download Size</label>
            <div className="grid grid-cols-2 gap-2">
              {SIZE_OPTIONS.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedSize(option.value)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    selectedSize === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="block text-sm font-medium text-gray-900">{option.label}</span>
                  <span className="block text-xs text-gray-500">{option.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Download Buttons */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Download Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* PNG */}
              <Button
                onClick={() => handleDownload('png')}
                disabled={!hasPreviewData || !!downloadingFormat || isSubmitting || !isSaved}
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2 hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                {downloadingFormat === 'png' ? (
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                ) : downloadedFormats.has('png') ? (
                  <Check className="w-6 h-6 text-green-600" />
                ) : (
                  <FileImage className="w-6 h-6 text-blue-600" />
                )}
                <div className="text-center">
                  <span className="block text-sm font-semibold">PNG</span>
                  <span className="block text-[10px] text-gray-500">Raster image</span>
                </div>
              </Button>

              {/* SVG */}
              <Button
                onClick={() => handleDownload('svg')}
                disabled={!hasPreviewData || !!downloadingFormat || isSubmitting || !isSaved}
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2 hover:border-green-400 hover:bg-green-50 transition-all"
              >
                {downloadingFormat === 'svg' ? (
                  <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                ) : downloadedFormats.has('svg') ? (
                  <Check className="w-6 h-6 text-green-600" />
                ) : (
                  <FileCode2 className="w-6 h-6 text-green-600" />
                )}
                <div className="text-center">
                  <span className="block text-sm font-semibold">SVG</span>
                  <span className="block text-[10px] text-gray-500">Vector scalable</span>
                </div>
              </Button>

              {/* PDF */}
              <Button
                onClick={() => handleDownload('pdf')}
                disabled={!hasPreviewData || !!downloadingFormat || isSubmitting || !isSaved}
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2 hover:border-red-400 hover:bg-red-50 transition-all"
              >
                {downloadingFormat === 'pdf' ? (
                  <Loader2 className="w-6 h-6 animate-spin text-red-600" />
                ) : downloadedFormats.has('pdf') ? (
                  <Check className="w-6 h-6 text-green-600" />
                ) : (
                  <FileText className="w-6 h-6 text-red-600" />
                )}
                <div className="text-center">
                  <span className="block text-sm font-semibold">PDF</span>
                  <span className="block text-[10px] text-gray-500">Document format</span>
                </div>
              </Button>

              {/* EPS */}
              <Button
                onClick={() => handleDownload('eps')}
                disabled={!hasPreviewData || !!downloadingFormat || isSubmitting || !isSaved}
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2 hover:border-purple-400 hover:bg-purple-50 transition-all"
              >
                {downloadingFormat === 'eps' ? (
                  <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                ) : downloadedFormats.has('eps') ? (
                  <Check className="w-6 h-6 text-green-600" />
                ) : (
                  <Download className="w-6 h-6 text-purple-600" />
                )}
                <div className="text-center">
                  <span className="block text-sm font-semibold">EPS</span>
                  <span className="block text-[10px] text-gray-500">Print & edit</span>
                </div>
              </Button>
            </div>

            {!isSaved && (
              <p className="mt-3 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-3">
                💡 Your QR code will be saved automatically before download becomes available.
              </p>
            )}
          </div>
        </div>

        {/* Right: QR Preview */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your QR Code</h3>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-8 sticky top-6 shadow-sm">
            <div className="flex flex-col items-center gap-4">
              {hasPreviewData ? (
                <BackendQRPreview
                  ref={previewRef}
                  data={qrData}
                  qrType={qrType}
                  config={mergedConfig}
                  className="w-full max-w-[300px] mx-auto"
                />
              ) : (
                <div className="w-[300px] h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400 text-sm">No data</p>
                </div>
              )}

              {settings.name && (
                <p className="text-sm font-medium text-gray-700 text-center">{settings.name}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
