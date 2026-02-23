'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'
import {
  PlusIcon,
  QrCodeIcon,
  ChartBarIcon,
  SparklesIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

const actions = [
  { name: 'Create New QR Code', href: '/qrcodes/new', icon: QrCodeIcon, adminOnly: false },
  { name: 'View Analytics', href: '/analytics', icon: ChartBarIcon, adminOnly: false },
  { name: 'Manage Plans', href: '/plans', icon: SparklesIcon, adminOnly: false },
  { name: 'System Settings', href: '/system/settings', icon: Cog6ToothIcon, adminOnly: true },
]

export function QuickActions() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  const isAdmin = user?.roles?.[0]?.super_admin ? true : false

  const visibleActions = actions.filter((a) => !a.adminOnly || isAdmin)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Action items */}
      {open && (
        <div className="mb-2 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {visibleActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
            >
              <action.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              {action.name}
            </Link>
          ))}
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Quick actions"
      >
        {open ? <XMarkIcon className="h-6 w-6" /> : <PlusIcon className="h-6 w-6" />}
      </button>
    </div>
  )
}
