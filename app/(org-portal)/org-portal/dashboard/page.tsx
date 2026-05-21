'use client'

import { useEffect, useState } from 'react'
import { BarChart3, KeyRound, QrCode, Wallet, TrendingUp, AlertCircle } from 'lucide-react'
import { portalAxios } from '@/lib/context/OrgPortalAuthContext'

interface DashboardData {
  organization: { id: number; name: string; status: string }
  qr_created_via_api: number
  api_calls_this_month: number
  credits_spent_month: number
  credits_balance: number
  active_api_keys: number
}

/**
 * Purpose: Executes StatCard functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string
  value: string | number
  sub?: string
  icon: React.ElementType
  color: string
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
    </div>
  )
}

/**
 * Purpose: Executes OrgPortalDashboardPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
export default function OrgPortalDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    portalAxios
      .get<{ data: DashboardData }>('/dashboard')
      .then(res => setData(res.data.data))
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
        <AlertCircle className="h-4 w-4 shrink-0" />
        {error || 'Something went wrong.'}
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your API usage and credits.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          label="QRs via API"
          value={data.qr_created_via_api}
          sub="all time"
          icon={QrCode}
          color="bg-purple-100 text-purple-600"
        />
        <StatCard
          label="API Calls"
          value={data.api_calls_this_month}
          sub="this month"
          icon={TrendingUp}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          label="Credits Spent"
          value={data.credits_spent_month.toFixed(1)}
          sub="this month"
          icon={BarChart3}
          color="bg-orange-100 text-orange-600"
        />
        <StatCard
          label="Balance"
          value={data.credits_balance.toFixed(1)}
          sub="available credits"
          icon={Wallet}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          label="Active Keys"
          value={data.active_api_keys}
          icon={KeyRound}
          color="bg-indigo-100 text-indigo-600"
        />
      </div>

      {/* Status banner */}
      <div
        className={`mt-6 rounded-xl p-4 text-sm font-medium ${
          data.organization.status === 'active'
            ? 'bg-green-50 text-green-700'
            : data.organization.status === 'suspended'
              ? 'bg-red-50 text-red-700'
              : 'bg-yellow-50 text-yellow-700'
        }`}
      >
        Organization status: <span className="capitalize">{data.organization.status}</span>
        {data.organization.status === 'suspended' && ' — contact support to reactivate.'}
      </div>

      {/* Low credits warning */}
      {data.credits_balance < 50 && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-yellow-100 bg-yellow-50 p-4 text-sm text-yellow-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Your credit balance is low ({data.credits_balance.toFixed(1)} credits remaining). Contact
          your account manager to top up.
        </div>
      )}
    </div>
  )
}
