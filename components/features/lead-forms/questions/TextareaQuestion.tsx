'use client'

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'

interface TextareaQuestionProps {
  id: string
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  error?: string
}

export default function TextareaQuestion({
  id,
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  error,
}: TextareaQuestionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-gray-700 font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Textarea
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        rows={4}
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
