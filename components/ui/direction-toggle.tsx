'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { useDirection } from '@/lib/context/DirectionContext'

interface DirectionToggleProps {
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function DirectionToggle({
  className,
  showLabel = true,
  size = 'md',
}: DirectionToggleProps) {
  const { toggleDirection, isRTL } = useDirection()

  const sizeClasses = {
    sm: 'h-6 w-12 text-xs',
    md: 'h-8 w-16 text-sm',
    lg: 'h-10 w-20 text-base',
  }

  const thumbSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showLabel && <span className="text-sm text-gray-600">{isRTL ? 'RTL' : 'LTR'}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={isRTL}
        aria-label={`Switch to ${isRTL ? 'left-to-right' : 'right-to-left'} direction`}
        onClick={toggleDirection}
        className={cn(
          'relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          isRTL ? 'bg-blue-600' : 'bg-gray-200',
          sizeClasses[size]
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
            thumbSizeClasses[size],
            isRTL ? 'translate-x-full' : 'translate-x-0'
          )}
          style={{
            transform: isRTL ? `translateX(calc(100% - 0.25rem))` : 'translateX(0.125rem)',
          }}
        />
        <span className="sr-only">{isRTL ? 'Right-to-left' : 'Left-to-right'}</span>
      </button>
    </div>
  )
}

// Icon-based direction toggle
interface DirectionIconToggleProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function DirectionIconToggle({ className, size = 'md' }: DirectionIconToggleProps) {
  const { direction, toggleDirection, isRTL } = useDirection()

  const sizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3',
  }

  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  return (
    <button
      type="button"
      onClick={toggleDirection}
      className={cn(
        'rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
        sizeClasses[size],
        className
      )}
      title={`Switch to ${isRTL ? 'LTR' : 'RTL'}`}
      aria-label={`Current direction: ${direction}. Click to switch to ${isRTL ? 'left-to-right' : 'right-to-left'}`}
    >
      {isRTL ? (
        // RTL icon - text aligned right
        <svg
          className={iconSizeClasses[size]}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M3 14h18M3 18h12"
          />
        </svg>
      ) : (
        // LTR icon - text aligned left
        <svg
          className={iconSizeClasses[size]}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M3 14h18M9 18h12"
          />
        </svg>
      )}
    </button>
  )
}

// Button-style direction selector
interface DirectionSelectorProps {
  className?: string
}

export function DirectionSelector({ className }: DirectionSelectorProps) {
  const { direction, setDirection } = useDirection()

  return (
    <div className={cn('inline-flex rounded-md shadow-sm', className)}>
      <button
        type="button"
        onClick={() => setDirection('ltr')}
        className={cn(
          'relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-l-md border focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500',
          direction === 'ltr'
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        )}
      >
        LTR
      </button>
      <button
        type="button"
        onClick={() => setDirection('rtl')}
        className={cn(
          'relative -ml-px inline-flex items-center px-3 py-2 text-sm font-medium rounded-r-md border focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500',
          direction === 'rtl'
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        )}
      >
        RTL
      </button>
    </div>
  )
}

export default DirectionToggle
