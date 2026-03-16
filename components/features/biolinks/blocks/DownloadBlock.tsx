'use client'

import { useTranslation } from '@/lib/i18n'
import type { DownloadBlockData } from '@/types/entities/biolink'

interface DownloadBlockProps {
  block: DownloadBlockData
  isEditing?: boolean
  onUpdate?: (data: DownloadBlockData['data']) => void
}

export default function DownloadBlock({ block, isEditing, onUpdate }: DownloadBlockProps) {
  const { fileName, fileUrl, fileSize, fileType } = block.data
  const { t } = useTranslation()

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('File Name')}</label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => onUpdate?.({ ...block.data, fileName: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('File URL')}</label>
          <input
            type="url"
            value={fileUrl}
            onChange={(e) => onUpdate?.({ ...block.data, fileUrl: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('File Size (optional)')}</label>
            <input
              type="text"
              value={fileSize || ''}
              onChange={(e) => onUpdate?.({ ...block.data, fileSize: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="2.5 MB"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('File Type (optional)')}</label>
            <input
              type="text"
              value={fileType || ''}
              onChange={(e) => onUpdate?.({ ...block.data, fileType: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="PDF"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <a
      href={fileUrl}
      download={fileName}
      className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-blue-500"
    >
      <span className="text-2xl">📥</span>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{fileName}</p>
        {(fileType || fileSize) && (
          <p className="text-xs text-gray-500">
            {[fileType, fileSize].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>
      <span className="text-sm font-medium text-blue-600">{t('Download')}</span>
    </a>
  )
}
