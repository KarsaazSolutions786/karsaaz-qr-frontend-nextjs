'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  checked?: boolean
  indeterminate?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, indeterminate = false, onCheckedChange, disabled, ...props }, ref) => {
    const innerRef = React.useRef<HTMLInputElement>(null)
    const combinedRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        (innerRef as React.MutableRefObject<HTMLInputElement | null>).current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
      },
      [ref]
    )

    React.useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = indeterminate
      }
    }, [indeterminate])

    return (
      <label
        className={cn(
          'inline-flex cursor-pointer items-center',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <span
          className={cn(
            'relative flex h-4 w-4 shrink-0 items-center justify-center rounded border border-gray-300 transition-colors',
            'focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-1',
            (checked || indeterminate) && 'border-blue-500 bg-blue-500',
            className
          )}
        >
          <input
            ref={combinedRef}
            type="checkbox"
            className="absolute inset-0 cursor-pointer opacity-0"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            {...props}
          />
          {checked && !indeterminate && (
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
          {indeterminate && (
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
            </svg>
          )}
        </span>
      </label>
    )
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
