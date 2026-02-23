/**
 * ScriptSupportLink Component (T360)
 *
 * Small help/support link, typically placed in dashboard footer.
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { LifeBuoy } from 'lucide-react'

export interface ScriptSupportLinkProps {
  href?: string
  label?: string
}

export function ScriptSupportLink({
  href = '/support-tickets',
  label = 'Need help?',
}: ScriptSupportLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors py-1 px-2 rounded-md hover:bg-gray-100"
    >
      <LifeBuoy className="w-3.5 h-3.5" />
      <span>{label}</span>
    </Link>
  )
}
