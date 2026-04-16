'use client'

import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'

interface FeatureCost {
  id: number
  feature_key: string
  label: string
  tokens_cost: string // decimal string from API
}

const FEATURE_LABELS: Record<string, string> = {
  'qrcode.list': 'List QR Codes',
  'qrcode.get': 'Get QR Code',
  'qrcode.create.static': 'Create Static QR',
  'qrcode.create.dynamic': 'Create Dynamic QR',
  'qrcode.update': 'Update QR Code',
  'qrcode.delete': 'Delete QR Code',
  'qrcode.bulk_create': 'Bulk Create QR',
  'qrcode.download_png': 'Download QR PNG',
  'analytics.qrcode': 'QR Scan Analytics',
  'analytics.org': 'Org Analytics',
  'ai.qr_art': 'AI QR Art',
  'account.get': 'Get Account Info',
  'tokens.get': 'Get Token Balance',
}

export default function TokenCostsAdminPage() {
  const [costs, setCosts] = useState<FeatureCost[]>([])
  const [editing, setEditing] = useState<Record<number, string>>({})
  const [saving, setSaving] = useState<Record<number, boolean>>({})
  const [error, setError] = useState<string | null>(null)
  const [successId, setSuccessId] = useState<number | null>(null)

  const load = useCallback(async () => {
    try {
      const { data } = await axios.get<{ data: FeatureCost[] }>('/api/admin/api-token-costs')
      setCosts(data.data)
    } catch {
      setError('Failed to load token costs.')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function startEdit(cost: FeatureCost) {
    setEditing(prev => ({ ...prev, [cost.id]: cost.tokens_cost }))
  }

  function cancelEdit(id: number) {
    setEditing(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  async function save(cost: FeatureCost) {
    const newCost = editing[cost.id]
    if (newCost === undefined) return

    setSaving(prev => ({ ...prev, [cost.id]: true }))
    try {
      await axios.put(`/api/admin/api-token-costs/${cost.id}`, {
        tokens_cost: parseFloat(newCost),
      })

      setCosts(prev => prev.map(c => (c.id === cost.id ? { ...c, tokens_cost: newCost } : c)))
      cancelEdit(cost.id)
      setSuccessId(cost.id)
      setTimeout(() => setSuccessId(null), 2500)
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(prev => ({ ...prev, [cost.id]: false }))
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">API Token Costs</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Control how many tokens are deducted from an organization's balance per API operation.
        Changes take effect immediately.
      </p>

      {error && (
        <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
          <button className="ml-3 underline" onClick={() => setError(null)}>
            Dismiss
          </button>
        </div>
      )}

      <div className="rounded-lg border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="text-left px-4 py-3 font-medium">Feature</th>
              <th className="text-left px-4 py-3 font-medium">Key</th>
              <th className="text-center px-4 py-3 font-medium w-36">Tokens / call</th>
              <th className="px-4 py-3 w-32" />
            </tr>
          </thead>
          <tbody>
            {costs.map((cost, i) => {
              const isEditing = cost.id in editing
              const isSaving = saving[cost.id]
              const saved = successId === cost.id

              return (
                <tr
                  key={cost.id}
                  className={`border-b last:border-0 transition-colors ${
                    i % 2 === 0 ? '' : 'bg-muted/20'
                  } ${saved ? 'bg-green-50 dark:bg-green-950/20' : ''}`}
                >
                  {/* Label */}
                  <td className="px-4 py-3 font-medium">
                    {FEATURE_LABELS[cost.feature_key] ?? cost.label}
                  </td>

                  {/* Feature key */}
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                    {cost.feature_key}
                  </td>

                  {/* Cost input */}
                  <td className="px-4 py-3 text-center">
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={editing[cost.id]}
                        onChange={e => setEditing(prev => ({ ...prev, [cost.id]: e.target.value }))}
                        className="w-24 text-center rounded-md border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        onKeyDown={e => {
                          if (e.key === 'Enter') save(cost)
                          if (e.key === 'Escape') cancelEdit(cost.id)
                        }}
                        autoFocus
                      />
                    ) : (
                      <span
                        className="cursor-pointer px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors"
                        onClick={() => startEdit(cost)}
                        title="Click to edit"
                      >
                        {parseFloat(cost.tokens_cost).toFixed(2)}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    {isEditing ? (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => save(cost)}
                          disabled={isSaving}
                          className="rounded-md bg-primary px-3 py-1 text-xs text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        >
                          {isSaving ? 'Saving…' : 'Save'}
                        </button>
                        <button
                          onClick={() => cancelEdit(cost.id)}
                          className="rounded-md border px-3 py-1 text-xs hover:bg-muted"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(cost)}
                        className="rounded-md border px-3 py-1 text-xs hover:bg-muted"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}

            {costs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        💡 Set tokens_cost to <strong>0</strong> to make an operation free (no deduction). Free
        operations still appear in usage logs.
      </p>
    </div>
  )
}
