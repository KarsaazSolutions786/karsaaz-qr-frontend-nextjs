'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Check, X } from 'lucide-react'

interface ExtendedLicenseProps {
  isOpen: boolean
  onClose: () => void
  features?: string[]
  className?: string
}

export function ExtendedLicense({
  isOpen,
  onClose,
  features = [],
  className,
}: ExtendedLicenseProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div
        className={cn('relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl', className)}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-lg font-bold text-gray-900">Extended License</h2>
        <p className="mt-2 text-sm text-gray-600">
          Unlock additional capabilities with an extended license:
        </p>

        {features.length > 0 && (
          <ul className="mt-4 space-y-2">
            {features.map(feature => (
              <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="h-4 w-4 shrink-0 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Maybe Later
          </button>
          <Link
            href="/pricing"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            View Plans
          </Link>
        </div>
      </div>
    </div>
  )
}
