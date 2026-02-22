'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface FileUploadProps {
  className?: string
  accept?: string
  maxSize?: number
  multiple?: boolean
  onChange?: (files: File[]) => void
  disabled?: boolean
}

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  ({ className, accept, maxSize, multiple = false, onChange, disabled = false }, ref) => {
    const [dragActive, setDragActive] = React.useState(false)
    const [files, setFiles] = React.useState<File[]>([])
    const [error, setError] = React.useState<string | null>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)

    const validateFiles = React.useCallback(
      (fileList: File[]): File[] => {
        setError(null)
        const acceptedTypes = accept?.split(',').map((t) => t.trim()) || []
        return fileList.filter((file) => {
          if (maxSize && file.size > maxSize) {
            setError(`File "${file.name}" exceeds max size of ${(maxSize / 1024 / 1024).toFixed(1)}MB`)
            return false
          }
          if (acceptedTypes.length > 0) {
            const matches = acceptedTypes.some(
              (type) =>
                file.type === type ||
                (type.startsWith('.') && file.name.endsWith(type)) ||
                (type.endsWith('/*') && file.type.startsWith(type.replace('/*', '/')))
            )
            if (!matches) {
              setError(`File "${file.name}" is not an accepted type`)
              return false
            }
          }
          return true
        })
      },
      [accept, maxSize]
    )

    const handleFiles = React.useCallback(
      (fileList: FileList | null) => {
        if (!fileList) return
        const valid = validateFiles(Array.from(fileList))
        if (valid.length > 0) {
          const newFiles = multiple ? [...files, ...valid] : valid.slice(0, 1)
          setFiles(newFiles)
          onChange?.(newFiles)
        }
      },
      [validateFiles, multiple, files, onChange]
    )

    const handleDrag = React.useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
      else if (e.type === 'dragleave') setDragActive(false)
    }, [])

    const handleDrop = React.useCallback(
      (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (!disabled) handleFiles(e.dataTransfer.files)
      },
      [disabled, handleFiles]
    )

    const removeFile = React.useCallback(
      (index: number) => {
        const newFiles = files.filter((_, i) => i !== index)
        setFiles(newFiles)
        onChange?.(newFiles)
      },
      [files, onChange]
    )

    return (
      <div ref={ref} className={cn('space-y-2', className)}>
        <div
          className={cn(
            'flex flex-col items-center justify-center rounded-md border-2 border-dashed px-6 py-8 text-center transition-colors',
            'border-gray-300 bg-white',
            dragActive && 'border-blue-500 bg-blue-50',
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-blue-400'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
        >
          <svg className="mb-2 h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
          </p>
          {accept && <p className="mt-1 text-xs text-gray-400">Accepted: {accept}</p>}
          {maxSize && <p className="mt-1 text-xs text-gray-400">Max size: {(maxSize / 1024 / 1024).toFixed(1)}MB</p>}
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        {files.length > 0 && (
          <ul className="space-y-1">
            {files.map((file, i) => (
              <li key={`${file.name}-${i}`} className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm">
                <span className="truncate text-gray-700">{file.name}</span>
                <button
                  type="button"
                  className="ml-2 text-gray-400 hover:text-red-500"
                  onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }
)
FileUpload.displayName = 'FileUpload'

export { FileUpload }
