'use client'

import { useState } from 'react'

interface BulkUploadCSVProps {
  onUpload: (data: any[]) => void
}

export function BulkUploadCSV({ onUpload }: BulkUploadCSVProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleFileUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n').filter(line => line.trim())
      const data = lines.slice(1).map(line => {
        const [name, type, url] = line.split(',').map(s => s.trim())
        return { name, type: type || 'url', data: { url: url || '' } }
      })
      onUpload(data)
    }
    reader.readAsText(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'text/csv') {
      handleFileUpload(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  return (
    <div
      className={`rounded-lg border-2 border-dashed p-8 text-center transition ${
        isDragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 bg-gray-50'
      }`}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <div className="space-y-4">
        <div className="text-4xl">📄</div>
        <div>
          <p className="text-sm font-medium text-gray-900">
            Drag and drop CSV file here, or
          </p>
          <label className="mt-2 inline-block cursor-pointer text-sm font-semibold text-blue-600 hover:text-blue-500">
            browse files
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>
        <p className="text-xs text-gray-500">
          CSV file with columns: name, type, url
        </p>
      </div>
    </div>
  )
}
