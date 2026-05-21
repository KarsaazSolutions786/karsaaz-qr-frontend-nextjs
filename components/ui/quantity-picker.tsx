'use client'

import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { Minus, Plus } from 'lucide-react'

interface QuantityPickerProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
}

/**
 * Purpose: Executes QuantityPicker functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function QuantityPicker({
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  className,
}: QuantityPickerProps) {
  const { t } = useTranslation()

  /**
   * Purpose: Executes decrement functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const decrement = () => {
    const next = value - step
    if (next >= min) onChange(next)
  }

  /**
   * Purpose: Executes increment functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const increment = () => {
    const next = value + step
    if (next <= max) onChange(next)
  }

  /**
   * Purpose: Executes handleInput functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    if (raw === '') return onChange(min)
    const num = Number(raw)
    if (!Number.isNaN(num)) {
      onChange(Math.min(max, Math.max(min, num)))
    }
  }

  return (
    <div className={cn('inline-flex items-center rounded-lg border border-gray-300', className)}>
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        className="flex h-9 w-9 items-center justify-center rounded-l-lg text-gray-600 transition hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label={t("Decrease")}
      >
        <Minus className="h-4 w-4" />
      </button>

      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleInput}
        className="h-9 w-14 border-x border-gray-300 bg-white text-center text-sm font-medium text-gray-900 focus:outline-none"
        aria-label={t("Quantity")}
      />

      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        className="flex h-9 w-9 items-center justify-center rounded-r-lg text-gray-600 transition hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label={t("Increase")}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
