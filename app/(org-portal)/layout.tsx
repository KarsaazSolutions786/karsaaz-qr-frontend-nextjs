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

export default function OrgPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <OrgPortalAuthProvider>
      <PortalShell>{children}</PortalShell>
    </OrgPortalAuthProvider>
  )
}
