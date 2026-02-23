/**
 * ColorCustomizationDisabledMessage Component (T362)
 *
 * Inline warning shown when the user's plan doesn't allow color customization.
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { Lock } from 'lucide-react'

export interface ColorCustomizationDisabledMessageProps {
  upgradeUrl?: string
}

export function ColorCustomizationDisabledMessage({
  upgradeUrl = '/plans',
}: ColorCustomizationDisabledMessageProps) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
      <Lock className="w-4 h-4 shrink-0" />
      <span>
        Color customization is not available on your current plan.{' '}
        <Link
          href={upgradeUrl}
          className="font-medium underline underline-offset-2 hover:text-amber-900"
        >
          Upgrade to unlock
        </Link>
      </span>
    </div>
  )
}
