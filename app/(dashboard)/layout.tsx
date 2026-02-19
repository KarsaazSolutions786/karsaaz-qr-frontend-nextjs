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
  ChartBarIcon,
  UserCircleIcon,
  RectangleGroupIcon,
} from '@heroicons/react/24/outline'

// Navigation types
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

// Top-level standalone items (always visible, matches original qrcodesGroup + cloudStorageGroup)
const topNavigation: NavItem[] = [
  { name: 'Home', href: '/qrcodes/new', icon: HomeIcon },
  { name: 'Existing QRs', href: '/qrcodes', icon: QrCodeIcon },
  { name: 'Archived', href: '/archived', icon: ArchiveBoxIcon },
  { name: 'QR Templates', href: '/qrcode-templates', icon: RectangleGroupIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Cloud Storage', href: '/cloud-storage', icon: CloudIcon },
  { name: 'Connections', href: '/connections', icon: SignalIcon },
]

// Collapsible navigation groups (matches original menu-store groups)
const navigationGroups: NavGroup[] = [
  {
    name: 'Users',
    icon: UsersIcon,
    items: [
      { name: 'All Users', href: '/users', icon: UsersIcon },
      { name: 'Paying Users', href: '/users/paying', icon: CreditCardIcon },
      { name: 'Non Paying Users', href: '/users/non-paying', icon: UserGroupIcon },
      { name: 'Roles', href: '/users/roles', icon: ShieldCheckIcon },
    ],
  },
  {
    name: 'Finance',
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
    name: 'Content',
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
    name: 'Contacts',
    icon: EnvelopeIcon,
    items: [
      { name: 'Contact Form', href: '/contact-form', icon: EnvelopeIcon },
      { name: 'Lead Forms', href: '/lead-forms', icon: ClipboardDocumentListIcon },
    ],
  },
  {
    name: 'Plugins',
    icon: PuzzlePieceIcon,
    items: [
      { name: 'Available Plugins', href: '/plugins/available', icon: PuzzlePieceIcon },
      { name: 'Installed Plugins', href: '/plugins/installed', icon: Cog6ToothIcon },
    ],
  },
  {
    name: 'System',
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
  const { user, isLoading, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      const currentPath = window.location.pathname
      router.push(`/login?from=${encodeURIComponent(currentPath)}`)
    }
  }, [user, isLoading, router])

  // Auto-expand group that contains active route
  useEffect(() => {
    navigationGroups.forEach((group) => {
      if (group.items.some((item) => isItemActive(item.href))) {
        setExpandedGroups((prev) => ({ ...prev, [group.name]: true }))
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }))
  }

  const isItemActive = (href: string) => {
    if (!pathname) return false
    if (href.includes('?')) {
      return pathname === href.split('?')[0]
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const isGroupActive = (group: NavGroup) => {
    return group.items.some((item) => isItemActive(item.href))
  }

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await logout()
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (!isLoading && !user) {
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

      {/* Sidebar — purple gradient matching original */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-60 flex flex-col
          bg-gradient-to-b from-[#8368dc] to-[#b664c6]
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex h-14 items-center justify-between px-4 shrink-0">
          <Link href="/qrcodes" className="flex items-center gap-2">
            <QrCodeIcon className="h-7 w-7 text-white" />
            <span className="text-lg font-bold text-white">
              Karsaaz <span className="text-white/80">QR</span>
            </span>
          </Link>
          <button
            className="lg:hidden text-white/70 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Separator line (matches original .sidebar-top dotted border) */}
        <div className="mx-4 border-t border-white/20" />

        {/* Navigation (scrollable) */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 scrollbar-hide">
          {/* Top-level items (always visible — locked group) */}
          <div className="space-y-0.5">
            {topNavigation.map((item) => {
              const active = isItemActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors
                    ${active
                      ? 'bg-black/20 text-white'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* Separator */}
          <div className="mx-3 my-3 border-t border-white/20" />

          {/* Collapsible Navigation Groups */}
          <div className="space-y-1">
            {navigationGroups.map((group) => {
              const isExpanded = expandedGroups[group.name] ?? false
              const groupActive = isGroupActive(group)
              return (
                <div key={group.name}>
                  <button
                    onClick={() => toggleGroup(group.name)}
                    className={`
                      w-full flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md
                      transition-colors cursor-pointer
                      ${isExpanded
                        ? 'bg-black/20 text-white font-bold'
                        : groupActive
                          ? 'text-white font-semibold hover:bg-white/10'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <group.icon className="h-4 w-4 shrink-0" />
                      <span>{group.name}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDownIcon className="h-3.5 w-3.5 opacity-60" />
                    ) : (
                      <ChevronRightIcon className="h-3.5 w-3.5 opacity-60" />
                    )}
                  </button>

                  {/* Group Items — shown when expanded */}
                  {isExpanded && (
                    <div className="mt-0.5 ml-3 space-y-0.5 border-l border-white/20 pl-3 pb-1">
                      {group.items.map((item) => {
                        const active = isItemActive(item.href)
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={`
                              flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors
                              ${active
                                ? 'bg-black/20 text-white font-medium'
                                : 'text-white/80 hover:bg-white/10 hover:text-white'
                              }
                            `}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <item.icon className="h-3.5 w-3.5 shrink-0" />
                            {item.name}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Bottom spacing for scrolling */}
          <div className="h-24" />
        </nav>

        {/* Account section (matches original sidebar-account) */}
        {user && (
          <div className="shrink-0 bg-black/20 px-3 py-3">
            {/* User info row */}
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-white/20 text-white flex items-center justify-center text-sm font-semibold shrink-0">
                {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">
                  {user.name || 'User'}
                </p>
                <p className="text-xs text-white/60 truncate">{user.email}</p>
              </div>
            </div>

            {/* Account & Logout buttons */}
            <div className="flex gap-2">
              <Link
                href="/account"
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold
                  bg-white text-primary rounded-md hover:bg-white/90 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <UserCircleIcon className="h-3.5 w-3.5" />
                Account
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold
                  bg-red-500/80 text-white rounded-md hover:bg-red-500 transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowRightOnRectangleIcon className="h-3.5 w-3.5" />
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 flex h-14 items-center gap-x-4 bg-white border-b border-gray-200 px-4 shadow-sm lg:hidden">
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
