'use client'

import React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WebsiteBannerProps {
  type: 'info' | 'warning' | 'success' | 'promo'
  message: string
  dismissible?: boolean
  onDismiss?: () => void
}

const typeStyles: Record<WebsiteBannerProps['type'], string> = {
  info: 'bg-blue-600 text-white',
  warning: 'bg-amber-500 text-white',
  success: 'bg-green-600 text-white',
  promo: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white',
}

export function WebsiteBanner({ type, message, dismissible = false, onDismiss }: WebsiteBannerProps) {
  return (
    <div className={cn('relative px-4 py-2.5 text-center text-sm font-medium', typeStyles[type])}>
      <span>{message}</span>
      {dismissible && (
        <button
          onClick={onDismiss}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-white/20 transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
