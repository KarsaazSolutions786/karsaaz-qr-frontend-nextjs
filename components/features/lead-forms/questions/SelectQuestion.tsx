'use client'

import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'

interface SelectQuestionProps {
  id: string
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  required?: boolean
  error?: string
}

export default function SelectQuestion({
  id,
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  required,
  error,
}: SelectQuestionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-gray-700 font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={`w-full h-10 rounded-md border px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 ${
          error
            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500'
        }`}
      >
        <option value="">{placeholder || 'Select an option'}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  )
}
