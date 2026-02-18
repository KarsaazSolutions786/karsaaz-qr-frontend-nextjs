'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'
import {
  QrCodeIcon,
  LinkIcon,
  NewspaperIcon,
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  Bars3Icon,
  XMarkIcon,
  ArchiveBoxIcon,
  CloudIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  UsersIcon,
  BanknotesIcon,
  DocumentTextIcon,
  LanguageIcon,
  CodeBracketIcon,
  DocumentDuplicateIcon,
  EnvelopeIcon,
  PuzzlePieceIcon,
  Cog6ToothIcon,
  ServerIcon,
  ClockIcon,
  BellIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  GlobeAltIcon,
  HomeIcon,
  SignalIcon,
  UserGroupIcon,
  CircleStackIcon,
} from '@heroicons/react/24/outline'

// Navigation group type
interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

interface NavGroup {
  name: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  items: NavItem[]
}

// Top-level standalone items
const topNavigation: NavItem[] = [
  { name: 'Home', href: '/qrcodes', icon: HomeIcon },
  { name: 'Existing QRs', href: '/qrcodes', icon: QrCodeIcon },
  { name: 'Archived', href: '/qrcodes?archived=true', icon: ArchiveBoxIcon },
  { name: 'Cloud Storage', href: '/cloud-storage', icon: CloudIcon },
  { name: 'Connections', href: '/connections', icon: SignalIcon },
]

// Collapsible navigation groups
const navigationGroups: NavGroup[] = [
  {
    name: 'USERS',
    icon: UsersIcon,
    items: [
      { name: 'All Users', href: '/users', icon: UsersIcon },
      { name: 'Paying Users', href: '/users/paying', icon: CreditCardIcon },
      { name: 'Non Paying Users', href: '/users/non-paying', icon: UserGroupIcon },
      { name: 'Roles', href: '/users/roles', icon: ShieldCheckIcon },
    ],
  },
  {
    name: 'FINANCE',
    icon: BanknotesIcon,
    items: [
      { name: 'Plans', href: '/plans', icon: SparklesIcon },
      { name: 'Subscriptions', href: '/subscriptions', icon: CreditCardIcon },
      { name: 'Billing', href: '/billing', icon: BanknotesIcon },
      { name: 'Transactions', href: '/transactions', icon: CurrencyDollarIcon },
      { name: 'Payment Processors', href: '/payment-processors', icon: BanknotesIcon },
      { name: 'Currencies', href: '/currencies', icon: CircleStackIcon },
    ],
  },
  {
    name: 'CONTENT',
    icon: DocumentTextIcon,
    items: [
      { name: 'Blog Posts', href: '/blog-posts', icon: NewspaperIcon },
      { name: 'Content Blocks', href: '/content-blocks', icon: Squares2X2Icon },
      { name: 'Translations', href: '/translations', icon: LanguageIcon },
      { name: 'Custom Code', href: '/custom-code', icon: CodeBracketIcon },
      { name: 'Pages', href: '/pages', icon: DocumentDuplicateIcon },
      { name: 'Dynamic BioLinks', href: '/biolinks', icon: LinkIcon },
    ],
  },
  {
    name: 'CONTACTS',
    icon: EnvelopeIcon,
    items: [
      { name: 'Contact Form', href: '/contact-form', icon: EnvelopeIcon },
      { name: 'Lead Forms', href: '/lead-forms', icon: ClipboardDocumentListIcon },
    ],
  },
  {
    name: 'PLUGINS',
    icon: PuzzlePieceIcon,
    items: [
      { name: 'Available Plugins', href: '/plugins/available', icon: PuzzlePieceIcon },
      { name: 'Installed Plugins', href: '/plugins/installed', icon: Cog6ToothIcon },
    ],
  },
  {
    name: 'SYSTEM',
    icon: ServerIcon,
    items: [
      { name: 'Status', href: '/system/status', icon: SignalIcon },
      { name: 'Settings', href: '/system/settings', icon: Cog6ToothIcon },
      { name: 'Logs', href: '/system/logs', icon: ClockIcon },
      { name: 'Cache', href: '/system/cache', icon: CircleStackIcon },
      { name: 'Notifications', href: '/system/notifications', icon: BellIcon },
      { name: 'Sms Portals', href: '/system/sms-portals', icon: DevicePhoneMobileIcon },
      { name: 'Auth Workflow', href: '/system/auth-workflow', icon: ShieldCheckIcon },
      { name: 'Abuse Reports', href: '/system/abuse-reports', icon: ExclamationTriangleIcon },
      { name: 'Domains', href: '/system/domains', icon: GlobeAltIcon },
    ],
  },
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
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      const currentPath = window.location.pathname
      router.push(`/login?from=${encodeURIComponent(currentPath)}`)
    }
  }, [user, isLoading, router])

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }))
  }

  const isItemActive = (href: string) => {
    // Don't check query params during SSR to avoid hydration issues
    if (href.includes('?')) {
      return pathname === href.split('?')[0]
    }
    return pathname === href || pathname?.startsWith(`${href}/`)
  }

  // Check if any item in a group is active (to auto-highlight group header)
  const isGroupActive = (group: NavGroup) => {
    return group.items.some(item => isItemActive(item.href))
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
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            {/* Top-level standalone items */}
            <div className="space-y-1">
              {topNavigation.map((item) => {
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
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                )
              })}
            </div>

            {/* Collapsible Navigation Groups */}
            {navigationGroups.map((group) => {
              const isExpanded = expandedGroups[group.name] ?? false
              const groupActive = isGroupActive(group)
              return (
                <div key={group.name} className="mt-4">
                  <button
                    onClick={() => toggleGroup(group.name)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 text-xs font-bold
                      uppercase tracking-wider rounded-lg transition-colors cursor-pointer
                      ${groupActive ? 'text-primary' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
                    `}
                  >
                    <div className="flex items-center">
                      <group.icon className="mr-2 h-4 w-4" />
                      <span>{group.name}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDownIcon className="h-4 w-4" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4" />
                    )}
                  </button>
                  
                  {/* Group Items */}
                  {isExpanded && (
                    <div className="mt-1 ml-2 space-y-1 border-l-2 border-gray-200 pl-3">
                      {group.items.map((item) => {
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
                            <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                            {item.name}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
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
