'use client'

import { ArrowDownTrayIcon, DocumentIcon } from '@heroicons/react/24/outline'
import { useTranslation } from '@/lib/i18n'

interface FileUploadData {
  name: string
  file_url?: string
  file_name?: string
  file_size?: number
  file_type?: string
  description?: string
  expires_at?: string
  branding?: {
    primary_color?: string
    logo_url?: string
    title?: string
  }
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return 'Unknown size' // translated at render time
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(fileType?: string): string {
  if (!fileType) return '📄'
  if (fileType.startsWith('image/')) return '🖼️'
  if (fileType.startsWith('video/')) return '🎥'
  if (fileType.startsWith('audio/')) return '🎵'
  if (fileType.includes('pdf')) return '📑'
  if (fileType.includes('zip') || fileType.includes('rar')) return '📦'
  if (fileType.includes('spreadsheet') || fileType.includes('excel')) return '📊'
  if (fileType.includes('document') || fileType.includes('word')) return '📝'
  return '📄'
}

export default function FileUploadPreview({
  fileUpload,
}: {
  fileUpload: FileUploadData
}) {
  const { t } = useTranslation()
  const isExpired =
    fileUpload.expires_at && new Date(fileUpload.expires_at) < new Date()
  const primaryColor = fileUpload.branding?.primary_color || '#2563eb'

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-lg">
        {/* Header */}
        <div
          className="px-6 py-8 text-center text-white"
          style={{ backgroundColor: primaryColor }}
        >
          {fileUpload.branding?.logo_url && (
            <img
              src={fileUpload.branding.logo_url}
              alt="Logo"
              className="mx-auto mb-4 h-12 w-auto"
            />
          )}
          <h1 className="text-2xl font-bold">
            {fileUpload.branding?.title || t('File Download')}
          </h1>
        </div>

        {/* File Info */}
        <div className="p-6">
          <div className="mb-6 flex items-center gap-4 rounded-lg border border-gray-200 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-2xl">
              {getFileIcon(fileUpload.file_type)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate font-medium text-gray-900">
                {fileUpload.name || fileUpload.file_name || t('Untitled File')}
              </p>
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                <DocumentIcon className="h-4 w-4" />
                <span>{formatFileSize(fileUpload.file_size)}</span>
                {fileUpload.file_type && (
                  <>
                    <span>·</span>
                    <span className="uppercase">
                      {fileUpload.file_type.split('/').pop()}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {fileUpload.description && (
            <p className="mb-6 text-sm text-gray-600">
              {fileUpload.description}
            </p>
          )}

          {isExpired ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
              <p className="font-medium text-red-800">{t('This file has expired')}</p>
              <p className="mt-1 text-sm text-red-600">
                {t('This download link is no longer available.')}
              </p>
            </div>
          ) : fileUpload.file_url ? (
            <a
              href={fileUpload.file_url}
              download={fileUpload.file_name || fileUpload.name}
              className="flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-center font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              {t('Download File')}
            </a>
          ) : (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center">
              <p className="font-medium text-yellow-800">
                {t('File not yet available')}
              </p>
              <p className="mt-1 text-sm text-yellow-600">
                {t('The file has not been uploaded yet. Please check back later.')}
              </p>
            </div>
          )}

          {fileUpload.expires_at && !isExpired && (
            <p className="mt-4 text-center text-xs text-gray-400">
              {t('Available until')}{' '}
              {new Date(fileUpload.expires_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
