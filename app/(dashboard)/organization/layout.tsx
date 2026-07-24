'use client'

import Link from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useOrgStore } from '@/lib/stores/useOrgStore'
import { useQueryClient } from '@tanstack/react-query'
import { organizationAPI, type Organization } from '@/lib/api/endpoints/organization'
import {
  Building2,
  KeyRound,
  BarChart3,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronDown,
  BookOpen,
  Layers,
  Users,
  ShieldCheck,
  ScrollText,
} from 'lucide-react'

const NAV = [
  { href: '/organization', label: 'Overview', icon: Building2, exact: true },
  { href: '/organization/team', label: 'Team', icon: Users },
  { href: '/organization/roles', label: 'Roles', icon: ShieldCheck },
  { href: '/organization/plans', label: 'Plans', icon: Layers },
  { href: '/organization/api-keys', label: 'API Keys', icon: KeyRound },
  { href: '/organization/usage', label: 'Usage', icon: BarChart3 },
  { href: '/organization/billing', label: 'Billing', icon: CreditCard },
  { href: '/organization/audit-logs', label: 'Audit Logs', icon: ScrollText },
  { href: '/organization/settings', label: 'Settings', icon: Settings },
  { href: '/organization/api-docs', label: 'API Docs', icon: BookOpen },
]

/**
 * Purpose: Organization switcher dropdown -- spec §13.10. Lists every
 * organization the user belongs to, lets them switch the active org (updates
 * useOrgStore + invalidates organization-scoped React Query caches so no
 * data from the previous organization leaks into the new context) and
 * navigate to it, and offers "Personal workspace" to leave the org area
 * entirely.
 * Owner/Author: Claude Code
 * Created/Updated: 2026-07-20
 */
function OrganizationSwitcher({ activeOrgId }: { activeOrgId?: string | number | null }) {
  const { selectedOrg, setSelectedOrg } = useOrgStore()
  const [orgs, setOrgs] = useState<Organization[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()

  useEffect(() => {
    organizationAPI
      .list()
      .then(res => setOrgs(res.data.data ?? []))
      .catch(() => {})
  }, [])

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
    // Never leak cached data from the previous organization's context.
    queryClient.invalidateQueries({ predicate: query => query.queryKey.includes('organization') })
    router.push(`${pathname}?org=${org.id}`)
  }

  const current = orgs.find(o => String(o.id) === String(activeOrgId)) ?? selectedOrg

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 rounded-full bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-3 py-1 text-sm font-semibold text-white shadow-sm hover:brightness-105 transition-all"
      >
        <Building2 className="h-3.5 w-3.5" />
        {current?.name ?? 'Select organization'}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-64 rounded-lg border bg-white py-1 shadow-lg">
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

/**
 * Purpose: Executes OrganizationLayout functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
export default function OrganizationLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const urlOrgId = searchParams.get('org')
  const { selectedOrg } = useOrgStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const activeOrgId = urlOrgId || selectedOrg?.id

  /**
   * Purpose: Executes withOrg functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: April 2026
   */
  const withOrg = (href: string) => (activeOrgId ? `${href}?org=${activeOrgId}` : href)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top bar */}
      <div className="border-b bg-white px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/qrcodes"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
          >
            <ChevronLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-semibold text-gray-900">Organization API</span>
        </div>

        {mounted && <OrganizationSwitcher activeOrgId={activeOrgId} />}
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 border-r bg-gray-50 p-4">
          <nav className="flex flex-col gap-1">
            {NAV.map(({ href, label, icon: Icon, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={withOrg(href)}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  )
}
