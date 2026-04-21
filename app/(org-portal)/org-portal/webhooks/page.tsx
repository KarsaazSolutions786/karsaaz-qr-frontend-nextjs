'use client'

import { useEffect, useState } from 'react'
import {
  Plus,
  Trash2,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'
import { portalAxios } from '@/lib/context/OrgPortalAuthContext'
import { toast } from 'sonner'

const ALL_EVENTS = [
  { value: 'qr.scanned', label: 'QR Scanned' },
  { value: 'qr.created', label: 'QR Created' },
  { value: 'qr.updated', label: 'QR Updated' },
  { value: 'qr.deleted', label: 'QR Deleted' },
  { value: 'credits.low', label: 'Credits Low' },
]

interface OrgWebhook {
  id: number
  url: string
  events: string[]
  is_active: boolean
  created_at: string
  secret?: string
}

interface Delivery {
  id: number
  event: string
  status: 'success' | 'failed' | 'pending'
  response_status: number | null
  attempted_at: string
  next_retry_at: string | null
}

function SecretModal({ secret, onClose }: { secret: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(secret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Secret copied!')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-1 text-lg font-bold text-gray-900">Webhook Secret</h2>
        <p className="mb-4 text-sm text-yellow-700">
          This secret is shown only once. Copy it now and store it securely. Use it to verify the
          <code className="mx-1 rounded bg-yellow-100 px-1 font-mono text-xs">X-KQ-Signature</code>
          header on incoming webhook events.
        </p>
        <div className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2">
          <span className="flex-1 break-all font-mono text-sm text-gray-800">{secret}</span>
          <button onClick={copy} className="shrink-0 text-indigo-500 hover:text-indigo-700">
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            I've saved the secret
          </button>
        </div>
      </div>
    </div>
  )
}

function DeliveryRow({ webhookId }: { webhookId: number }) {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    portalAxios
      .get<{ data: Delivery[] }>(`/webhooks/${webhookId}/deliveries`)
      .then(r => setDeliveries(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [webhookId])

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  if (deliveries.length === 0) {
    return <p className="py-4 text-center text-xs text-gray-400">No deliveries yet.</p>
  }

  return (
    <div className="divide-y text-xs">
      {deliveries.map(d => (
        <div key={d.id} className="flex items-center gap-3 px-4 py-2">
          {d.status === 'success' ? (
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-500" />
          ) : d.status === 'failed' ? (
            <XCircle className="h-3.5 w-3.5 shrink-0 text-red-400" />
          ) : (
            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-yellow-400" />
          )}
          <span className="w-28 shrink-0 font-mono text-gray-600">{d.event}</span>
          <span
            className={`w-10 shrink-0 font-semibold ${d.response_status && d.response_status < 300 ? 'text-green-600' : 'text-red-500'}`}
          >
            {d.response_status ?? '—'}
          </span>
          <span className="flex-1 text-gray-400">{new Date(d.attempted_at).toLocaleString()}</span>
          {d.next_retry_at && d.status === 'failed' && (
            <span className="text-yellow-600">
              retry {new Date(d.next_retry_at).toLocaleString()}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

export default function OrgPortalWebhooksPage() {
  const [hooks, setHooks] = useState<OrgWebhook[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newUrl, setNewUrl] = useState('')
  const [newEvents, setNewEvents] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [secretModal, setSecretModal] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [toggling, setToggling] = useState<number | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)

  useEffect(() => {
    portalAxios
      .get<{ data: OrgWebhook[] }>('/webhooks')
      .then(r => setHooks(r.data.data))
      .catch(() => toast.error('Failed to load webhooks.'))
      .finally(() => setLoading(false))
  }, [])

  const toggleEvent = (event: string) => {
    setNewEvents(prev => (prev.includes(event) ? prev.filter(e => e !== event) : [...prev, event]))
  }

  const create = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newEvents.length === 0) {
      toast.error('Select at least one event.')
      return
    }
    setSaving(true)
    try {
      const res = await portalAxios.post<{ data: OrgWebhook }>('/webhooks', {
        url: newUrl,
        events: newEvents,
      })
      const hook = res.data.data
      setHooks(prev => [...prev, hook])
      if (hook.secret) setSecretModal(hook.secret)
      setNewUrl('')
      setNewEvents([])
      setCreating(false)
      toast.success('Webhook created.')
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Failed to create webhook.')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (hook: OrgWebhook) => {
    setToggling(hook.id)
    try {
      await portalAxios.patch(`/webhooks/${hook.id}`, { is_active: !hook.is_active })
      setHooks(prev => prev.map(h => (h.id === hook.id ? { ...h, is_active: !h.is_active } : h)))
    } catch {
      toast.error('Failed to update webhook.')
    } finally {
      setToggling(null)
    }
  }

  const destroy = async (hookId: number) => {
    if (!confirm('Delete this webhook?')) return
    setDeleting(hookId)
    try {
      await portalAxios.delete(`/webhooks/${hookId}`)
      setHooks(prev => prev.filter(h => h.id !== hookId))
      if (expanded === hookId) setExpanded(null)
    } catch {
      toast.error('Failed to delete webhook.')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      {secretModal && <SecretModal secret={secretModal} onClose={() => setSecretModal(null)} />}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Webhooks</h1>
          <p className="mt-1 text-sm text-gray-500">
            Receive real-time HTTP notifications for API events.
          </p>
        </div>
        <button
          onClick={() => setCreating(v => !v)}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add Webhook
        </button>
      </div>

      {/* Create form */}
      {creating && (
        <form onSubmit={create} className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-800">New Webhook</h2>
          <div className="mb-4">
            <label className="mb-1 block text-xs font-medium text-gray-600">Endpoint URL</label>
            <input
              type="url"
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              placeholder="https://your-server.com/webhook"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Events to subscribe
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_EVENTS.map(ev => (
                <label
                  key={ev.value}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    newEvents.includes(ev.value)
                      ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={newEvents.includes(ev.value)}
                    onChange={() => toggleEvent(ev.value)}
                  />
                  {ev.label}
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="rounded-lg border px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Creating…' : 'Create Webhook'}
            </button>
          </div>
        </form>
      )}

      {/* Webhook list */}
      {hooks.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-10 text-center">
          <p className="font-medium text-gray-500">No webhooks configured</p>
          <p className="mt-1 text-sm text-gray-400">Click "Add Webhook" to create one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {hooks.map(hook => (
            <div key={hook.id} className="rounded-xl border bg-white shadow-sm">
              {/* Header row */}
              <div className="flex items-center gap-3 p-4">
                <button
                  onClick={() => setExpanded(expanded === hook.id ? null : hook.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {expanded === hook.id ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-mono text-sm text-gray-800">{hook.url}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {hook.events.map(ev => (
                      <span
                        key={ev}
                        className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-600"
                      >
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Toggle */}
                <button
                  onClick={() => toggleActive(hook)}
                  disabled={toggling === hook.id}
                  className="shrink-0 disabled:opacity-50"
                  title={hook.is_active ? 'Disable' : 'Enable'}
                >
                  {hook.is_active ? (
                    <ToggleRight className="h-6 w-6 text-indigo-600" />
                  ) : (
                    <ToggleLeft className="h-6 w-6 text-gray-400" />
                  )}
                </button>
                {/* Delete */}
                <button
                  onClick={() => destroy(hook.id)}
                  disabled={deleting === hook.id}
                  className="shrink-0 text-red-400 hover:text-red-600 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Delivery history */}
              {expanded === hook.id && (
                <div className="border-t bg-gray-50">
                  <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Recent Deliveries
                  </p>
                  <DeliveryRow webhookId={hook.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
