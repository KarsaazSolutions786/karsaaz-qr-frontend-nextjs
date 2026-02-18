'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'
import {
  QrCodeIcon,
  ChartBarIcon,
  LinkIcon,
  NewspaperIcon,
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  UserIcon,
  CreditCardIcon,
  Bars3Icon,
  XMarkIcon,
  FolderIcon,
  PlusIcon,
  ArchiveBoxIcon,
  CloudIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'

// QR Management group
const qrManagementItems = [
  { name: 'Create QR', href: '/qrcodes/new', icon: PlusIcon },
  { name: 'My QR Codes', href: '/qrcodes', icon: QrCodeIcon },
  { name: 'Archived', href: '/qrcodes?archived=true', icon: ArchiveBoxIcon },
]

// Main navigation groups (collapsible)
const navigationGroups = [
  {
    name: 'QR Management',
    icon: QrCodeIcon,
    locked: true, // Always expanded
    items: qrManagementItems,
  },
]

// Standalone navigation items
const standaloneNavigation = [
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Cloud Storage', href: '/cloud-storage', icon: CloudIcon },
  { name: 'Biolinks', href: '/biolinks', icon: LinkIcon },
  { name: 'Blog Posts', href: '/blog-posts', icon: NewspaperIcon },
  { name: 'Content Blocks', href: '/content-blocks', icon: Squares2X2Icon },
  { name: 'Lead Forms', href: '/lead-forms', icon: ClipboardDocumentListIcon },
]

// Settings navigation
const settingsNavigation = [
  { name: 'Account', href: '/account', icon: UserIcon },
  { name: 'Billing', href: '/billing', icon: CreditCardIcon },
  { name: 'Subscription', href: '/subscriptions', icon: SparklesIcon },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'QR Management': true, // Always expanded by default
  })

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      const currentPath = window.location.pathname
      router.push(`/login?from=${encodeURIComponent(currentPath)}`)
    }
  }, [user, isLoading, router])

  const toggleGroup = (groupName: string, isLocked: boolean) => {
    if (isLocked) return // Don't toggle locked groups
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }))
  }

  const isItemActive = (href: string) => {
    if (href === '/qrcodes?archived=true') {
      return pathname === '/qrcodes' && window.location.search.includes('archived=true')
    }
    return pathname === href || pathname?.startsWith(`${href}/`)
  }

  // Don't show loading state - let child pages handle their own loading
  // This prevents hydration mismatch errors
  if (!isLoading && !user) {
    // Redirecting to login, show nothing
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/80 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
            <Link href="/qrcodes" className="flex items-center">
              <QrCodeIcon className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Karsaaz <span className="text-primary">QR</span>
              </span>
            </Link>
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {/* Navigation Groups (Collapsible) */}
            {navigationGroups.map((group) => {
              const isExpanded = expandedGroups[group.name] ?? false
              return (
                <div key={group.name} className="mb-4">
                  <button
                    onClick={() => toggleGroup(group.name, group.locked || false)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 text-sm font-semibold
                      text-gray-700 hover:bg-gray-50 rounded-lg transition-colors
                      ${group.locked ? 'cursor-default' : 'cursor-pointer'}
                    `}
                  >
                    <div className="flex items-center">
                      <group.icon className="mr-3 h-5 w-5 text-gray-500" />
                      <span>{group.name}</span>
                    </div>
                    {!group.locked && (
                      <ChevronRightIcon
                        className={`h-4 w-4 text-gray-500 transition-transform ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      />
                    )}
                  </button>
                  
                  {/* Group Items */}
                  {(isExpanded || group.locked) && (
                    <div className="ml-8 mt-1 space-y-1">
                      {group.items?.map((item) => {
                        const active = isItemActive(item.href)
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={`
                              flex items-center px-3 py-2 text-sm font-medium rounded-lg
                              transition-colors duration-150
                              ${
                                active
                                  ? 'bg-primary text-white'
                                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                              }
                            `}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <item.icon className="mr-3 h-4 w-4" />
                            {item.name}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Standalone Items */}
            {standaloneNavigation.map((item) => {
              const active = isItemActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-lg
                    transition-colors duration-150
                    ${
                      active
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}

            {/* Divider */}
            <div className="my-4 border-t border-gray-200" />

            {/* Settings navigation */}
            {settingsNavigation.map((item) => {
              const active = isItemActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-lg
                    transition-colors duration-150
                    ${
                      active
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Upgrade Banner */}
          <div className="mx-4 mb-4 p-4 bg-gradient-to-br from-primary to-purple-700 rounded-xl text-white">
            <div className="flex items-center gap-2 font-bold text-sm mb-1">
              <SparklesIcon className="h-4 w-4" />
              Upgrade to PRO
            </div>
            <p className="text-xs opacity-90 mb-3">
              Get unlimited dynamic QRs and advanced analytics.
            </p>
            <Link
              href="/billing"
              className="block w-full text-center bg-white text-primary font-bold text-sm py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Upgrade Now
            </Link>
          </div>

          {/* User info & Logout */}
          {user && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                  {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => {/* Add logout handler */}}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 flex h-16 items-center gap-x-4 bg-white border-b border-gray-200 px-4 shadow-sm lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-700"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
            Karsaaz QR
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}
