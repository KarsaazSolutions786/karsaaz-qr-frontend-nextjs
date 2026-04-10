'use client'

import { useEffect, useState } from 'react'
import { KeyRound, RefreshCw, AlertCircle, Copy, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { portalAxios } from '@/lib/context/OrgPortalAuthContext'

interface ApiKey {
  id: number
  name: string
  prefix: string
  is_active: boolean
  last_used_at: string | null
  expires_at: string | null
  rate_limit_per_minute: number
  created_at: string
}

export default function OrgPortalApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newToken, setNewToken] = useState<{ id: number; token: string } | null>(null)
  const [regenerating, setRegenerating] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    portalAxios
      .get<{ data: ApiKey[] }>('/api-keys')
      .then(res => setKeys(res.data.data ?? []))
      .catch(() => setError('Failed to load API keys.'))
      .finally(() => setLoading(false))
  }, [])

  const handleRegenerate = async (keyId: number) => {
    if (!confirm('Regenerate this key? The old key will stop working immediately.')) return
    setRegenerating(keyId)
    try {
      const res = await portalAxios.post<{ token: string }>(`/api-keys/${keyId}/regenerate`)
      setNewToken({ id: keyId, token: res.data.token })
      setRevealed(false)
      setCopied(false)
      // Refresh list to show new prefix
      const refreshed = await portalAxios.get<{ data: ApiKey[] }>('/api-keys')
      setKeys(refreshed.data.data ?? [])
      toast.success('API key regenerated! Copy and store it now.')
    } catch {
      toast.error('Failed to regenerate key.')
    } finally {
      setRegenerating(null)
    }
  }

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const formatDate = (d: string | null) => (d ? new Date(d).toLocaleDateString() : '—')

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
