'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/hooks/useAuth'
import { LanguagePicker } from '@/components/common/LanguagePicker'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { ActAsBanner } from '@/components/common/ActAsBanner'
import {
  QrCodeIcon,
  Bars3Icon,
  XMarkIcon,
  ArchiveBoxIcon,
  CloudIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
  UsersIcon,
  BanknotesIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  PuzzlePieceIcon,
  ServerIcon,
  HomeIcon,
} from '@heroicons/react/24/outline'
import { GlobalSearch } from '@/components/common/GlobalSearch'
import { QuickActions } from '@/components/common/QuickActions'
import { isSuperAdmin } from '@/lib/utils/permissions'

// Admin-only route prefixes — regular users are redirected away
const ADMIN_ROUTE_PREFIXES = [
  '/users',
  '/plans',
  '/subscriptions',
  '/billing',
  '/transactions',
  '/payment-processors',
  '/payment-gateways',
  '/payment-methods',
  '/currencies',
  '/plugins',
  '/system',
  '/blog-posts',
  '/content-blocks',
  '/translations',
  '/custom-codes',
  '/pages',
  '/dynamic-biolink-blocks',
  '/contacts',
  '/lead-forms',
  '/support-tickets',
]

// Navigation types
interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

interface FigmaNavItem {
  key: string
  label: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  adminOnly?: boolean
}

interface FigmaNavSection {
  key: string
  label: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  items: NavItem[]
  adminOnly?: boolean
}

const figmaPrimaryNav: FigmaNavItem[] = [
  { key: 'home', label: 'Home', href: '/qrcodes/new', icon: HomeIcon },
  { key: 'existing-qr', label: 'Existing QR', href: '/qrcodes', icon: QrCodeIcon },
  { key: 'archived', label: 'Archived', href: '/archived', icon: ArchiveBoxIcon },
  {
    key: 'storage-connections',
    label: 'Storage Connections',
    href: '/cloud-storage',
    icon: CloudIcon,
  },
]

const figmaSectionNav: FigmaNavSection[] = [
  {
    key: 'users',
    label: 'Users',
    href: '/users',
    icon: UsersIcon,
    adminOnly: true,
    items: [
      { name: 'All Users', href: '/users', icon: UsersIcon },
      { name: 'Paying Users', href: '/users/paying', icon: UsersIcon },
      { name: 'Non Paying Users', href: '/users/non-paying', icon: UsersIcon },
      { name: 'Roles', href: '/users/roles', icon: UsersIcon },
    ],
  },
  {
    key: 'finance',
    label: 'Finance',
    href: '/plans',
    icon: BanknotesIcon,
    adminOnly: true,
    items: [
      { name: 'Pricing Plans', href: '/plans', icon: BanknotesIcon },
      { name: 'Subscriptions', href: '/subscriptions', icon: BanknotesIcon },
      { name: 'Billing', href: '/billing', icon: BanknotesIcon },
      { name: 'Transactions', href: '/transactions', icon: BanknotesIcon },
      { name: 'Payment Processors', href: '/payment-processors', icon: BanknotesIcon },
      { name: 'Payment Gateways', href: '/payment-gateways', icon: BanknotesIcon },
      { name: 'Payment Methods', href: '/payment-methods', icon: BanknotesIcon },
      { name: 'Currencies', href: '/currencies', icon: BanknotesIcon },
    ],
  },
  {
    key: 'content',
    label: 'Content',
    href: '/blog-posts',
    icon: DocumentTextIcon,
    adminOnly: true,
    items: [
      { name: 'Blog Posts', href: '/blog-posts', icon: DocumentTextIcon },
      { name: 'Content Blocks', href: '/content-blocks', icon: DocumentTextIcon },
      { name: 'Translations', href: '/translations', icon: DocumentTextIcon },
      { name: 'Custom Code', href: '/custom-codes', icon: DocumentTextIcon },
      { name: 'Pages', href: '/pages', icon: DocumentTextIcon },
      { name: 'Dynamic BioLinks', href: '/dynamic-biolink-blocks', icon: DocumentTextIcon },
    ],
  },
  {
    key: 'contacts',
    label: 'Contacts',
    href: '/contacts',
    icon: EnvelopeIcon,
    adminOnly: true,
    items: [
      { name: 'Contact Form', href: '/contacts', icon: EnvelopeIcon },
      { name: 'Lead Forms', href: '/lead-forms', icon: EnvelopeIcon },
      { name: 'Support Tickets', href: '/support-tickets', icon: EnvelopeIcon },
    ],
  },
  {
    key: 'plugins',
    label: 'Plugins',
    href: '/plugins/available',
    icon: PuzzlePieceIcon,
    adminOnly: true,
    items: [
      { name: 'Available Plugins', href: '/plugins/available', icon: PuzzlePieceIcon },
      { name: 'Installed Plugins', href: '/plugins/installed', icon: PuzzlePieceIcon },
    ],
  },
  {
    key: 'system',
    label: 'System',
    href: '/system/status',
    icon: ServerIcon,
    adminOnly: true,
    items: [
      { name: 'Status', href: '/system/status', icon: ServerIcon },
      { name: 'Settings', href: '/system/settings', icon: ServerIcon },
      { name: 'Logs', href: '/system/logs', icon: ServerIcon },
      { name: 'Cache', href: '/system/cache', icon: ServerIcon },
      { name: 'Notifications', href: '/system/notifications', icon: ServerIcon },
      { name: 'Sms Portals', href: '/system/sms-portals', icon: ServerIcon },
      { name: 'Auth Workflow', href: '/system/auth-workflow', icon: ServerIcon },
      { name: 'Abuse Reports', href: '/system/abuse-reports', icon: ServerIcon },
      { name: 'Domains', href: '/system/domains', icon: ServerIcon },
      { name: 'Template Categories', href: '/template-categories', icon: ServerIcon },
      { name: 'Email Templates', href: '/system/email-templates', icon: ServerIcon },
      { name: 'Webhooks', href: '/system/webhooks', icon: ServerIcon },
      { name: 'API Docs', href: '/system/api-docs', icon: ServerIcon },
      { name: 'Scheduled Tasks', href: '/system/scheduled-tasks', icon: ServerIcon },
      { name: 'Queues', href: '/system/queues', icon: ServerIcon },
      { name: 'Backups', href: '/system/backups', icon: ServerIcon },
    ],
  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </div>
      }
    >
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </Suspense>
  )
}

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { user, isLoading, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Permission-based filtering: show admin groups only for admin users
  const isAdmin = Boolean(user?.roles?.[0]?.super_admin)
  const filteredSectionNav = figmaSectionNav.filter(item => !item.adminOnly || isAdmin)
  const collapsedNavItems: NavItem[] = [
    ...figmaPrimaryNav.map(item => ({ name: item.label, href: item.href, icon: item.icon })),
    ...filteredSectionNav.map(item => ({ name: item.label, href: item.href, icon: item.icon })),
  ]

  useEffect(() => {
    const nextExpanded: Record<string, boolean> = {}
    filteredSectionNav.forEach(section => {
      const isActiveInSection = section.items.some(item => isItemActive(item.href))
      if (isActiveInSection) {
        nextExpanded[section.key] = true
      }
    })
    if (Object.keys(nextExpanded).length > 0) {
      setExpandedSections(prev => ({ ...prev, ...nextExpanded }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams, filteredSectionNav.length])

  // Set mounted to true after initial render to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isLoading && !user) {
      const currentPath = window.location.pathname
      router.push(`/login?from=${encodeURIComponent(currentPath)}`)
    }
  }, [user, isLoading, router])

  // Admin route guard: redirect non-admin users away from admin-only pages
  useEffect(() => {
    if (isLoading || !user || !pathname) return
    if (isSuperAdmin(user)) return // admins can access everything

    const isAdminRoute = ADMIN_ROUTE_PREFIXES.some(
      prefix => pathname === prefix || pathname.startsWith(`${prefix}/`)
    )
    if (isAdminRoute) {
      router.replace('/qrcodes')
    }
  }, [user, isLoading, pathname, router])

  const isItemActive = (href: string) => {
    if (!pathname) return false

    // Parse item href
    const [itemPath, itemQueryString = ''] = href.split('?')
    const itemParams = new URLSearchParams(itemQueryString)

    // Use searchParams from Next.js hook (SSR-safe)
    const currentSearchParams = searchParams?.toString() || ''
    const windowParams = new URLSearchParams(currentSearchParams)

    // Check pathname match
    const pathMatch = pathname === itemPath || pathname.startsWith(`${itemPath}/`)

    if (!pathMatch) return false

    // If no query params in item href, just check pathname
    if (!itemQueryString) {
      return pathMatch
    }

    // Check all item query params match window params
    const paramsMatch = Array.from(itemParams.keys()).every(
      key => itemParams.get(key) === windowParams.get(key)
    )

    if (!paramsMatch) return false

    // Check window doesn't have extra params (except 'page')
    const ignoredKeys = ['page']
    const hasExtraParams = Array.from(windowParams.keys()).some(
      key => !ignoredKeys.includes(key) && !itemParams.has(key)
    )

    return !hasExtraParams
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

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }))
  }

  // Show minimal loading state during SSR and initial mount to prevent hydration mismatch
  if (!mounted || isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/80 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Figma Sidebar: opened (264px) / closed (115px) */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col
          border-r-2 border-white bg-white/90 backdrop-blur-[25px]
          transition-all duration-300 ease-in-out transform
          lg:translate-x-0 lg:static lg:inset-auto
          ${sidebarCollapsed ? 'w-[115px]' : 'w-[264px]'}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="relative h-[154px] shrink-0">
          <Link
            href="/qrcodes/new"
            className={`absolute flex items-center gap-2 ${sidebarCollapsed ? 'left-1/2 top-[71px] -translate-x-1/2' : 'left-5 top-[72px]'}`}
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#B36AC5]/10 text-[#8c4ea3]">
              <Image
                src="/sidebar-assets/sidebar-logo.svg"
                alt="Karsaaz QR"
                width={22}
                height={22}
              />
            </div>
            {!sidebarCollapsed && (
              <span className="text-[17px] font-semibold text-[#1b1b1b]">Karsaaz QR</span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setSidebarCollapsed(prev => !prev)}
            className="hidden lg:flex absolute right-5 top-[77px] h-7 w-7 items-center justify-center rounded-md text-[#6d6d6d] hover:bg-[#f3e8ff]"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronRightIcon
              className={`h-4 w-4 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`}
            />
          </button>

          <button
            type="button"
            className="lg:hidden absolute right-5 top-[77px] text-[#6d6d6d] hover:text-[#1b1b1b]"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-2 pb-4">
          {sidebarCollapsed ? (
            <div className="flex flex-col items-center gap-[20px] pt-0">
              {collapsedNavItems.map(item => {
                const active = isItemActive(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center justify-center transition-colors
                      ${
                        active
                          ? 'h-[50px] w-[72px] rounded-[8px] bg-[radial-gradient(ellipse_at_center,_#E889FF_0%,_#B36AC5_100%)] text-white'
                          : 'h-[25.54px] w-[25.54px] rounded-[6px] text-[#6d6d6d] hover:bg-[#f7f1fb]'
                      }
                    `}
                    title={item.name}
                  >
                    <item.icon className={active ? 'h-5 w-5' : 'h-[22px] w-[22px]'} />
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="space-y-1 px-2">
              {figmaPrimaryNav.map(item => {
                const active = isItemActive(item.href)
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex h-[50.4px] items-center gap-3 px-4 text-[12px] font-medium transition-colors
                      ${
                        active
                          ? 'rounded-[12px] bg-[radial-gradient(ellipse_at_center,_#E889FF_0%,_#B36AC5_100%)] text-white'
                          : 'rounded-[26px] text-[#6d6d6d] hover:bg-[#f7f1fb]'
                      }
                    `}
                  >
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-[6px] ${active ? 'bg-white text-[#8f55a6]' : ''}`}
                    >
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="truncate">{item.label}</span>
                  </Link>
                )
              })}

              {filteredSectionNav.map(item => {
                const sectionActive = item.items.some(sectionItem => isItemActive(sectionItem.href))
                const expanded = expandedSections[item.key] || false
                return (
                  <div key={item.key}>
                    <button
                      type="button"
                      onClick={() => toggleSection(item.key)}
                      className={`
                      w-full flex h-[50.4px] items-center gap-3 rounded-[26px] px-4 text-[12px] font-medium transition-colors
                      ${sectionActive ? 'bg-[#f5e7fb] text-[#1b1b1b]' : 'text-[#6d6d6d] hover:bg-[#f7f1fb]'}
                    `}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="flex-1 truncate text-left">{item.label}</span>
                      <ChevronRightIcon
                        className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-90' : ''}`}
                      />
                    </button>

                    {expanded && (
                      <div className="ml-6 mt-1 space-y-1 border-l border-[#d9d9d9] pl-3">
                        {item.items.map(sectionItem => {
                          const childActive = isItemActive(sectionItem.href)
                          return (
                            <Link
                              key={sectionItem.href}
                              href={sectionItem.href}
                              onClick={() => setSidebarOpen(false)}
                              className={`
                                block rounded-[10px] px-3 py-2 text-[11px] transition-colors
                                ${childActive ? 'bg-[#f5e7fb] text-[#1b1b1b] font-medium' : 'text-[#6d6d6d] hover:bg-[#f7f1fb]'}
                              `}
                            >
                              {sectionItem.name}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </nav>

        <div
          className={`${sidebarCollapsed ? 'px-5 pb-3 space-y-2' : 'px-5 pb-3 flex items-center justify-between gap-1'}`}
        >
          {sidebarCollapsed ? (
            <>
              <div className="flex h-[35px] w-[31px] items-center justify-center rounded-[4px] border border-[#1b1b1b0a] bg-white">
                <Image src="/sidebar-assets/apple.svg" alt="App Store" width={16} height={16} />
              </div>
              <div className="flex h-[35px] w-[35px] items-center justify-center rounded-[4px] border border-[#1b1b1b0a] bg-white">
                <Image
                  src="/sidebar-assets/google-play.svg"
                  alt="Google Play"
                  width={16}
                  height={16}
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex h-[35px] w-[109px] items-center gap-2 rounded-[4px] border border-[#1b1b1b0a] bg-white px-2">
                <Image src="/sidebar-assets/apple.svg" alt="App Store" width={16} height={16} />
                <div className="leading-none text-black">
                  <p className="text-[7px] font-normal">Download on the</p>
                  <p className="text-[10px] font-medium">App Store</p>
                </div>
              </div>
              <div className="flex h-[35px] w-[109px] items-center gap-2 rounded-[4px] border border-[#1b1b1b0a] bg-white px-2">
                <Image
                  src="/sidebar-assets/google-play.svg"
                  alt="Google Play"
                  width={16}
                  height={16}
                />
                <div className="leading-none text-black">
                  <p className="text-[7px] font-normal uppercase">Get it on</p>
                  <p className="text-[10px] font-medium">Google Play</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="px-3 pb-4">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`
              flex h-[50px] w-full items-center rounded-[12px] border border-[#bd6bff52] bg-white text-[#6d6d6d]
              transition-colors hover:bg-[#f7f1fb] disabled:opacity-60
              ${sidebarCollapsed ? 'justify-center px-0' : 'justify-start gap-3 px-4'}
            `}
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            {!sidebarCollapsed && (
              <span className="text-base">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Impersonation banner */}
        <ActAsBanner />
        {/* Mobile header */}
        <div className="sticky top-0 z-10 flex h-14 items-center gap-x-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 shadow-sm lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-700"
            aria-label="Toggle navigation menu"
            aria-expanded={sidebarOpen}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex-1">
            <GlobalSearch />
          </div>
          <ThemeToggle />
          <LanguagePicker />
        </div>

        {/* Desktop header bar */}
        <div className="hidden lg:flex sticky top-0 z-10 h-14 items-center gap-x-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 shadow-sm">
          <div className="flex-1">
            <GlobalSearch />
          </div>
          <ThemeToggle />
          <LanguagePicker />
        </div>

        {/* Page content */}
        <main
          id="main-content"
          role="main"
          className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 dark:text-gray-100"
        >
          {children}
        </main>

        {/* Quick Actions FAB */}
        <QuickActions />
      </div>
    </div>
  )
}
