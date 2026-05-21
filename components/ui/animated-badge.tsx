'use client'

import { cn } from '@/lib/utils'

export type BadgeAnimation = 'none' | 'pulse' | 'bounce'
export type BadgeColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'gray'

interface AnimatedBadgeProps {
  count?: number
  variant?: 'dot' | 'count'
  animation?: BadgeAnimation
  /** @deprecated Use animation="pulse" instead */
  pulse?: boolean
  color?: BadgeColor
  className?: string
}

const colorMap: Record<BadgeColor, { bg: string; ping: string }> = {
  red: { bg: 'bg-red-500', ping: 'bg-red-400' },
  blue: { bg: 'bg-blue-500', ping: 'bg-blue-400' },
  green: { bg: 'bg-green-500', ping: 'bg-green-400' },
  yellow: { bg: 'bg-yellow-500', ping: 'bg-yellow-400' },
  purple: { bg: 'bg-purple-500', ping: 'bg-purple-400' },
  gray: { bg: 'bg-gray-500', ping: 'bg-gray-400' },
}

/**
 * Purpose: Executes AnimatedBadge functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function AnimatedBadge({
  count = 0,
  variant = 'count',
  animation = 'none',
  pulse = false,
  color = 'red',
  className,
}: AnimatedBadgeProps) {
  if (variant === 'count' && count <= 0) return null

  const resolvedAnimation = pulse ? 'pulse' : animation
  const { bg, ping } = colorMap[color]

  return (
    <span className={cn('relative inline-flex', className)}>
      {resolvedAnimation === 'pulse' && (
        <span
          className={cn(
            'absolute inset-0 animate-ping rounded-full opacity-75',
            ping
          )}
        />
      )}
      <span
        className={cn(
          'relative inline-flex items-center justify-center rounded-full text-white font-medium',
          bg,
          variant === 'dot' ? 'h-2.5 w-2.5' : 'h-5 min-w-5 px-1.5 text-xs',
          resolvedAnimation === 'bounce' && 'animate-bounce'
        )}
      >
        {variant === 'count' ? (count > 99 ? '99+' : count) : null}
      </span>
    </span>
  )
}
