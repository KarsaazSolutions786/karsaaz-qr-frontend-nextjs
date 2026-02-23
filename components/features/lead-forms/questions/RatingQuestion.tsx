'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { AlertCircle, Star } from 'lucide-react'

interface RatingQuestionProps {
  id: string
  label: string
  name: string
  value: number
  onChange: (value: number) => void
  required?: boolean
  error?: string
  min?: number
  max?: number
  variant?: 'number' | 'stars'
}

export default function RatingQuestion({
  id,
  label,
  name: _name,
  value,
  onChange,
  required,
  error,
  min = 1,
  max = 5,
  variant = 'stars',
}: RatingQuestionProps) {
  const [hovered, setHovered] = useState(0)

  if (variant === 'stars') {
    const count = max - min + 1
    return (
      <div className="space-y-2">
        <Label className="text-gray-700 font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <div
          className="flex gap-1"
          role="radiogroup"
          aria-labelledby={id}
          onMouseLeave={() => setHovered(0)}
        >
          {Array.from({ length: count }, (_, i) => i + min).map((star) => {
            const filled = star <= (hovered || value)
            return (
              <button
                key={star}
                type="button"
                onClick={() => onChange(star)}
                onMouseEnter={() => setHovered(star)}
                className="transition-transform hover:scale-110 focus:outline-none"
                aria-label={`${star} star${star !== 1 ? 's' : ''}`}
              >
                <Star
                  className={`h-8 w-8 transition-colors ${
                    filled
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-transparent text-gray-300'
                  }`}
                />
              </button>
            )
          })}
        </div>
        {value > 0 && (
          <p className="text-sm text-gray-500">
            {value} / {max}
          </p>
        )}
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}
      </div>
    )
  }

  // Number rating variant
  const range = Array.from({ length: max - min + 1 }, (_, i) => min + i)
  return (
    <div className="space-y-2">
      <Label className="text-gray-700 font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby={id}>
        {range.map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold transition-all ${
              value === num
                ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            {num}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{min} — Low</span>
        <span>{max} — High</span>
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
