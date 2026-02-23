'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'

interface DateQuestionProps {
  id: string
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  error?: string
  min?: string
  max?: string
}

export default function DateQuestion({
  id,
  label,
  name,
  value,
  onChange,
  required,
  error,
  min,
  max,
}: DateQuestionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-gray-700 font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={id}
        type="date"
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        min={min}
        max={max}
        className={
          error
            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500'
            : ''
        }
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
