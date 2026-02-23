/**
 * DashboardBanner Component (T358)
 *
 * Dismissible announcement banner with type-based styling.
 * Persists dismissed state in localStorage.
 */

'use client'

import React, { useState, useEffect } from 'react'
import { X, Info, AlertTriangle, CheckCircle, Megaphone } from 'lucide-react'

export interface DashboardBannerProps {
  type: 'info' | 'warning' | 'success' | 'promo'
  message: string
  actionUrl?: string
  actionLabel?: string
  onDismiss?: () => void
}

const STORAGE_PREFIX = 'dashboard-banner-dismissed-'

const typeStyles: Record<DashboardBannerProps['type'], string> = {
  info: 'bg-blue-600 text-white',
  warning: 'bg-amber-500 text-white',
  success: 'bg-green-600 text-white',
  promo: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
}

const typeIcons: Record<DashboardBannerProps['type'], React.ReactNode> = {
  info: <Info className="w-5 h-5 shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 shrink-0" />,
  success: <CheckCircle className="w-5 h-5 shrink-0" />,
  promo: <Megaphone className="w-5 h-5 shrink-0" />,
}

export function DashboardBanner({
  type,
  message,
  actionUrl,
  actionLabel,
  onDismiss,
}: DashboardBannerProps) {
  const storageKey = `${STORAGE_PREFIX}${btoa(message).slice(0, 20)}`
  const [isDismissed, setIsDismissed] = useState(true) // default hidden to avoid flash

  useEffect(() => {
    setIsDismissed(localStorage.getItem(storageKey) === 'true')
  }, [storageKey])

  const handleDismiss = () => {
    localStorage.setItem(storageKey, 'true')
    setIsDismissed(true)
    onDismiss?.()
  }

  if (isDismissed) return null

  return (
    <div className={`${typeStyles[type]} shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {typeIcons[type]}
            <p className="text-sm font-medium truncate">{message}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {actionUrl && actionLabel && (
              <a
                href={actionUrl}
                className="inline-flex items-center px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-md text-sm font-medium transition-colors"
              >
                {actionLabel}
              </a>
            )}
            <button
              onClick={handleDismiss}
              className="p-1.5 hover:bg-white/20 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
