'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked, defaultChecked = false, onCheckedChange, label, disabled, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked)
    const isChecked = checked !== undefined ? checked : internalChecked

    const toggle = React.useCallback(() => {
      if (disabled) return
      const next = !isChecked
      if (checked === undefined) setInternalChecked(next)
      onCheckedChange?.(next)
    }, [isChecked, checked, disabled, onCheckedChange])

    const element = (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          isChecked ? 'bg-blue-500' : 'bg-gray-300',
          className
        )}
        onClick={toggle}
        {...props}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
            isChecked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    )

    if (label) {
      return (
        <label className={cn('inline-flex items-center gap-2 text-sm', disabled && 'cursor-not-allowed opacity-50')}>
          {element}
          {label}
        </label>
      )
    }

    return element
  }
)
Switch.displayName = 'Switch'

export { Switch }
