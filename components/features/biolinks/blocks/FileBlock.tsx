'use client'

import type { FileBlockData } from '@/types/entities/biolink'

interface FileBlockProps {
  block: FileBlockData
  isEditing?: boolean
  onUpdate?: (data: FileBlockData['data']) => void
}

export default function FileBlock({ block, isEditing, onUpdate }: FileBlockProps) {
  const { fileUrl, fileName, fileSize, downloadCount } = block.data

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">File Name</label>
          <input
            type="text"
            value={fileName}
            onChange={e => onUpdate?.({ ...block.data, fileName: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="document.pdf"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">File URL</label>
          <input
            type="url"
            value={fileUrl}
            onChange={e => onUpdate?.({ ...block.data, fileUrl: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="https://example.com/file.pdf"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">File Size (optional)</label>
            <input
              type="text"
              value={fileSize || ''}
              onChange={e => onUpdate?.({ ...block.data, fileSize: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="2.5 MB"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Downloads</label>
            <input
              type="number"
              value={downloadCount || 0}
              onChange={e =>
                onUpdate?.({ ...block.data, downloadCount: parseInt(e.target.value) || 0 })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
    )
  }

  if (!fileUrl) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <p className="text-sm text-gray-500">No file set</p>
      </div>
    )
  }

  return (
    <a
      href={fileUrl}
      download={fileName}
      className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-blue-500"
    >
      <span className="text-2xl">📄</span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{fileName}</p>
        <p className="text-xs text-gray-500">
          {[
            fileSize,
            downloadCount != null && downloadCount > 0 ? `${downloadCount} downloads` : null,
          ]
            .filter(Boolean)
            .join(' · ') || 'File'}
        </p>
      </div>
      <span className="shrink-0 text-sm font-medium text-blue-600">Download</span>
    </a>
  )
}
