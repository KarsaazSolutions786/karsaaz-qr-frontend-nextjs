'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

const sizeMap = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-14 w-14', xl: 'h-20 w-20' } as const

interface AppLogoProps {
  src?: string
  fallbackText?: string
  size?: keyof typeof sizeMap
  className?: string
}

/**
 * Purpose: Executes AppLogo functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function AppLogo({ src, fallbackText = 'K', size = 'md', className }: AppLogoProps) {
  const { t } = useTranslation()
  const [hasError, setHasError] = useState(false)

  if (!src || hasError) {
    return (
      <div
        className={cn(
          sizeMap[size],
          'flex items-center justify-center rounded-lg bg-blue-600 font-bold text-white select-none',
          className
        )}
      >
        {fallbackText.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={t("App logo")}
      onError={() => setHasError(true)}
      className={cn(sizeMap[size], 'rounded-lg object-contain', className)}
    />
  )
}
