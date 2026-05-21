'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Copy, Check } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

interface ValueDisplayInputProps {
  value: string
  label?: string
  className?: string
}

/**
 * Purpose: Executes ValueDisplayInput functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function ValueDisplayInput({ value, label, className }: ValueDisplayInputProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  /**
   * Purpose: Executes handleCopy functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('space-y-1', className)}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="flex items-center gap-2">
        <input
          type="text"
          readOnly
          value={value}
          className="flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-500" />
              {t('Copied!')}
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              {t('Copy')}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
