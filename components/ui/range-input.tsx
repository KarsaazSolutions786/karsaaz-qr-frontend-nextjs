'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface RangeInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'size'
> {
  showValue?: boolean
  showMinMax?: boolean
  label?: string
  unit?: string
  formatValue?: (value: number) => string
  onChange?: (value: number) => void
  onChangeComplete?: (value: number) => void
  variant?: 'default' | 'gradient' | 'success' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  marks?: { value: number; label?: string }[]
}

const RangeInput = React.forwardRef<HTMLInputElement, RangeInputProps>(
  (
    {
      className,
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue,
      showValue = true,
      showMinMax = true,
      label,
      unit = '',
      formatValue,
      onChange,
      onChangeComplete,
      variant = 'default',
      size = 'md',
      marks,
      disabled,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<number>(Number(defaultValue ?? min))
    const [isDragging, setIsDragging] = React.useState(false)
    const currentValue = value !== undefined ? Number(value) : internalValue

    // Calculate percentage for gradient fill
    const percentage = ((currentValue - Number(min)) / (Number(max) - Number(min))) * 100

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value)
        if (value === undefined) {
          setInternalValue(newValue)
        }
        onChange?.(newValue)
      },
      [value, onChange]
    )

    const handleMouseDown = () => setIsDragging(true)
    const handleMouseUp = () => {
      setIsDragging(false)
      onChangeComplete?.(currentValue)
    }

    const displayValue = formatValue ? formatValue(currentValue) : `${currentValue}${unit}`

    const variantStyles = {
      default: 'bg-blue-500',
      gradient: 'bg-gradient-to-r from-blue-500 to-purple-500',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
    }

    const sizeStyles = {
      sm: {
        track: 'h-1',
        thumb: 'h-3 w-3',
        text: 'text-xs',
        valueBox: 'px-1.5 py-0.5 min-w-[2rem]',
      },
      md: {
        track: 'h-2',
        thumb: 'h-4 w-4',
        text: 'text-sm',
        valueBox: 'px-2 py-1 min-w-[2.5rem]',
      },
      lg: {
        track: 'h-3',
        thumb: 'h-5 w-5',
        text: 'text-base',
        valueBox: 'px-3 py-1.5 min-w-[3rem]',
      },
    }

    const styles = sizeStyles[size]

    return (
      <div className={cn('w-full', className)}>
        {/* Label */}
        {label && (
          <div className="flex items-center justify-between mb-2">
            <label className={cn('font-medium text-gray-700', styles.text)}>{label}</label>
            {showValue && <span className={cn('text-gray-600', styles.text)}>{displayValue}</span>}
          </div>
        )}

        {/* Range Slider Container */}
        <div className="flex items-center gap-3">
          {showMinMax && (
            <span className={cn('text-gray-500 flex-shrink-0', styles.text)}>
              {min}
              {unit}
            </span>
          )}

          {/* Slider Track Container */}
          <div className="relative flex-1">
            {/* Background Track */}
            <div
              className={cn('absolute inset-0 rounded-full bg-gray-200', styles.track)}
              style={{ top: '50%', transform: 'translateY(-50%)' }}
            />

            {/* Filled Track */}
            <div
              className={cn(
                'absolute rounded-full transition-all',
                styles.track,
                variantStyles[variant]
              )}
              style={{
                top: '50%',
                transform: 'translateY(-50%)',
                width: `${percentage}%`,
              }}
            />

            {/* Marks */}
            {marks && marks.length > 0 && (
              <div className="absolute inset-0 pointer-events-none">
                {marks.map(mark => {
                  const markPercent =
                    ((mark.value - Number(min)) / (Number(max) - Number(min))) * 100
                  return (
                    <div
                      key={mark.value}
                      className="absolute flex flex-col items-center"
                      style={{
                        left: `${markPercent}%`,
                        transform: 'translateX(-50%)',
                        top: '100%',
                        marginTop: '8px',
                      }}
                    >
                      <div className="w-0.5 h-2 bg-gray-300" />
                      {mark.label && (
                        <span className="mt-1 text-xs text-gray-500">{mark.label}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Input Range */}
            <input
              ref={ref}
              type="range"
              min={min}
              max={max}
              step={step}
              value={currentValue}
              disabled={disabled}
              className={cn(
                'relative w-full appearance-none bg-transparent cursor-pointer',
                'disabled:cursor-not-allowed disabled:opacity-50',
                // Webkit (Chrome, Safari, Edge)
                '[&::-webkit-slider-runnable-track]:bg-transparent',
                '[&::-webkit-slider-runnable-track]:rounded-full',
                `[&::-webkit-slider-runnable-track]:${styles.track}`,
                '[&::-webkit-slider-thumb]:appearance-none',
                `[&::-webkit-slider-thumb]:${styles.thumb}`,
                '[&::-webkit-slider-thumb]:rounded-full',
                '[&::-webkit-slider-thumb]:bg-white',
                '[&::-webkit-slider-thumb]:border-2',
                '[&::-webkit-slider-thumb]:border-blue-500',
                '[&::-webkit-slider-thumb]:shadow-md',
                '[&::-webkit-slider-thumb]:transition-transform',
                '[&::-webkit-slider-thumb]:duration-150',
                isDragging && '[&::-webkit-slider-thumb]:scale-110',
                '[&::-webkit-slider-thumb]:hover:scale-110',
                // Firefox
                '[&::-moz-range-track]:bg-transparent',
                '[&::-moz-range-track]:rounded-full',
                `[&::-moz-range-track]:${styles.track}`,
                '[&::-moz-range-thumb]:appearance-none',
                `[&::-moz-range-thumb]:${styles.thumb}`,
                '[&::-moz-range-thumb]:rounded-full',
                '[&::-moz-range-thumb]:bg-white',
                '[&::-moz-range-thumb]:border-2',
                '[&::-moz-range-thumb]:border-blue-500',
                '[&::-moz-range-thumb]:shadow-md',
                '[&::-moz-range-thumb]:transition-transform',
                '[&::-moz-range-thumb]:duration-150',
                isDragging && '[&::-moz-range-thumb]:scale-110',
                '[&::-moz-range-thumb]:hover:scale-110'
              )}
              onChange={handleChange}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
              {...props}
            />
          </div>

          {showMinMax && (
            <span className={cn('text-gray-500 flex-shrink-0', styles.text)}>
              {max}
              {unit}
            </span>
          )}

          {showValue && !label && (
            <span
              className={cn(
                'rounded-md border border-gray-300 bg-white text-center font-medium',
                styles.valueBox,
                styles.text
              )}
            >
              {displayValue}
            </span>
          )}
        </div>

        {/* Marks labels row (if marks have labels) */}
        {marks && marks.some(m => m.label) && (
          <div className="h-6" /> // Spacer for mark labels
        )}
      </div>
    )
  }
)
RangeInput.displayName = 'RangeInput'

// ============================================
// Dual Range Input (for min/max selection)
// ============================================

interface DualRangeInputProps {
  min?: number
  max?: number
  step?: number
  minValue: number
  maxValue: number
  onChange: (minValue: number, maxValue: number) => void
  label?: string
  unit?: string
  formatValue?: (value: number) => string
  showValues?: boolean
  className?: string
  disabled?: boolean
}

export function DualRangeInput({
  min = 0,
  max = 100,
  step = 1,
  minValue,
  maxValue,
  onChange,
  label,
  unit = '',
  formatValue,
  showValues = true,
  className,
  disabled,
}: DualRangeInputProps) {
  const minPercent = ((minValue - min) / (max - min)) * 100
  const maxPercent = ((maxValue - min) / (max - min)) * 100

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), maxValue - step)
    onChange(newMin, maxValue)
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), minValue + step)
    onChange(minValue, newMax)
  }

  const displayMin = formatValue ? formatValue(minValue) : `${minValue}${unit}`
  const displayMax = formatValue ? formatValue(maxValue) : `${maxValue}${unit}`

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          {showValues && (
            <span className="text-sm text-gray-600">
              {displayMin} - {displayMax}
            </span>
          )}
        </div>
      )}

      <div className="relative h-6">
        {/* Background Track */}
        <div className="absolute top-1/2 left-0 right-0 h-2 -translate-y-1/2 rounded-full bg-gray-200" />

        {/* Filled Track */}
        <div
          className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-blue-500"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        {/* Min Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          disabled={disabled}
          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-500 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:transition-transform disabled:opacity-50"
        />

        {/* Max Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          disabled={disabled}
          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-500 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:transition-transform disabled:opacity-50"
        />
      </div>

      {/* Min/Max Labels */}
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
    </div>
  )
}

export { RangeInput }
