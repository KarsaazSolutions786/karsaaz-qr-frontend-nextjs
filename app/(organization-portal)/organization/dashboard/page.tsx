'use client'

import { useOrgStore } from '@/lib/stores/useOrgStore'
import { Users, QrCode, MousePointerClick, Settings, KeyRound, Building2 } from 'lucide-react'
import Link from 'next/link'

export default function OrganizationDashboardOverview() {
  const { selectedOrg } = useOrgStore()

  // Safely fallback if no org is selected
  if (!selectedOrg) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Welcome, {selectedOrg.name}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Here is an overview of your organization's activity and quick actions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Quick Stat Cards */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Team Members</p>
              <h2 className="text-2xl font-bold text-gray-900">
                {/* We can show an active count if the API supports it, for now a placeholder showing the scale */}
                1{' '}
                <span className="text-sm text-gray-400 font-normal">
                  / {selectedOrg.max_capacity ?? 10}
                </span>
              </h2>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <QrCode className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active QR Codes</p>
              <h2 className="text-2xl font-bold text-gray-900">0</h2>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <MousePointerClick className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Scans this month</p>
              <h2 className="text-2xl font-bold text-gray-900">0</h2>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Links</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href={`/organization/team?org=${selectedOrg.id}`}
            className="group relative flex flex-col items-start gap-4 rounded-xl border bg-white p-5 shadow-sm transition-all hover:border-primary-500 hover:shadow-md"
          >
            <div className="rounded-lg bg-gray-50 p-2 text-gray-500 group-hover:bg-primary-50 group-hover:text-primary-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 group-hover:text-primary-600">
                Invite Members
              </h3>
              <p className="mt-1 text-xs text-gray-500">Grow your organization team.</p>
            </div>
          </Link>

          <Link
            href={`/organization/api-keys?org=${selectedOrg.id}`}
            className="group relative flex flex-col items-start gap-4 rounded-xl border bg-white p-5 shadow-sm transition-all hover:border-primary-500 hover:shadow-md"
          >
            <div className="rounded-lg bg-gray-50 p-2 text-gray-500 group-hover:bg-primary-50 group-hover:text-primary-600">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 group-hover:text-primary-600">API Keys</h3>
              <p className="mt-1 text-xs text-gray-500">Manage developer access.</p>
            </div>
          </Link>

          <Link
            href={`/organization/billing?org=${selectedOrg.id}`}
            className="group relative flex flex-col items-start gap-4 rounded-xl border bg-white p-5 shadow-sm transition-all hover:border-primary-500 hover:shadow-md"
          >
            <div className="rounded-lg bg-gray-50 p-2 text-gray-500 group-hover:bg-primary-50 group-hover:text-primary-600">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 group-hover:text-primary-600">Billing</h3>
              <p className="mt-1 text-xs text-gray-500">View plans and invoices.</p>
            </div>
          </Link>

          <Link
            href={`/organization/settings?org=${selectedOrg.id}`}
            className="group relative flex flex-col items-start gap-4 rounded-xl border bg-white p-5 shadow-sm transition-all hover:border-primary-500 hover:shadow-md"
          >
            <div className="rounded-lg bg-gray-50 p-2 text-gray-500 group-hover:bg-primary-50 group-hover:text-primary-600">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 group-hover:text-primary-600">Settings</h3>
              <p className="mt-1 text-xs text-gray-500">Manage org preferences.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
