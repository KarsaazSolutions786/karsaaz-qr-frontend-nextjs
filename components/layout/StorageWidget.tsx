'use client'

import React from 'react'
import { useStorage } from '@/lib/hooks/useStorage'
import { useTranslation } from '@/lib/i18n'

interface StorageWidgetProps {
  collapsed?: boolean
}

export default function StorageWidget({ collapsed = false }: StorageWidgetProps) {
  const { t } = useTranslation()
  const {
    stats,
    isLoading,
    percentage,
    isNearLimit,
    isAtLimit,
    isOverLimit,
    usedFormatted,
    quotaFormatted,
    isUnlimited,
  } = useStorage()

  if (isLoading || !stats) return null

  // Don't show for unlimited storage
  if (isUnlimited) return null

  const barColor = isOverLimit
    ? 'bg-red-500'
    : isAtLimit
      ? 'bg-orange-500'
      : isNearLimit
        ? 'bg-yellow-500'
        : 'bg-blue-500'

  const percentageTextColor = isOverLimit
    ? 'text-red-500'
    : isAtLimit
      ? 'text-orange-500'
      : isNearLimit
        ? 'text-yellow-500'
        : 'text-blue-500'

  if (collapsed) {
    return (
      <div className="px-2 py-2" title={`${usedFormatted} / ${quotaFormatted}`}>
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="px-3 py-2.5 mx-2 mb-2 rounded-lg bg-gray-100/80 border border-gray-200">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-gray-600">
          {t('Storage')}
        </span>
        <span className={`text-xs font-medium ${percentageTextColor}`}>
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-1.5">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${Math.max(Math.min(percentage, 100), 1)}%` }}
        />
      </div>
      <div className="text-[10px] text-gray-500">
        {usedFormatted} / {quotaFormatted}
      </div>
    </div>
  )
}
