'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface RadioGroupContextValue {
  value?: string
  onValueChange?: (value: string) => void
  name?: string
}

const RadioGroupContext = React.createContext<RadioGroupContextValue>({})

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  name?: string
  options?: { value: string; label: string }[]
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, defaultValue, onValueChange, name, options, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || '')
    const currentValue = value !== undefined ? value : internalValue

    const handleChange = React.useCallback(
      (val: string) => {
        if (value === undefined) setInternalValue(val)
        onValueChange?.(val)
      },
      [value, onValueChange]
    )

    return (
      <RadioGroupContext.Provider value={{ value: currentValue, onValueChange: handleChange, name }}>
        <div ref={ref} role="radiogroup" className={cn('space-y-2', className)} {...props}>
          {options
            ? options.map((opt) => (
                <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-sm">
                  <RadioGroupItem value={opt.value} />
                  {opt.label}
                </label>
              ))
            : children}
        </div>
      </RadioGroupContext.Provider>
    )
  }
)
RadioGroup.displayName = 'RadioGroup'

export interface RadioGroupItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string
  disabled?: boolean
}

const RadioGroupItem = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  ({ className, value: itemValue, disabled = false, ...props }, ref) => {
    const { value, onValueChange, name } = React.useContext(RadioGroupContext)
    const isSelected = value === itemValue

    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={isSelected}
        disabled={disabled}
        data-name={name}
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-gray-300 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
          isSelected && 'border-blue-500',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
        onClick={() => !disabled && onValueChange?.(itemValue)}
        {...props}
      >
        {isSelected && <span className="h-2 w-2 rounded-full bg-blue-500" />}
      </button>
    )
  }
)
RadioGroupItem.displayName = 'RadioGroupItem'

export { RadioGroup, RadioGroupItem }
