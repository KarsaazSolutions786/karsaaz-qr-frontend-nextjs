'use client'

import type { DomainConnectivity } from '@/types/entities/domain'

interface DomainConnectivityTestProps {
  connectivity: DomainConnectivity
  onTest: () => void
  isTesting?: boolean
}

const dnsStatusColors: Record<string, string> = {
  valid: 'bg-green-100 text-green-800',
  verified: 'bg-green-100 text-green-800',
  invalid: 'bg-red-100 text-red-800',
  failed: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
}

const sslStatusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  expired: 'bg-red-100 text-red-800',
  error: 'bg-red-100 text-red-800',
}

export function DomainConnectivityTest({
  connectivity,
  onTest,
  isTesting,
}: DomainConnectivityTestProps) {
  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Connectivity Status</h3>
          <p className="mt-0.5 text-sm text-gray-500">
            Last checked: {connectivity.last_checked_at
              ? new Date(connectivity.last_checked_at).toLocaleString()
              : 'Never'}
          </p>
        </div>
        <button
          onClick={onTest}
          disabled={isTesting}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
        >
          {isTesting ? 'Testing...' : 'Test Connection'}
        </button>
      </div>

      {/* Connection indicator */}
      <div className="flex items-center gap-2">
        <span
          className={`inline-block h-3 w-3 rounded-full ${connectivity.is_connected ? 'bg-green-500' : 'bg-red-500'}`}
        />
        <span className="text-sm font-medium text-gray-700">
          {connectivity.is_connected ? 'Connected' : 'Not Connected'}
        </span>
      </div>

      {/* SSL Status */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">SSL:</span>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${sslStatusColors[connectivity.ssl_status] ?? 'bg-gray-100 text-gray-800'}`}
        >
          {connectivity.ssl_status}
        </span>
      </div>

      {/* DNS Records Table */}
      {connectivity.dns_records.length > 0 && (
        <div className="overflow-hidden rounded-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Type
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Value
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {connectivity.dns_records.map((record, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 text-sm font-mono text-gray-800">{record.type}</td>
                  <td className="px-4 py-2 text-sm font-mono text-gray-800">{record.name}</td>
                  <td className="px-4 py-2 text-sm font-mono text-gray-600 break-all">
                    {record.value}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${dnsStatusColors[record.status] ?? 'bg-gray-100 text-gray-800'}`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
