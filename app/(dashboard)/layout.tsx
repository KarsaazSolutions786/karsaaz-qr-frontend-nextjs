'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { useAccountCredit } from '@/lib/hooks/useAccountCredit'
import { isSuperAdmin } from '@/lib/utils/permissions'
import { useSystemConfigs } from '@/lib/hooks/queries/useSystemConfigs'
import { ActAsBanner } from '@/components/common/ActAsBanner'
import { SubscriptionBanner } from '@/components/common/SubscriptionBanner'
import { IncompleteCheckoutBanner } from '@/components/common/IncompleteCheckoutBanner'
import { DashboardBanner } from '@/components/common/DashboardBanner'
import { SubscriptionAlertProvider } from '@/components/features/subscriptions/SubscriptionAlertProvider'
import { CartWidget } from '@/components/features/payment/CartWidget'
import { QuickActions } from '@/components/common/QuickActions'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import {
  ADMIN_ROUTE_PREFIXES,
  figmaPrimaryNav,
  figmaUserSectionNav,
  figmaSectionNav,
  WalletIcon,
  LinkIcon,
  CodeBracketIcon,
  type FigmaNavSection,
} from '@/lib/config/nav-config'
import { useGuest } from '@/lib/hooks/useGuest'
import { GuestSignupPrompt } from '@/components/guest/GuestSignupPrompt'
import { GuestLimitsBanner } from '@/components/guest/GuestLimitsBanner'
import { LottieLoader } from '@/components/ui/lottie-loader'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen karsaaz-bg dark:bg-gray-900">
          <div className="flex-1 flex items-center justify-center">
            <LottieLoader size={80} />
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
  const { isGuest, isGuestLoading, sessionLimits } = useGuest()
  const { isAccountCreditMode } = useAccountCredit()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Permission-based filtering: show admin groups only for admin users
  const isAdmin = Boolean(user?.roles?.[0]?.super_admin)
  const filteredSectionNav = figmaSectionNav.filter(item => !item.adminOnly || isAdmin)

  // Derive API access from user's active subscription plan
  const hasApiAccess = React.useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subs: any[] = user?.subscriptions ?? []
    if (!subs.length) return false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sorted = [...subs].sort(
      (a: any, b: any) =>
        new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const active = sorted.find((s: any) => {
      const latest = (s.statuses as Array<{ status: string; created_at: string }> | undefined)
        ?.slice()
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
      return latest?.status === 'active'
    })
    return Boolean((active ?? sorted[0])?.subscription_plan?.has_api_access)
  }, [user?.subscriptions])

  // Custom client menu from admin config (for non-admin users)
  // Disabled for guests and during guest loading — they don't need custom admin menus and the API requires auth
  const shouldSkipSystemConfigs = isAdmin || isGuest || (!user && isGuestLoading)
  const { data: menuConfig } = useSystemConfigs(
    shouldSkipSystemConfigs ? [] : ['app.dashboard-client-menu']
  )
  const customMenuItems: FigmaNavSection[] = React.useMemo(() => {
    if (isAdmin || !menuConfig?.['app.dashboard-client-menu']) return []
    try {
      const items = JSON.parse(menuConfig['app.dashboard-client-menu'])
      if (!Array.isArray(items) || items.length === 0) return []
      return [
        {
          key: 'custom-menu',
          label: 'Menu',
          href: items[0]?.url || '#',
          icon: LinkIcon,
          items: items.map((item: { label: string; url: string }) => ({
            name: item.label || 'Link',
            href: item.url || '#',
            icon: LinkIcon,
          })),
        },
      ]
    } catch {
      return []
    }
  }, [isAdmin, menuConfig])

  // Combine all sections: user sections + admin sections + custom menu
  const allSectionNav = [...figmaUserSectionNav, ...filteredSectionNav, ...customMenuItems]

  // Build primary nav -- filter for guests, add Account Credits in credit mode
  const guestAllowedNavKeys = ['home', 'existing-qr']
  const basePrimaryNav = isGuest
    ? figmaPrimaryNav.filter(item => guestAllowedNavKeys.includes(item.key))
    : figmaPrimaryNav.filter(item => !item.adminOnly || isAdmin)

  const effectivePrimaryNav = (() => {
    let nav = [...basePrimaryNav]
    if (isAccountCreditMode && !isGuest) {
      nav = [
        ...nav,
        {
          key: 'account-credits',
          label: 'Account Credits',
          href: '/account-credits',
          icon: WalletIcon,
        },
      ]
    }
    if (hasApiAccess && !isGuest) {
      nav = [
        ...nav,
        {
          key: 'apis',
          label: 'APIs',
          href: '/apis',
          icon: CodeBracketIcon,
        },
      ]
    }
    return nav
  })()

  const collapsedNavItems = [
    ...effectivePrimaryNav.map(item => ({ name: item.label, href: item.href, icon: item.icon })),
    ...allSectionNav.map(item => ({ name: item.label, href: item.href, icon: item.icon })),
  ]

  const isItemActive = (href: string) => {
    if (!pathname) return false
    const [itemPath, itemQueryString = ''] = href.split('?')
    const itemParams = new URLSearchParams(itemQueryString)
    const currentSearchParams = searchParams?.toString() || ''
    const windowParams = new URLSearchParams(currentSearchParams)
    const exactMatch = pathname === itemPath
    const prefixMatch = pathname.startsWith(`${itemPath}/`)
    const anotherPrimaryExactMatch = effectivePrimaryNav.some(
      nav => nav.href !== href && pathname === nav.href.split('?')[0]
    )
    const pathMatch = exactMatch || (prefixMatch && !anotherPrimaryExactMatch)
    if (!pathMatch) return false
    if (!itemQueryString) return pathMatch
    const paramsMatch = Array.from(itemParams.keys()).every(
      key => itemParams.get(key) === windowParams.get(key)
    )
    if (!paramsMatch) return false
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
    setExpandedSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }))
  }

  useEffect(() => {
    const nextExpanded: Record<string, boolean> = {}
    allSectionNav.forEach(section => {
      const isActiveInSection = section.items.some(item => isItemActive(item.href))
      if (isActiveInSection) nextExpanded[section.key] = true
    })
    if (Object.keys(nextExpanded).length > 0) {
      setExpandedSections(prev => ({ ...prev, ...nextExpanded }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams, allSectionNav.length])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isLoading && !isGuestLoading && !user && !isGuest) {
      router.push('/login')
    }
  }, [user, isLoading, isGuest, isGuestLoading, router])

  // Admin route guard: redirect non-admin users and guests away from admin-only pages
  useEffect(() => {
    if (isLoading || !pathname) return
    const isAdminRoute = ADMIN_ROUTE_PREFIXES.some(
      prefix => pathname === prefix || pathname.startsWith(`${prefix}/`)
    )
    if (!isAdminRoute) return
    if (isGuest || !user || !isSuperAdmin(user)) router.replace('/qrcodes/new')
  }, [user, isLoading, isGuest, pathname, router])

  if (!mounted || isLoading || isGuestLoading) {
    return (
      <div className="flex h-screen karsaaz-bg dark:bg-gray-900">
        <div className="flex-1 flex items-center justify-center">
          <LottieLoader size={80} />
        </div>
      </div>
    )
  }

  if (!user && !isGuest) return null

  return (
    <div className="flex h-screen karsaaz-bg dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/80 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        expandedSections={expandedSections}
        toggleSection={toggleSection}
        effectivePrimaryNav={effectivePrimaryNav}
        allSectionNav={isGuest ? [] : allSectionNav}
        collapsedNavItems={collapsedNavItems}
        isItemActive={isItemActive}
        isLoggingOut={isLoggingOut}
        handleLogout={handleLogout}
        isGuest={isGuest}
      />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {!isGuest && (
          <>
            <ActAsBanner />
            <SubscriptionBanner />
            <IncompleteCheckoutBanner />
            <DashboardBanner />
          </>
        )}

        <DashboardHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isAccountCreditMode={isAccountCreditMode}
        />

        <main
          id="main-content"
          role="main"
          className="flex-1 overflow-y-auto dark:bg-gray-900 dark:text-gray-100 relative z-[1]"
        >
          {isGuest && sessionLimits && (
            <div className="px-4 pt-4 sm:px-6 lg:px-8">
              <GuestLimitsBanner limits={sessionLimits} />
            </div>
          )}
          {children}
        </main>

        {isGuest && <GuestSignupPrompt />}

        {!isGuest && (
          <>
            <QuickActions />
            <CartWidget />
            <SubscriptionAlertProvider />
          </>
        )}
      </div>
    </div>
  )
}
