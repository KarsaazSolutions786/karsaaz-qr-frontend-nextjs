'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'
import { LanguagePicker } from '@/components/common/LanguagePicker'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { ActAsBanner } from '@/components/common/ActAsBanner'
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
  FolderIcon,
  TagIcon,
  TicketIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'
import {
  getSidebarFolders,
  getSidebarTemplateCategories,
  getDynamicQRCodeCount,
  getTotalScans,
  getCurrentPlanFromUser,
  formatLimit,
  type Plan
} from '@/lib/api/sidebar'
import type { Folder } from '@/types/entities/folder'
import type { TemplateCategory } from '@/types/entities/template'

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

// Top-level standalone items (locked groups - always visible, matches Lit qrcodesGroup + cloudStorageGroup)
const topNavigation: NavItem[] = [
  { name: 'Home', href: '/qrcodes/new', icon: HomeIcon },
  { name: 'Existing QRs', href: '/qrcodes', icon: QrCodeIcon },
  { name: 'Archived', href: '/archived', icon: ArchiveBoxIcon },
]

// Cloud Storage locked group (separate from collapsible groups)
const cloudStorageNavigation: NavItem[] = [
  { name: 'Connections', href: '/cloud-storage', icon: CloudIcon },
]

// Collapsible navigation groups (matches Lit menu-store groups exactly)
const navigationGroups: NavGroup[] = [
  {
    name: 'Referrals',
    icon: CurrencyDollarIcon,
    items: [
      { name: 'Commission Summary', href: '/referrals', icon: ChartBarIcon },
      { name: 'Withdrawal History', href: '/referrals?tab=history', icon: ClockIcon },
      { name: 'Request Withdrawal', href: '/referrals?tab=withdraw', icon: BanknotesIcon },
    ],
  },
  {
    name: 'Users',
    icon: UsersIcon,
    items: [
      { name: 'All Users', href: '/users', icon: UsersIcon },
      { name: 'Paying Users', href: '/users?paying=true', icon: CreditCardIcon },
      { name: 'Non Paying Users', href: '/users?paying=false', icon: UserGroupIcon },
      { name: 'Roles', href: '/roles', icon: ShieldCheckIcon },
    ],
  },
  {
    name: 'Finance',
    icon: BanknotesIcon,
    items: [
      { name: 'Pricing Plans', href: '/plans', icon: SparklesIcon },
      { name: 'Subscriptions', href: '/subscriptions', icon: CreditCardIcon },
      { name: 'Billing', href: '/billing', icon: BanknotesIcon },
      { name: 'Transactions', href: '/transactions', icon: CurrencyDollarIcon },
      { name: 'Payment Processors', href: '/payment-processors', icon: BanknotesIcon },
      { name: 'Payment Gateways', href: '/payment-gateways', icon: WrenchScrewdriverIcon },
      { name: 'Payment Methods', href: '/payment-methods', icon: CreditCardIcon },
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
      { name: 'Custom Code', href: '/custom-codes', icon: CodeBracketIcon },
      { name: 'Pages', href: '/pages', icon: DocumentDuplicateIcon },
      { name: 'Dynamic BioLinks', href: '/dynamic-biolink-blocks', icon: LinkIcon },
    ],
  },
  {
    name: 'Contacts',
    icon: EnvelopeIcon,
    items: [
      { name: 'Contact Form', href: '/contacts', icon: EnvelopeIcon },
      { name: 'Lead Forms', href: '/lead-forms', icon: ClipboardDocumentListIcon },
      { name: 'Support Tickets', href: '/support-tickets', icon: TicketIcon },
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
      { name: 'Sms Portals', href: '/system/sms', icon: DevicePhoneMobileIcon },
      { name: 'Auth Workflow', href: '/system/auth-workflow', icon: ShieldCheckIcon },
      { name: 'Abuse Reports', href: '/admin/abuse-reports', icon: ExclamationTriangleIcon },
      { name: 'Domains', href: '/domains', icon: GlobeAltIcon },
      { name: 'Template Categories', href: '/template-categories', icon: RectangleGroupIcon },
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
  const searchParams = useSearchParams()
  const { user, isLoading, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Set mounted to true after initial render to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Dynamic sidebar data
  const [folders, setFolders] = useState<Folder[]>([])
  const [templateCategories, setTemplateCategories] = useState<TemplateCategory[]>([])
  
  // Account widget stats
  const [qrCount, setQrCount] = useState<number>(0)
  const [scanCount, setScanCount] = useState<number>(0)
  const [plan, setPlan] = useState<Plan | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      const currentPath = window.location.pathname
      router.push(`/login?from=${encodeURIComponent(currentPath)}`)
    }
  }, [user, isLoading, router])

  // Fetch dynamic sidebar data
  useEffect(() => {
    if (!user) return

    const fetchSidebarData = async () => {
      try {
        // Fetch folders and template categories in parallel
        const [foldersData, categoriesData] = await Promise.all([
          getSidebarFolders(user.id),
          getSidebarTemplateCategories()
        ])
        
        setFolders(foldersData)
        setTemplateCategories(categoriesData)
      } catch (error) {
        console.error('Failed to fetch sidebar data:', error)
      }
    }

    fetchSidebarData()
  }, [user])

  // Fetch account stats
  useEffect(() => {
    if (!user) return

    const fetchStats = async () => {
      setStatsLoading(true)
      try {
        const [qrCountData, scansData] = await Promise.all([
          getDynamicQRCodeCount(),
          getTotalScans()
        ])
        
        setQrCount(qrCountData)
        setScanCount(scansData)
        // Get plan from user object (subscriptions are loaded with /myself)
        setPlan(getCurrentPlanFromUser(user))
      } catch (error) {
        console.error('Failed to fetch account stats:', error)
      } finally {
        setStatsLoading(false)
      }
    }

    fetchStats()
  }, [user])

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

      {/* Sidebar — purple gradient matching original */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-60 flex flex-col
          bg-gradient-to-b from-[#8368dc] to-[#b664c6] dark:from-[#6b52b8] dark:to-[#9a4fa8]
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
        <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-2 py-3 scrollbar-hide">
          {/* Separator line (matches Lit .sidebar-top) */}
          <div className="mx-3 mb-2 border-t border-dotted border-purple-300/30" />
          
          {/* Top-level items (locked group - always visible) */}
          <div className="space-y-0.5 mb-3">
            {topNavigation.map((item) => {
              const active = isItemActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-3 py-2.5 text-sm rounded-md transition-colors
                    ${active
                      ? 'bg-black/20 text-white font-medium'
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

          {/* Cloud Storage locked group */}
          <div className="mb-3">
            <div className="px-3 mb-1.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Cloud Storage</span>
            </div>
            <div className="space-y-0.5">
              {cloudStorageNavigation.map((item) => {
                const active = isItemActive(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center gap-2 px-3 py-2.5 text-sm rounded-md transition-colors
                      ${active
                        ? 'bg-black/20 text-white font-medium'
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
          </div>

          {/* Folders Group (Dynamic) - matches Lit frontend */}
          {folders.length > 0 && (
            <div className="mb-3">
              <div className="px-3 mb-1.5">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Folders</span>
              </div>
              <div className="space-y-0.5">
                {folders.map((folder) => {
                  const folderHref = `/qrcodes?folder_id=${folder.id}`
                  const active = isItemActive(folderHref)
                  return (
                    <Link
                      key={folder.id}
                      href={folderHref}
                      className={`
                        flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md transition-colors
                        ${active
                          ? 'bg-black/20 text-white font-medium'
                          : 'text-white/90 hover:bg-white/10 hover:text-white'
                        }
                      `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FolderIcon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{folder.name}</span>
                      </div>
                      {/* QR Count Badge - matches Lit folder-menu-item.js */}
                      <div className={`
                        flex items-center justify-center min-w-[2rem] h-5 px-2 rounded-full text-xs font-bold
                        ${active 
                          ? 'bg-white/20 text-white' 
                          : 'bg-white/90 text-purple-700'
                        }
                      `}>
                        {folder.qrCodeCount || 0}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Template Categories Group (Dynamic) - matches Lit frontend */}
          {templateCategories.length > 0 && (
            <div className="mb-3">
              <div className="px-3 mb-1.5">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Categories</span>
              </div>
              <div className="space-y-0.5">
                {templateCategories.map((category) => {
                  const categoryHref = `/qrcodes/new?template-category-id=${category.id}`
                  const active = isItemActive(categoryHref)
                  return (
                    <Link
                      key={category.id}
                      href={categoryHref}
                      className={`
                        flex items-center gap-2 px-3 py-2.5 text-sm rounded-md transition-colors
                        ${active
                          ? 'bg-black/20 text-white font-medium'
                          : 'text-white/90 hover:bg-white/10 hover:text-white'
                        }
                      `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <TagIcon className="h-4 w-4 shrink-0" />
                      {category.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

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

        {/* Language Picker */}
        <div className="shrink-0 px-3 py-2 border-t border-white/10">
          <LanguagePicker variant="dark" />
        </div>

        {/* Account section (matches Lit sidebar-account.js) */}
        {user && (
          <div className="shrink-0 bg-black/20 px-3 py-3">
            {/* Stats (matches Lit detailed view) */}
            {!statsLoading && plan && (
              <div className="mb-2 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-purple-900/30 rounded px-2 py-1.5">
                  <div className="text-white/60 font-bold uppercase text-[0.65rem] mb-0.5 truncate">
                    Dynamic QRs
                  </div>
                  <div className="text-white font-semibold truncate">
                    {qrCount} / {formatLimit(plan.number_of_dynamic_qrcodes)}
                  </div>
                </div>
                <div className="bg-purple-900/30 rounded px-2 py-1.5">
                  <div className="text-white/60 font-bold uppercase text-[0.65rem] mb-0.5 truncate">
                    Scans
                  </div>
                  <div className="text-white font-semibold truncate">
                    {scanCount.toLocaleString()} / {formatLimit(plan.number_of_scans)}
                  </div>
                </div>
              </div>
            )}

            {/* Email */}
            <p className="text-xs text-white/80 truncate mb-2">{user.email}</p>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {/* Trial upgrade button (matches Lit) */}
              {plan?.is_trial ? (
                <>
                  <div className="flex-1 flex items-center justify-center px-2 py-1.5 text-xs font-semibold bg-purple-900/30 text-white rounded-md">
                    <span className="truncate">Trial</span>
                  </div>
                  <Link
                    href="/account/upgrade"
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold
                      bg-yellow-400 text-purple-900 rounded-md hover:bg-yellow-300 transition-colors"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <SparklesIcon className="h-3.5 w-3.5" />
                    Upgrade
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/account"
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold
                      bg-white text-purple-700 rounded-md hover:bg-white/90 transition-colors"
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
                </>
              )}
            </div>
          </div>
        )}
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
          <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
            Karsaaz QR
          </div>
          <ThemeToggle />
          <LanguagePicker />
        </div>

        {/* Page content */}
        <main id="main-content" role="main" className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
          {children}
        </main>
      </div>
    </div>
  )
}
