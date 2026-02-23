'use client'

import { useState, useCallback } from 'react'
import { activityLogAPI, type ActivityLogEntry } from '@/lib/api/endpoints/account'
import { Button } from '@/components/ui/button'

interface ActivityLogTabProps {
  userId: number | string
}

function parseUserAgent(ua: string): string {
  if (!ua) return 'Unknown'
  // Simple UA parsing
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome'
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari'
  if (ua.includes('Edg')) return 'Edge'
  return ua.substring(0, 30) + '...'
}

export function ActivityLogTab({ userId }: ActivityLogTabProps) {
  const [entries, setEntries] = useState<ActivityLogEntry[]>([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLog = useCallback(async (p: number) => {
    try {
      setLoading(true)
      setError(null)
      const res = await activityLogAPI.list(userId, p)
      setEntries(res.data)
      setPage(res.meta.current_page)
      setLastPage(res.meta.last_page)
      setFetched(true)
    } catch {
      setError('Failed to load activity log')
      setFetched(true)
    } finally {
      setLoading(false)
    }
  }, [userId])

  if (!fetched && !loading) {
    fetchLog(1)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Activity Log</h2>
        <p className="text-sm text-gray-500 mb-6">Recent activity on your account.</p>

        {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        {loading && !fetched ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-gray-500">No activity recorded yet.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Action</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">IP Address</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Device / Browser</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {entries.map((entry) => (
                    <tr key={entry.id}>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                        {new Date(entry.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{entry.action}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-mono text-gray-600">
                        {entry.ip_address}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {parseUserAgent(entry.user_agent)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {lastPage > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-gray-500">
                  Page {page} of {lastPage}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page <= 1 || loading}
                    onClick={() => fetchLog(page - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page >= lastPage || loading}
                    onClick={() => fetchLog(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
