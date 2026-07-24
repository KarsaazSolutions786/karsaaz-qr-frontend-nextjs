'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { TrendingUp, Zap, Clock, AlertTriangle } from 'lucide-react'
import { orgUsageAPI, type UsageSummary } from '@/lib/api/endpoints/organization'

const PERIODS = ['7d', '30d', '90d'] as const
type Period = (typeof PERIODS)[number]

/**
 * Purpose: Executes UsagePage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
export default function UsagePage() {
  const params = useSearchParams()
  const orgId = Number(params.get('org') ?? 0)
  const [period, setPeriod] = useState<Period>('30d')
  const [summary, setSummary] = useState<UsageSummary | null>(null)
  const [breakdown, setBreakdown] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orgId) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)

    Promise.all([orgUsageAPI.summary(orgId, period), orgUsageAPI.breakdown(orgId, period)])
      .then(([usageRes, breakRes]) => {
        setSummary(usageRes.data.data)
        setBreakdown(breakRes.data.data?.endpoints ?? [])
      })
      .catch(() => toast.error('Failed to load usage data'))
      .finally(() => setLoading(false))
  }, [orgId, period])

  if (!orgId) return <p className="text-gray-500">Select an organization first.</p>

  const statCards = [
    {
      label: 'Total Requests',
      value: summary?.total_requests ?? 0,
      icon: TrendingUp,
      color: 'text-indigo-600',
    },
    {
      label: 'Credits Consumed',
      value: (summary?.total_credits ?? 0).toFixed(1),
      icon: Zap,
      color: 'text-amber-500',
    },
    {
      label: 'Avg Response (ms)',
      value: summary?.avg_response_ms ?? 0,
      icon: Clock,
      color: 'text-green-600',
    },
    {
      label: 'Errors',
      value: summary?.error_count ?? 0,
      icon: AlertTriangle,
      color: 'text-red-500',
    },
  ]

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API Usage</h1>
          <p className="mt-1 text-sm text-gray-500">Monitor requests and credit consumption.</p>
        </div>
        <div className="flex gap-1 rounded-lg border bg-white p-1">
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                period === p ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {statCards.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="rounded-xl border bg-white p-4 shadow-sm">
                <Icon className={`mb-2 h-5 w-5 ${color}`} />
                <div className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</div>
                <div className="text-xs text-gray-400">{label}</div>
              </div>
            ))}
          </div>

          {/* Daily trend sparkline (simple bar chart) */}
          {summary?.daily_trend && summary.daily_trend.length > 0 && (
            <div className="mb-8 rounded-xl border bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-semibold text-gray-800">Daily Requests</h2>
              <div className="flex h-32 items-end gap-1">
                {summary.daily_trend.map(d => {
                  const maxReqs = Math.max(...summary.daily_trend.map(x => x.requests), 1)
                  const height = Math.max(4, (d.requests / maxReqs) * 100)
                  return (
                    <div
                      key={d.date}
                      title={`${d.date}: ${d.requests} requests`}
                      className="flex-1 rounded-t bg-indigo-400 hover:bg-indigo-600 transition-colors cursor-pointer"
                      style={{ height: `${height}%` }}
                    />
                  )
                })}
              </div>
              <div className="mt-1 flex justify-between text-xs text-gray-400">
                <span>{summary.daily_trend[0]?.date}</span>
                <span>{summary.daily_trend[summary.daily_trend.length - 1]?.date}</span>
              </div>
            </div>
          )}

          {/* Endpoint breakdown table */}
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="border-b px-5 py-3">
              <h2 className="font-semibold text-gray-800">Endpoint Breakdown</h2>
            </div>
            {breakdown.length === 0 ? (
              <p className="p-6 text-center text-sm text-gray-400">No API calls in this period.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-3 text-left">Endpoint</th>
                    <th className="px-5 py-3 text-right">Calls</th>
                    <th className="px-5 py-3 text-right">Credits</th>
                    <th className="px-5 py-3 text-right">Avg ms</th>
                    <th className="px-5 py-3 text-right">Errors</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {breakdown.map(row => (
                    <tr key={`${row.http_method}-${row.endpoint}`} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-mono">
                        <span className="mr-2 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                          {row.http_method}
                        </span>
                        {row.endpoint}
                      </td>
                      <td className="px-5 py-3 text-right font-medium">
                        {row.calls.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-right text-amber-600">
                        {Number(row.credits_consumed).toFixed(1)}
                      </td>
                      <td className="px-5 py-3 text-right text-gray-500">
                        {Math.round(row.avg_response_ms)}
                      </td>
                      <td className="px-5 py-3 text-right text-red-500">{row.errors}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  )
}
