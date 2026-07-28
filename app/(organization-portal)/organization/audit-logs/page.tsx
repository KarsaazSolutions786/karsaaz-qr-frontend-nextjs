'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { ScrollText, ChevronLeft, ChevronRight } from 'lucide-react'
import { organizationAPI, type OrganizationAuditLogEntry } from '@/lib/api/endpoints/organization'

/**
 * Purpose: Self-service organization audit-log viewer per spec §9/§13 --
 * paginated, most-recent-first activity trail for the organization's own
 * owner/admins (separate from the super-admin-only equivalent under
 * /organization/manage/[id]).
 * Owner/Author: Claude Code
 * Created/Updated: 2026-07-20
 */
export default function OrganizationAuditLogsPage() {
  const params = useSearchParams()
  const orgId = Number(params.get('org') ?? 0)

  const [logs, setLogs] = useState<OrganizationAuditLogEntry[]>([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orgId) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    organizationAPI
      .auditLogs(orgId, page)
      .then(res => {
        setLogs(res.data.data ?? [])
        setLastPage(res.data.last_page ?? 1)
        setTotal(res.data.total ?? 0)
      })
      .catch(() => toast.error('Failed to load audit logs'))
      .finally(() => setLoading(false))
  }, [orgId, page])

  if (!orgId) return <p className="text-gray-500">Select an organization first.</p>

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <p className="mt-1 text-sm text-gray-500">
          A record of sensitive actions taken in this organization — role changes, member
          invitations, API-key rotation, billing changes, and more.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
        </div>
      ) : logs.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-12 text-center">
          <ScrollText className="mx-auto mb-3 h-8 w-8 text-gray-400" />
          <p className="font-medium text-gray-600">No activity yet</p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border bg-white shadow-sm divide-y">
            {logs.map(log => (
              <div key={log.id} className="flex items-start gap-3 px-5 py-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
                  <ScrollText className="h-3.5 w-3.5 text-gray-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{log.action}</p>
                  <p className="text-xs text-gray-400">
                    {log.actor_type === 'user' ? 'By a user' : `By ${log.actor_type}`}
                    {log.target_type &&
                      ` · ${log.target_type}${log.target_id ? ` #${log.target_id}` : ''}`}
                    {' · '}
                    {new Date(log.created_at).toLocaleString()}
                  </p>
                  {Object.keys(log.metadata ?? {}).length > 0 && (
                    <pre className="mt-1 overflow-x-auto rounded bg-gray-50 px-2 py-1 text-[11px] text-gray-500">
                      {JSON.stringify(log.metadata, null, 0)}
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>

          {lastPage > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <span>
                Page {page} of {lastPage} ({total} total)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="flex items-center gap-1 rounded-lg border px-3 py-1.5 disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Prev
                </button>
                <button
                  onClick={() => setPage(p => Math.min(lastPage, p + 1))}
                  disabled={page >= lastPage}
                  className="flex items-center gap-1 rounded-lg border px-3 py-1.5 disabled:opacity-40"
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
