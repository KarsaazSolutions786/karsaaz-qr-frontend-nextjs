'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const sizeMap = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-14 w-14', xl: 'h-20 w-20' } as const

interface AppLogoProps {
  src?: string
  fallbackText?: string
  size?: keyof typeof sizeMap
  className?: string
}

export function AppLogo({ src, fallbackText = 'K', size = 'md', className }: AppLogoProps) {
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
      alt="App logo"
      onError={() => setHasError(true)}
      className={cn(sizeMap[size], 'rounded-lg object-contain', className)}
    />
  )
}
