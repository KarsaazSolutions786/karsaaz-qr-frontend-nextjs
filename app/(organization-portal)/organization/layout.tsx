'use client'

import React, { Suspense, useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { isSuperAdmin } from '@/lib/utils/permissions'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { LottieLoader } from '@/components/ui/lottie-loader'
import { useOrgStore } from '@/lib/stores/useOrgStore'
import { useOrganizations } from '@/lib/hooks/queries/useOrganizations'
import { useQueryClient } from '@tanstack/react-query'
import type { Organization } from '@/lib/api/endpoints/organization'
import {
  Building2,
  KeyRound,
  BarChart3,
  CreditCard,
  Settings,
  ChevronDown,
  BookOpen,
  Layers,
  Users,
  ShieldCheck,
  ScrollText,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react'

const getNavItems = (isAdmin: boolean) => {
  if (isAdmin) {
    return [
      { href: '/organization', label: 'Organizations', icon: Building2, exact: true },
      { href: '/organization/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
      { href: '/organization/roles', label: 'Roles', icon: ShieldCheck },
      { href: '/organization/plans', label: 'Plans', icon: Layers },
      { href: '/organization/audit-logs', label: 'Audit Logs', icon: ScrollText },
      { href: '/organization/api-docs', label: 'API Docs', icon: BookOpen },
    ]
  }

  return [
    { href: '/organization/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
    { href: '/organization/team', label: 'Team', icon: Users },
    { href: '/organization/api-keys', label: 'API Keys', icon: KeyRound },
    { href: '/organization/usage', label: 'Usage', icon: BarChart3 },
    { href: '/organization/billing', label: 'Billing', icon: CreditCard },
    { href: '/organization/settings', label: 'Settings', icon: Settings },
    { href: '/organization/api-docs', label: 'API Docs', icon: BookOpen },
  ]
}

function OrganizationSwitcher({ activeOrgId }: { activeOrgId?: string | number | null }) {
  const { selectedOrg, setSelectedOrg } = useOrgStore()
  const { data: orgs = [] } = useOrganizations()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (orgs.length > 0 && !activeOrgId && !selectedOrg) {
      const firstOrg = orgs[0]
      setSelectedOrg(firstOrg || null)
      if (firstOrg) router.replace(`${pathname}?org=${firstOrg.id}`)
    }
  }, [orgs.length, activeOrgId, orgs, pathname, router, selectedOrg, setSelectedOrg])

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const handleSwitch = (org: Organization) => {
    setSelectedOrg(org)
    setOpen(false)
    queryClient.invalidateQueries({ predicate: query => query.queryKey.includes('organization') })
    router.push(`${pathname}?org=${org.id}`)
  }

  const current = orgs.find(o => String(o.id) === String(activeOrgId)) ?? selectedOrg

  return (
    <div className="relative z-50 w-64 max-w-full pl-2" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center justify-between gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 transition-all"
      >
        <div className="flex items-center gap-2 truncate">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary-100 text-primary-600">
            <Building2 className="h-3.5 w-3.5" />
          </div>
          <span className="truncate">{current?.name ?? 'Select organization'}</span>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
      </button>

      {open && (
        <div className="absolute left-2 right-0 top-full mt-1 w-full rounded-lg border bg-white py-1 shadow-lg">
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            Your organizations
          </div>
          {orgs.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-400">No organizations yet</div>
          )}
          {orgs.map(org => (
            <button
              key={org.id}
              onClick={() => handleSwitch(org)}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                String(org.id) === String(current?.id)
                  ? 'font-semibold text-primary-700'
                  : 'text-gray-700'
              }`}
            >
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{org.name}</span>
            </button>
          ))}
          <div className="mt-1 border-t pt-1">
            <Link
              href="/organization"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            >
              Manage organizations
            </Link>
            <Link
              href="/qrcodes"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            >
              Personal workspace
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default function OrganizationLayout({ children }: { children: React.ReactNode }) {
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
      <OrganizationLayoutInner>{children}</OrganizationLayoutInner>
    </Suspense>
  )
}

function OrganizationLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const urlOrgId = searchParams?.get('org')
  const { selectedOrg } = useOrgStore()
  const { user, logout } = useAuth()
  const isSuperUser = isSuperAdmin(user)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const activeOrgId = urlOrgId || selectedOrg?.id
  const withOrg = (href: string) => (activeOrgId ? `${href}?org=${activeOrgId}` : href)

  const navItems = mounted ? getNavItems(isSuperUser) : []

  const effectivePrimaryNav = navItems.map(item => ({
    key: item.label.toLowerCase().replace(/\s+/g, '-'),
    label: item.label,
    href: item.href === '/organization' ? item.href : withOrg(item.href),
    icon: item.icon as any,
  }))

  const collapsedNavItems = effectivePrimaryNav.map(item => ({
    name: item.label,
    href: item.href,
    icon: item.icon,
  }))

  const isItemActive = (href: string) => {
    if (!pathname) return false
    const itemPath = href.split('?')[0] || ''
    const exactMatch = pathname === itemPath
    if (itemPath === '/organization') return exactMatch
    const prefixMatch = pathname.startsWith(`${itemPath}/`)
    return exactMatch || prefixMatch
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

  const upgradeWidget = mounted ? (
    <Link
      href={withOrg('/organization/upgrade')}
      className={`flex items-center justify-center gap-2 rounded-lg bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-105 transition-all w-full ${sidebarCollapsed ? 'px-0' : ''}`}
    >
      <Sparkles className="h-4 w-4 shrink-0" />
      {!sidebarCollapsed && <span className="truncate">Upgrade Plan</span>}
    </Link>
  ) : null

  return (
    <div className="flex h-screen karsaaz-bg dark:bg-gray-900 overflow-hidden">
      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        expandedSections={expandedSections}
        toggleSection={toggleSection}
        effectivePrimaryNav={effectivePrimaryNav}
        allSectionNav={[]}
        collapsedNavItems={collapsedNavItems}
        isItemActive={isItemActive}
        isLoggingOut={isLoggingOut}
        handleLogout={handleLogout}
        bottomWidget={upgradeWidget}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isAccountCreditMode={false}
          extraStartComponent={mounted ? <OrganizationSwitcher activeOrgId={activeOrgId} /> : null}
        />
        <main className="flex-1 overflow-auto bg-transparent relative z-0">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full">{children}</div>
        </main>
      </div>
    </div>
  )
}
