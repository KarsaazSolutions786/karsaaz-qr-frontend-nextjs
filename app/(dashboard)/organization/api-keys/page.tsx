'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Copy, Check, Plus, Trash2, ShieldCheck } from 'lucide-react'
import { useOrganizationApiKeys } from '@/lib/hooks/useOrganizationApiKeys'

const SCOPE_OPTIONS = [
  { value: '*', label: 'Full Access' },
  { value: 'qrcode.read', label: 'Read QR Codes' },
  { value: 'qrcode.write', label: 'Create / Update QR Codes' },
  { value: 'analytics.read', label: 'Read Analytics' },
  { value: 'account.read', label: 'Read Account' },
]

/**
 * Purpose: Executes ApiKeysPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 * Last Editor: Claude Code
 * Last Updated: 2026-07-15 (ORG-V2-6 / OV6.2: fetch/mutation state now shared with
 * the org-portal api-keys page via useOrganizationApiKeys)
 */
export default function ApiKeysPage() {
  const params = useSearchParams()
  const orgId = Number(params.get('org') ?? 0)

  const { keys, usageStats, loading, create, revoke } = useOrganizationApiKeys('dashboard', orgId)

  const [showForm, setShowForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newKeyToken, setNewKeyToken] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const [form, setForm] = useState({
    name: '',
    rate_limit_per_minute: 60,
    expires_at: '',
    scopes: ['*'] as string[],
  })

  /**
   * Purpose: Executes handleCreate functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: April 2026
   */
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!create) return
    setCreating(true)
    try {
      const created = await create({
        name: form.name,
        scopes: form.scopes,
        rate_limit_per_minute: form.rate_limit_per_minute,
        expires_at: form.expires_at || undefined,
      })
      setNewKeyToken(created.token ?? null)
      setShowForm(false)
      toast.success("API key created! Save the token now — it won't be shown again.")
    } catch {
      toast.error('Failed to create API key')
    } finally {
      setCreating(false)
    }
  }

  /**
   * Purpose: Executes handleRevoke functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: April 2026
   */
  const handleRevoke = async (keyId: number) => {
    if (!revoke) return
    if (!confirm('Revoke this API key? This cannot be undone.')) return
    try {
      await revoke(keyId)
      toast.success('API key revoked.')
    } catch {
      toast.error('Failed to revoke key')
    }
  }

  /**
   * Purpose: Executes copyToken functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: April 2026
   */
  const copyToken = () => {
    if (!newKeyToken) return
    navigator.clipboard.writeText(newKeyToken)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  /**
   * Purpose: Executes toggleScope functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: April 2026
   */
  const toggleScope = (scope: string) => {
    setForm(prev => ({
      ...prev,
      scopes: prev.scopes.includes(scope)
        ? prev.scopes.filter(s => s !== scope)
        : [...prev.scopes, scope],
    }))
  }

  if (!orgId) {
    return <p className="text-gray-500">Select an organization first.</p>
  }

  /**
   * Purpose: Executes formatLimit functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: April 2026
   */
  const formatLimit = (n: number) => (n === -1 ? 'Unlimited' : n.toLocaleString())

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage access tokens for programmatic API access.
          </p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          New Key
        </button>
      </div>

      {/* Usage stats */}
      {usageStats && (
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-2xl font-bold text-blue-600">
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
                        : 'bg-blue-500'
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
            <p className="text-2xl font-bold text-blue-600">{usageStats.rate_limit_per_minute}</p>
            <p className="mt-0.5 text-xs text-gray-500">Requests / min</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-blue-600">
              {keys.filter(k => k.is_active).length}
            </p>
            <p className="mt-0.5 text-xs text-gray-500">Active Keys</p>
          </div>
        </div>
      )}

      {/* New key revealed token */}
      {newKeyToken && (
        <div className="mb-6 rounded-xl border border-yellow-300 bg-yellow-50 p-5">
          <div className="mb-2 flex items-center gap-2 font-semibold text-yellow-800">
            <ShieldCheck className="h-5 w-5" />
            Save your API key — it won't be shown again
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-white border p-3 font-mono text-sm break-all">
            <span className="flex-1">{newKeyToken}</span>
            <button onClick={copyToken} className="shrink-0 text-gray-500 hover:text-indigo-600">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <button
            onClick={() => setNewKeyToken(null)}
            className="mt-3 text-xs text-yellow-700 underline"
          >
            I've saved the key — dismiss
          </button>
        </div>
      )}

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-800">Create New API Key</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Production Key"
                required
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Rate Limit (req/min)
              </label>
              <input
                type="number"
                value={form.rate_limit_per_minute}
                onChange={e =>
                  setForm(p => ({ ...p, rate_limit_per_minute: Number(e.target.value) }))
                }
                min={1}
                max={1000}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Expires At (optional)
              </label>
              <input
                type="datetime-local"
                value={form.expires_at}
                onChange={e => setForm(p => ({ ...p, expires_at: e.target.value }))}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Scopes</label>
              <div className="flex flex-wrap gap-2">
                {SCOPE_OPTIONS.map(s => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => toggleScope(s.value)}
                    className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                      form.scopes.includes(s.value)
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={creating}
                className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {creating ? 'Creating…' : 'Create Key'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Key list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      ) : keys.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-10 text-center text-gray-400">
          No API keys yet. Create one to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {keys.map(key => (
            <div
              key={key.id}
              className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{key.name}</span>
                  {!key.is_active && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600">
                      Revoked
                    </span>
                  )}
                </div>
                <div className="mt-1 font-mono text-xs text-gray-500">{key.prefix}••••••••••••</div>
                <div className="mt-1 flex gap-2 flex-wrap">
                  {(key.scopes ?? []).map(s => (
                    <span
                      key={s}
                      className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                {key.last_used_at && (
                  <p className="mt-1 text-xs text-gray-400">
                    Last used: {new Date(key.last_used_at).toLocaleString()}
                  </p>
                )}
              </div>
              {key.is_active && (
                <button
                  onClick={() => handleRevoke(key.id)}
                  className="ml-4 flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" /> Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
