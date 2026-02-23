'use client'

import { useRef } from 'react'
import { Label } from '@/components/ui/label'
import { AlertCircle, Upload, X } from 'lucide-react'

interface FileQuestionProps {
  id: string
  label: string
  name: string
  value: File | null
  onChange: (value: File | null) => void
  required?: boolean
  error?: string
  accept?: string
}

export default function FileQuestion({
  id,
  label,
  name,
  value,
  onChange,
  required,
  error,
  accept,
}: FileQuestionProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    onChange(file)
  }

  const handleClear = () => {
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-gray-700 font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {value ? (
        <div className="flex items-center gap-3 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm">
          <span className="flex-1 truncate text-gray-700">{value.name}</span>
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-400 hover:text-red-500"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`flex w-full items-center justify-center gap-2 rounded-md border-2 border-dashed px-4 py-6 text-sm transition-colors ${
            error
              ? 'border-red-300 bg-red-50 text-red-600'
              : 'border-gray-300 bg-white text-gray-500 hover:border-blue-400 hover:bg-blue-50'
          }`}
        >
          <Upload className="h-5 w-5" />
          Click to upload a file
        </button>
      )}

      <input
        ref={inputRef}
        id={id}
        name={name}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  )
}
