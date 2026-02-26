'use client'

import { use } from 'react'
import Link from 'next/link'
import { useBulkImportInstance } from '@/lib/hooks/queries/useBulkOperations'

interface BulkInstance {
  id: number
  name: string | null
  status: 'running' | 'completed' | 'failed'
  progress: number
  total: number
  created_at: string
  results?: BulkResult[]
}

interface BulkResult {
  row: number
  url?: string
  status: 'success' | 'failed'
  error?: string
  qrcode_id?: number
}

const statusStyles: Record<string, string> = {
  running: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  success: 'bg-green-100 text-green-800',
}

export default function BulkOperationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: instance, isLoading: loading, error: queryError } = useBulkImportInstance(id)
  const error = queryError ? 'Failed to load bulk operation details.' : (!loading && !instance ? 'Bulk operation not found.' : '')
  const results: BulkResult[] = (instance as BulkInstance)?.results ?? []

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
      </div>
    )
  }

  if (error || !instance) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-lg font-medium text-gray-900">{error || 'Not found'}</h2>
        <Link href="/bulk-operations" className="mt-2 text-sm text-blue-600 hover:text-blue-900">← Back</Link>
      </div>
    )
  }

  const successCount = results.filter((r) => r.status === 'success').length
  const failedCount = results.filter((r) => r.status === 'failed').length
  const progressPct = instance.total > 0 ? Math.round((instance.progress / instance.total) * 100) : 0

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {instance.name || `Bulk Operation #${instance.id}`}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Created: {new Date(instance.created_at).toLocaleString()}
          </p>
        </div>
        <Link href="/bulk-operations" className="text-sm text-blue-600 hover:text-blue-900">← Back</Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Status</p>
          <span className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[instance.status] || 'bg-gray-100 text-gray-700'}`}>
            {instance.status}
          </span>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{instance.total}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Success</p>
          <p className="mt-1 text-2xl font-bold text-green-600">{successCount || instance.progress}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Failed</p>
          <p className="mt-1 text-2xl font-bold text-red-600">{failedCount}</p>
        </div>
      </div>

      {/* Progress */}
      {instance.total > 0 && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{instance.progress} / {instance.total} processed</span>
            <span>{progressPct}%</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full rounded-full transition-all ${instance.status === 'failed' ? 'bg-red-500' : 'bg-blue-600'}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Results Table */}
      {results.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Results</h2>
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 pl-4 pr-3 text-left text-xs font-semibold text-gray-600">Row</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600">URL</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {results.map((r, idx) => (
                  <tr key={idx}>
                    <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm text-gray-500">{r.row}</td>
                    <td className="px-3 py-3 text-sm text-gray-700 max-w-xs truncate">{r.url || '—'}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[r.status] || 'bg-gray-100 text-gray-600'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      {r.error || (r.qrcode_id ? `QR #${r.qrcode_id}` : '—')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
