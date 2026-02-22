'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CodeInputProps {
  className?: string
  length?: number
  onChange?: (value: string) => void
  disabled?: boolean
}

const CodeInput = React.forwardRef<HTMLDivElement, CodeInputProps>(
  ({ className, length = 6, onChange, disabled = false }, ref) => {
    const [values, setValues] = React.useState<string[]>(Array(length).fill(''))
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

    const handleChange = React.useCallback(
      (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^0-9]/g, '')
        if (!val && e.target.value !== '') return

        const newValues = [...values]
        newValues[index] = val.slice(-1)
        setValues(newValues)
        onChange?.(newValues.join(''))

        if (val && index < length - 1) {
          inputRefs.current[index + 1]?.focus()
        }
      },
      [values, length, onChange]
    )

    const handleKeyDown = React.useCallback(
      (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !values[index] && index > 0) {
          inputRefs.current[index - 1]?.focus()
        }
        if (e.key === 'ArrowLeft' && index > 0) {
          inputRefs.current[index - 1]?.focus()
        }
        if (e.key === 'ArrowRight' && index < length - 1) {
          inputRefs.current[index + 1]?.focus()
        }
      },
      [values, length]
    )

    const handlePaste = React.useCallback(
      (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, length)
        if (!pasted) return
        const newValues = [...values]
        for (let i = 0; i < pasted.length; i++) {
          newValues[i] = pasted[i]!
        }
        setValues(newValues)
        onChange?.(newValues.join(''))
        const focusIndex = Math.min(pasted.length, length - 1)
        inputRefs.current[focusIndex]?.focus()
      },
      [values, length, onChange]
    )

    return (
      <div ref={ref} className={cn('flex gap-2', className)}>
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={values[i]}
            disabled={disabled}
            className={cn(
              'h-12 w-10 rounded-md border border-gray-300 bg-white text-center text-lg font-semibold shadow-sm transition-colors',
              'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
          />
        ))}
      </div>
    )
  }
)
CodeInput.displayName = 'CodeInput'

export { CodeInput }
