'use client'

import { cn } from '@/lib/utils'

interface AnimatedBadgeProps {
  count?: number
  variant?: 'dot' | 'count'
  pulse?: boolean
  className?: string
}

export function AnimatedBadge({
  count = 0,
  variant = 'count',
  pulse = false,
  className,
}: AnimatedBadgeProps) {
  if (variant === 'count' && count <= 0) return null

  return (
    <span className={cn('relative inline-flex', className)}>
      {pulse && (
        <span className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-75" />
      )}
      <span
        className={cn(
          'relative inline-flex items-center justify-center rounded-full bg-red-500 text-white font-medium',
          variant === 'dot' ? 'h-2.5 w-2.5' : 'h-5 min-w-5 px-1.5 text-xs'
        )}
      >
        {variant === 'count' ? (count > 99 ? '99+' : count) : null}
      </span>
    </span>
  )
}
