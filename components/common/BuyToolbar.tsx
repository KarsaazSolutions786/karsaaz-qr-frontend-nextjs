'use client'

import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { Sparkles } from 'lucide-react'

interface BuyToolbarProps {
  message?: string
  ctaText?: string
  ctaUrl?: string
  className?: string
}

export function BuyToolbar({
  message,
  ctaText,
  ctaUrl = '/pricing',
  className,
}: BuyToolbarProps) {
  const { t } = useTranslation()
  const resolvedMessage = message ?? t('Upgrade to unlock all features')
  const resolvedCtaText = ctaText ?? t('Upgrade Now')
  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-blue-200 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-white shadow-lg sm:px-6',
        className
      )}
    >
      <div className="flex items-center gap-2 text-sm font-medium">
        <Sparkles className="h-4 w-4" />
        <span>{resolvedMessage}</span>
      </div>
      <a
        href={ctaUrl}
        className="rounded-md bg-white px-4 py-1.5 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50"
      >
        {resolvedCtaText}
      </a>
    </div>
  )
}
