'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface NumberRangeInputProps {
  className?: string
  minValue?: number
  maxValue?: number
  min?: number
  max?: number
  step?: number
  onChange?: (values: { min: number; max: number }) => void
  disabled?: boolean
}

const inputClasses =
  'h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50'

const NumberRangeInput = React.forwardRef<HTMLDivElement, NumberRangeInputProps>(
  ({ className, minValue, maxValue, min, max, step = 1, onChange, disabled = false }, ref) => {
    const [internalMin, setInternalMin] = React.useState(minValue ?? min ?? 0)
    const [internalMax, setInternalMax] = React.useState(maxValue ?? max ?? 100)

    const currentMin = minValue !== undefined ? minValue : internalMin
    const currentMax = maxValue !== undefined ? maxValue : internalMax

    const handleMinChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value)
        if (minValue === undefined) setInternalMin(val)
        onChange?.({ min: val, max: currentMax })
      },
      [minValue, currentMax, onChange]
    )

    const handleMaxChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value)
        if (maxValue === undefined) setInternalMax(val)
        onChange?.({ min: currentMin, max: val })
      },
      [maxValue, currentMin, onChange]
    )

    return (
      <div ref={ref} className={cn('flex items-center gap-2', className)}>
        <input
          type="number"
          value={currentMin}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          placeholder="Min"
          className={inputClasses}
          onChange={handleMinChange}
        />
        <span className="text-sm text-gray-400">–</span>
        <input
          type="number"
          value={currentMax}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          placeholder="Max"
          className={inputClasses}
          onChange={handleMaxChange}
        />
      </div>
    )
  }
)
NumberRangeInput.displayName = 'NumberRangeInput'

export { NumberRangeInput }
