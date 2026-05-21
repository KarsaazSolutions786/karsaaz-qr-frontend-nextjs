/**
 * ScriptSupportLink Component (T360)
 *
 * Small help/support link, typically placed in dashboard footer.
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { LifeBuoy } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export interface ScriptSupportLinkProps {
  href?: string
  label?: string
}

/**
 * Purpose: Executes ScriptSupportLink functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function ScriptSupportLink({
  href = '/support-tickets',
  label,
}: ScriptSupportLinkProps) {
  const { t } = useTranslation()
  const displayLabel = label || t('Need help?')
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors py-1 px-2 rounded-md hover:bg-gray-100"
    >
      <LifeBuoy className="w-3.5 h-3.5" />
      <span>{displayLabel}</span>
    </Link>
  )
}
