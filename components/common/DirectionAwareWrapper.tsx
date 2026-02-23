'use client'

import { type ReactNode } from 'react'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface DirectionAwareWrapperProps {
  children: ReactNode
  locale?: string
  className?: string
}

/** RTL locales commonly used */
const RTL_LOCALES = new Set([
  'ar', 'he', 'fa', 'ur', 'ps', 'sd', 'yi', 'ku', 'ug',
])

export function DirectionAwareWrapper({
  children,
  locale: localeProp,
  className,
}: DirectionAwareWrapperProps) {
  const { locale: contextLocale, dir: contextDir } = useTranslation()

  const effectiveLocale = localeProp ?? contextLocale
  const dir = localeProp
    ? RTL_LOCALES.has(localeProp) ? 'rtl' : 'ltr'
    : contextDir

  return (
    <div
      dir={dir}
      className={cn(
        dir === 'rtl' && 'text-right',
        className
      )}
      lang={effectiveLocale}
    >
      {children}
    </div>
  )
}
