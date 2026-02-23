'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

interface StarsQuestionProps {
  value: number
  onChange: (value: number) => void
  maxStars?: 5 | 10
  label?: string
  className?: string
}

export function StarsQuestion({
  value,
  onChange,
  maxStars = 5,
  label,
  className,
}: StarsQuestionProps) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className={cn('space-y-2', className)}>
      {label && <p className="text-sm font-medium text-gray-700">{label}</p>}
      <div
        className="flex gap-1"
        role="radiogroup"
        aria-label={label ?? 'Star rating'}
        onMouseLeave={() => setHovered(0)}
      >
        {Array.from({ length: maxStars }, (_, i) => i + 1).map(star => {
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
                className={cn(
                  'h-7 w-7 transition-colors',
                  filled ? 'fill-yellow-400 text-yellow-400' : 'fill-transparent text-gray-300'
                )}
              />
            </button>
          )
        })}
      </div>
      {value > 0 && (
        <p className="text-xs text-gray-500">
          {value} / {maxStars}
        </p>
      )}
    </div>
  )
}
