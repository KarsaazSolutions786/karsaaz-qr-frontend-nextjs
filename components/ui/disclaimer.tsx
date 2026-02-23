'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Info, AlertTriangle, Scale } from 'lucide-react'

const variants = {
  info: { icon: Info, border: 'border-blue-200', bg: 'bg-blue-50', text: 'text-blue-700' },
  warning: {
    icon: AlertTriangle,
    border: 'border-yellow-200',
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
  },
  legal: { icon: Scale, border: 'border-gray-200', bg: 'bg-gray-50', text: 'text-gray-600' },
} as const

interface DisclaimerProps {
  children: React.ReactNode
  variant?: keyof typeof variants
  className?: string
}

export function Disclaimer({ children, variant = 'info', className }: DisclaimerProps) {
  const v = variants[variant]
  const Icon = v.icon

  return (
    <div className={cn('flex gap-3 rounded-lg border p-4', v.border, v.bg, className)}>
      <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', v.text)} />
      <div className={cn('text-sm', v.text)}>{children}</div>
    </div>
  )
}
