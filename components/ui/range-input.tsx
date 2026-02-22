'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface RangeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showValue?: boolean
}

const RangeInput = React.forwardRef<HTMLInputElement, RangeInputProps>(
  ({ className, min = 0, max = 100, step = 1, value, defaultValue, showValue = true, onChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? min)
    const currentValue = value !== undefined ? value : internalValue

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (value === undefined) setInternalValue(Number(e.target.value))
        onChange?.(e)
      },
      [value, onChange]
    )

    return (
      <div className={cn('flex items-center gap-3', className)}>
        <span className="text-xs text-gray-500">{min}</span>
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          className={cn(
            'h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200',
            'accent-blue-500',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
          onChange={handleChange}
          {...props}
        />
        <span className="text-xs text-gray-500">{max}</span>
        {showValue && (
          <span className="min-w-[2.5rem] rounded-md border border-gray-300 bg-white px-2 py-1 text-center text-sm font-medium">
            {currentValue}
          </span>
        )}
      </div>
    )
  }
)
RangeInput.displayName = 'RangeInput'

export { RangeInput }
