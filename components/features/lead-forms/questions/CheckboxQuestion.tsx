'use client'

import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'

interface CheckboxQuestionProps {
  id: string
  label: string
  name: string
  value: string[]
  onChange: (value: string[]) => void
  options: string[]
  required?: boolean
  error?: string
}

export default function CheckboxQuestion({
  id,
  label,
  name,
  value,
  onChange,
  options,
  required,
  error,
}: CheckboxQuestionProps) {
  const handleToggle = (option: string) => {
    const next = value.includes(option)
      ? value.filter((v) => v !== option)
      : [...value, option]
    onChange(next)
  }

  return (
    <div className="space-y-3">
      <Label className="text-gray-700 font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="space-y-2" role="group" aria-labelledby={id}>
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <input
              type="checkbox"
              name={name}
              value={option}
              checked={value.includes(option)}
              onChange={() => handleToggle(option)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-700 group-hover:text-gray-900">
              {option}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  )
}
