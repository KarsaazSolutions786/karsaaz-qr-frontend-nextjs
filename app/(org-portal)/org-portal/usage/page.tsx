'use client'

import { useEffect, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { portalAxios } from '@/lib/context/OrgPortalAuthContext'

interface DayData {
  date: string
  requests: number
  tokens: number
}
interface EndpointData {
  endpoint: string
  http_method: string
  calls: number
  tokens_consumed: number
  avg_response_ms: number
}
interface UsageData {
  period: string
  total_requests: number
  total_tokens: number
  avg_response_ms: number
  success_count: number
  error_count: number
  daily_trend: DayData[]
  breakdown: EndpointData[]
}

const PERIODS = ['7d', '30d', '90d'] as const

export default function OrgPortalUsagePage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d')
  const [data, setData] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)

    setError('')
    portalAxios
      .get<{ data: UsageData }>('/usage', { params: { period } })
      .then(res => setData(res.data.data))
      .catch(() => setError('Failed to load usage data.'))
      .finally(() => setLoading(false))
  }, [period])

  // Simple sparkline bar chart
  const maxRequests = data ? Math.max(...data.daily_trend.map(d => d.requests), 1) : 1

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usage</h1>
          <p className="mt-1 text-sm text-gray-500">API call and credit consumption over time.</p>
        </div>
        <div className="flex gap-1 rounded-lg border bg-white p-1">
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                period === p ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {!loading && !error && data && (
        <>
          {/* Summary cards */}
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Total Requests', value: data.total_requests.toLocaleString() },
              { label: 'Credits Consumed', value: data.total_credits.toFixed(1) },
              { label: 'Avg Response', value: `${data.avg_response_ms}ms` },
              {
                label: 'Error Rate',
                value:
                  data.total_requests > 0
                    ? `${((data.error_count / data.total_requests) * 100).toFixed(1)}%`
                    : '0%',
              },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl border bg-white p-4 shadow-sm">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="mt-1 text-xl font-bold text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {/* Daily chart */}
          <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-gray-700">Daily Requests ({period})</h2>
            {data.daily_trend.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">No data for this period.</p>
            ) : (
              <div className="flex items-end gap-1 overflow-x-auto pb-2">
                {data.daily_trend.map(d => (
                  <div key={d.date} className="group flex-1 flex flex-col items-center">
                    <div
                      className="w-full min-w-[6px] rounded-t bg-indigo-400 transition-all group-hover:bg-indigo-600"
                      style={{ height: `${Math.max(4, (d.requests / maxRequests) * 80)}px` }}
                      title={`${d.date}: ${d.requests} requests`}
                    />
                    <p className="mt-1 hidden text-[10px] text-gray-400 sm:block">
                      {new Date(d.date).getDate()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Endpoint breakdown */}
          <div className="rounded-xl border bg-white shadow-sm">
            <div className="border-b px-5 py-3">
              <h2 className="text-sm font-semibold text-gray-700">Endpoint Breakdown</h2>
            </div>
            {data.breakdown.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">No endpoint data yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
                    <th className="px-5 py-3">Endpoint</th>
                    <th className="px-5 py-3 text-right">Calls</th>
                    <th className="px-5 py-3 text-right">Credits</th>
                    <th className="px-5 py-3 text-right">Avg ms</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.breakdown.map((e, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <span className="mr-2 rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono font-medium text-gray-600">
                          {e.http_method}
                        </span>
                        <span className="font-mono text-xs text-gray-700">{e.endpoint}</span>
                      </td>
                      <td className="px-5 py-3 text-right font-medium text-gray-900">
                        {e.calls.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-right text-gray-600">
                        {Number(e.credits_consumed).toFixed(1)}
                      </td>
                      <td className="px-5 py-3 text-right text-gray-600">
                        {Math.round(Number(e.avg_response_ms))}
                      </td>
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
