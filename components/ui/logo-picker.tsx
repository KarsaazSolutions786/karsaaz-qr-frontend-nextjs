'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface LogoPickerProps {
  value?: string
  onChange: (value: string) => void
  accept?: string
  className?: string
}

export function LogoPicker({ value, onChange, accept = 'image/*', className }: LogoPickerProps) {
  const [tab, setTab] = React.useState<'upload' | 'url'>('upload')
  const [urlInput, setUrlInput] = React.useState('')
  const fileRef = React.useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') onChange(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleUrlApply = () => {
    if (urlInput.trim()) onChange(urlInput.trim())
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Tabs */}
      <div className="inline-flex h-9 items-center rounded-md bg-gray-100 p-1 text-sm">
        {(['upload', 'url'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              'rounded-sm px-3 py-1 text-sm font-medium transition-colors',
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            )}
          >
            {t === 'upload' ? 'Upload' : 'URL'}
          </button>
        ))}
      </div>

      {/* Upload tab */}
      {tab === 'upload' && (
        <div>
          <input ref={fileRef} type="file" accept={accept} onChange={handleFile} className="hidden" />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={cn(
              'flex h-10 items-center gap-2 rounded-md border border-gray-300 bg-white px-4 text-sm shadow-sm',
              'hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
            )}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
            </svg>
            Choose file
          </button>
        </div>
      )}

      {/* URL tab */}
      {tab === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://example.com/logo.png"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className={cn(
              'flex h-10 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm',
              'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
            )}
          />
          <button
            type="button"
            onClick={handleUrlApply}
            className="h-10 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Apply
          </button>
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="relative inline-block rounded-md border border-gray-300 p-2">
          <img src={value} alt="Logo preview" className="max-h-24 max-w-[200px] object-contain" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600"
            aria-label="Remove logo"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}
