'use client'

import { useState } from 'react'
import { KeyRound, RefreshCw, AlertCircle, Copy, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { useOrganizationApiKeys } from '@/lib/hooks/useOrganizationApiKeys'

/**
 * Purpose: Executes OrgPortalApiKeysPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 * Last Editor: Claude Code
 * Last Updated: 2026-07-15 (ORG-V2-6 / OV6.2: fetch/mutation state now shared with
 * the dashboard organization/api-keys page via useOrganizationApiKeys)
 */
export default function OrgPortalApiKeysPage() {
  const { keys, usageStats, loading, error, regenerate } = useOrganizationApiKeys('portal')

  const [newToken, setNewToken] = useState<{ id: number; token: string } | null>(null)
  const [regenerating, setRegenerating] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  /**
   * Purpose: Executes handleRegenerate functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: April 2026
   */
  const handleRegenerate = async (keyId: number) => {
    if (!regenerate) return
    if (!confirm('Regenerate this key? The old key will stop working immediately.')) return
    setRegenerating(keyId)
    try {
      const token = await regenerate(keyId)
      setNewToken({ id: keyId, token })
      setRevealed(false)
      setCopied(false)
      toast.success('API key regenerated! Copy and store it now.')
    } catch {
      toast.error('Failed to regenerate key.')
    } finally {
      setRegenerating(null)
    }
  }

  /**
   * Purpose: Executes copyToken functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: April 2026
   */
  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  /**
   * Purpose: Executes formatDate functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: April 2026
   */
  const formatDate = (d: string | null | undefined) => (d ? new Date(d).toLocaleDateString() : '—')
  /**
   * Purpose: Executes formatLimit functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: April 2026
   */
  const formatLimit = (n: number) => (n === -1 ? 'Unlimited' : n.toLocaleString())

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
        <p className="mt-1 text-sm text-gray-500">Manage access keys for the Karsaaz QR API.</p>
      </div>

      {/* Usage stats */}
      {usageStats && (
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-2xl font-bold text-indigo-600">
              {usageStats.monthly_requests_used.toLocaleString()}
              <span className="text-sm font-normal text-gray-400">
                {' '}
                / {formatLimit(usageStats.monthly_requests_limit)}
              </span>
            </p>
            <p className="mt-0.5 text-xs text-gray-500">Monthly Requests</p>
            {usageStats.monthly_requests_limit !== -1 && (
              <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    usageStats.monthly_requests_used / usageStats.monthly_requests_limit > 0.9
                      ? 'bg-red-500'
                      : usageStats.monthly_requests_used / usageStats.monthly_requests_limit > 0.7
                        ? 'bg-amber-400'
                        : 'bg-indigo-500'
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      (usageStats.monthly_requests_used / usageStats.monthly_requests_limit) * 100
                    )}%`,
                  }}
                />
              </div>
            )}
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-indigo-600">{usageStats.rate_limit_per_minute}</p>
            <p className="mt-0.5 text-xs text-gray-500">Requests / min</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-indigo-600">
              {keys.filter(k => k.is_active).length}
            </p>
            <p className="mt-0.5 text-xs text-gray-500">Active Keys</p>
          </div>
        </div>
      )}

      {/* New token reveal banner */}
      {newToken && (
        <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-yellow-800">
            <AlertCircle className="h-4 w-4" />
            New key generated — copy it now, it won't be shown again
          </div>
          <div className="flex items-center gap-2 rounded-lg border bg-white p-3">
            <code className="flex-1 break-all font-mono text-xs text-gray-800">
              {revealed ? newToken.token : '•'.repeat(40)}
            </code>
            <button
              onClick={() => setRevealed(v => !v)}
              className="rounded p-1 text-gray-400 hover:text-gray-700"
              title={revealed ? 'Hide' : 'Show'}
            >
              {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <button
              onClick={() => copyToken(newToken.token)}
              className="rounded p-1 text-gray-400 hover:text-gray-700"
              title="Copy"
            >
              {copied ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
          <button
            onClick={() => setNewToken(null)}
            className="mt-2 text-xs text-yellow-700 underline"
          >
            I've saved this key — dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {keys.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-12 text-center">
          <KeyRound className="mx-auto mb-3 h-8 w-8 text-gray-300" />
          <p className="font-medium text-gray-500">No API keys yet</p>
          <p className="mt-1 text-sm text-gray-400">
            Contact your account manager to issue an API key.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {keys.map(key => (
            <div key={key.id} className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
                    <KeyRound className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{key.name}</p>
                    <code className="mt-0.5 rounded bg-gray-100 px-2 py-0.5 text-xs font-mono text-gray-600">
                      {key.prefix}…
                    </code>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    key.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {key.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="mt-4 flex gap-6 text-xs text-gray-400">
                <span>
                  Rate limit:{' '}
                  <strong className="text-gray-700">{key.rate_limit_per_minute} req/min</strong>
                </span>
                <span>
                  Last used:{' '}
                  <strong className="text-gray-700">{formatDate(key.last_used_at)}</strong>
                </span>
                <span>
                  Expires: <strong className="text-gray-700">{formatDate(key.expires_at)}</strong>
                </span>
              </div>

              <div className="mt-4 border-t pt-3">
                <button
                  onClick={() => handleRegenerate(key.id)}
                  disabled={regenerating === key.id}
                  className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-3 w-3 ${regenerating === key.id ? 'animate-spin' : ''}`}
                  />
                  {regenerating === key.id ? 'Regenerating…' : 'Regenerate key'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
