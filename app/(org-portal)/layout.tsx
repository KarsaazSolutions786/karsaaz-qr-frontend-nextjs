'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  KeyRound,
  BarChart3,
  Wallet,
  LogOut,
  Building2,
  Layers,
  Radio,
  AlertTriangle,
} from 'lucide-react'
import { OrgPortalAuthProvider, useOrgPortalAuth } from '@/lib/context/OrgPortalAuthContext'

const NAV = [
  { href: '/org-portal/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/org-portal/api-keys', label: 'API Keys', icon: KeyRound },
  { href: '/org-portal/usage', label: 'Usage', icon: BarChart3 },
  { href: '/org-portal/credits', label: 'Tokens', icon: Wallet },
  { href: '/org-portal/plans', label: 'Plans', icon: Layers },
  { href: '/org-portal/webhooks', label: 'Webhooks', icon: Radio },
]

/**
 * Purpose: Executes PortalShell functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 * Last Editor: Claude Code
 * Last Updated: 2026-07-15 (ORG-V2-6 / OV6.3: portal shell audit -- added plan
 * badge, credit balance, and a suspended-status banner, all confirmed missing.
 * Org switcher not built: the org-portal token authenticates a single
 * organization directly [Organization implements Sanctum's Authenticatable
 * itself], not a specific member with multi-org membership, so there is
 * nothing to switch between -- confirmed via the ORG-V2-0 audit, not assumed.
 * Permission-aware nav also not built: the portal credential is a shared
 * org-level identity, not tied to a specific OrganizationMember role, so the
 * OV2.1 5-role permission matrix has no per-request actor to key off here;
 * every portal session already sees the same full nav by design.)
 */
function PortalShell({ children }: { children: React.ReactNode }) {
  const { org, isLoading, isAuthenticated, logout } = useOrgPortalAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname === '/org-portal/login'

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.replace('/org-portal/login')
    }
  }, [isLoading, isAuthenticated, isLoginPage, router])

  if (isLoginPage) {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="flex w-60 flex-col bg-white shadow-sm">
        {/* Brand */}
        <div className="flex items-center gap-2 border-b px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <Building2 className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">{org?.name}</p>
            <p className="text-xs text-gray-400">API Portal</p>
          </div>
        </div>

        {/* Plan badge + credit balance */}
        {(org?.plan || org?.credits) && (
          <div className="border-b px-5 py-3">
            {org?.plan && (
              <span className="mb-2 inline-block rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                {org.plan.name}
              </span>
            )}
            {org?.credits && (
              <p className="text-xs text-gray-500">
                <span className="font-semibold text-gray-800">
                  {org.credits.balance.toLocaleString()}
                </span>{' '}
                credits remaining
              </p>
            )}
          </div>
        )}

        {/* Suspended-status banner */}
        {org?.status === 'suspended' && (
          <div className="mx-3 mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>This organization is suspended. Contact support to restore access.</span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="border-t p-3">
          <button
            onClick={() => {
              logout()
              router.replace('/org-portal/login')
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main id="main-content" className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  )
}

/**
 * Purpose: Executes OrgPortalLayout functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
export default function OrgPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <OrgPortalAuthProvider>
      <PortalShell>{children}</PortalShell>
    </OrgPortalAuthProvider>
  )
}
