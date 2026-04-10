'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  Building2,
  KeyRound,
  BarChart3,
  CreditCard,
  Settings,
  ChevronLeft,
  BookOpen,
  Layers,
} from 'lucide-react'

const NAV = [
  { href: '/organization', label: 'Overview', icon: Building2, exact: true },
  { href: '/organization/plans', label: 'Plans', icon: Layers },
  { href: '/organization/api-keys', label: 'API Keys', icon: KeyRound },
  { href: '/organization/usage', label: 'Usage', icon: BarChart3 },
  { href: '/organization/billing', label: 'Billing', icon: CreditCard },
  { href: '/organization/settings', label: 'Settings', icon: Settings },
  { href: '/organization/api-docs', label: 'API Docs', icon: BookOpen },
]

export default function OrganizationLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const orgId = searchParams.get('org')

  const withOrg = (href: string) => (orgId ? `${href}?org=${orgId}` : href)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top bar */}
      <div className="border-b bg-white px-6 py-3 flex items-center gap-3">
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
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  )
}
