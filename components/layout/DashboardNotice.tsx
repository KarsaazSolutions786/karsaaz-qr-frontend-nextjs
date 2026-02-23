/**
 * DashboardNotice Component (T359)
 *
 * Persistent system notice that cannot be dismissed.
 * Used for maintenance windows, updates, and new features.
 */

'use client'

import React from 'react'
import { Wrench, ArrowUpCircle, Sparkles } from 'lucide-react'

export interface DashboardNoticeProps {
  title: string
  message: string
  type: 'maintenance' | 'update' | 'feature'
}

const typeConfig: Record<
  DashboardNoticeProps['type'],
  { icon: React.ReactNode; border: string; bg: string; text: string }
> = {
  maintenance: {
    icon: <Wrench className="w-5 h-5 text-amber-600 shrink-0" />,
    border: 'border-amber-300',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
  },
  update: {
    icon: <ArrowUpCircle className="w-5 h-5 text-blue-600 shrink-0" />,
    border: 'border-blue-300',
    bg: 'bg-blue-50',
    text: 'text-blue-800',
  },
  feature: {
    icon: <Sparkles className="w-5 h-5 text-purple-600 shrink-0" />,
    border: 'border-purple-300',
    bg: 'bg-purple-50',
    text: 'text-purple-800',
  },
}

export function DashboardNotice({ title, message, type }: DashboardNoticeProps) {
  const config = typeConfig[type]

  return (
    <div
      className={`${config.bg} ${config.border} ${config.text} border rounded-lg p-4`}
      role="status"
    >
      <div className="flex items-start gap-3">
        {config.icon}
        <div className="min-w-0">
          <h4 className="text-sm font-semibold">{title}</h4>
          <p className="text-sm mt-0.5 opacity-90">{message}</p>
        </div>
      </div>
    </div>
  )
}
