'use client'

import React, { useState } from 'react'
import { Download, FileText, FileImage, FileArchive, File, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface FileUploadDesignerProps {
  fileName: string
  fileSize?: string
  fileType?: string
  fileUrl?: string
  description?: string
  logoUrl?: string
  brandName?: string
  theme?: {
    primaryColor?: string
    backgroundColor?: string
  }
}

function getFileIcon(fileType?: string) {
  if (!fileType) return <File className="w-10 h-10" />
  if (fileType.startsWith('image/')) return <FileImage className="w-10 h-10" />
  if (fileType.includes('pdf')) return <FileText className="w-10 h-10" />
  if (fileType.includes('zip') || fileType.includes('rar'))
    return <FileArchive className="w-10 h-10" />
  return <File className="w-10 h-10" />
}

function getFileExtension(fileType?: string): string {
  if (!fileType) return 'FILE'
  const ext = fileType.split('/').pop()?.toUpperCase()
  return ext || 'FILE'
}

export default function FileUploadDesigner({
  fileName,
  fileSize,
  fileType,
  fileUrl,
  description,
  logoUrl,
  brandName,
  theme,
}: FileUploadDesignerProps) {
  const [downloadCount, setDownloadCount] = useState(0)
  const primaryColor = theme?.primaryColor || '#2563eb'
  const bgColor = theme?.backgroundColor || '#f8fafc'

  const handleDownload = () => {
    setDownloadCount(prev => prev + 1)
    if (fileUrl) {
      window.open(fileUrl, '_blank')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-full max-w-md">
        <Card className="overflow-hidden shadow-xl border-0">
          {/* Branding / Logo Area */}
          <div
            className="px-6 py-6 text-center text-white"
            style={{ backgroundColor: primaryColor }}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={brandName || 'Logo'}
                className="h-10 mx-auto mb-3 object-contain"
              />
            ) : brandName ? (
              <h2 className="text-lg font-bold">{brandName}</h2>
            ) : null}
            <h1 className="text-xl font-bold">File Download</h1>
          </div>

          <CardContent className="p-6 space-y-5">
            {/* File Info Card */}
            <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50">
              <div className="flex-shrink-0 text-gray-500">{getFileIcon(fileType)}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{fileName}</p>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs font-medium">
                    {getFileExtension(fileType)}
                  </span>
                  {fileSize && <span>{fileSize}</span>}
                </div>
              </div>
            </div>

            {/* File Description */}
            {description && <p className="text-sm text-gray-600 leading-relaxed">{description}</p>}

            {/* Download Button with Counter */}
            <Button
              className="w-full h-12 text-white font-semibold text-base"
              style={{ backgroundColor: primaryColor }}
              onClick={handleDownload}
              disabled={!fileUrl}
            >
              <Download className="w-5 h-5 mr-2" />
              {fileUrl ? 'Download File' : 'File Not Available'}
            </Button>

            {downloadCount > 0 && (
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>
                  {downloadCount} download{downloadCount !== 1 ? 's' : ''} in this session
                </span>
              </div>
            )}

            {!fileUrl && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-center">
                <p className="text-sm text-yellow-800">
                  The file has not been uploaded yet. Please check back later.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-4">Powered by Karsaaz QR</p>
      </div>
    </div>
  )
}
