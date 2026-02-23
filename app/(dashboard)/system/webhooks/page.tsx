'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { webhooksAPI, Webhook, WebhookPayload } from '@/lib/api/endpoints/webhooks'

const availableEvents = [
  'qr.created', 'qr.updated', 'qr.deleted', 'qr.scanned',
  'user.created', 'user.updated', 'subscription.created', 'subscription.canceled',
  'payment.completed', 'payment.failed',
]

function WebhookForm({
  initial,
  onSubmit,
  onCancel,
  isPending,
}: {
  initial?: Webhook
  onSubmit: (data: WebhookPayload) => void
  onCancel: () => void
  isPending: boolean
}) {
  const [url, setUrl] = useState(initial?.url || '')
  const [events, setEvents] = useState<string[]>(initial?.events || [])
  const [secretKey, setSecretKey] = useState(initial?.secret_key || '')

  const toggleEvent = (event: string) =>
    setEvents((prev) => (prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]))

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Webhook URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/webhook"
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm dark:text-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Secret Key (optional)</label>
        <input
          type="text"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          placeholder="whsec_..."
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm font-mono dark:text-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Events</label>
        <div className="flex flex-wrap gap-2">
          {availableEvents.map((event) => (
            <button
              key={event}
              type="button"
              onClick={() => toggleEvent(event)}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                events.includes(event)
                  ? 'bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'
              }`}
            >
              {event}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => onSubmit({ url, events, secret_key: secretKey || undefined })} disabled={isPending || !url}>
          {isPending ? 'Saving...' : initial ? 'Update' : 'Create'}
        </Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  )
}

export default function WebhooksPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null)

  const { data: webhooks, isLoading, error } = useQuery({
    queryKey: ['system', 'webhooks'],
    queryFn: webhooksAPI.list,
  })

  const createMutation = useMutation({
    mutationFn: webhooksAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system', 'webhooks'] })
      setShowForm(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<WebhookPayload> }) =>
      webhooksAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system', 'webhooks'] })
      setEditingWebhook(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: webhooksAPI.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['system', 'webhooks'] }),
  })

  const testMutation = useMutation({
    mutationFn: webhooksAPI.test,
  })

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold dark:text-gray-100">Webhook Management</h1>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold dark:text-gray-100 mb-4">Webhook Management</h1>
        <Card>
          <CardContent className="p-6 text-center text-red-600 dark:text-red-400">
            Failed to load webhooks. Please try again.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-gray-100">Webhook Management</h1>
        <Button onClick={() => { setShowForm(true); setEditingWebhook(null) }}>
          Add Webhook
        </Button>
      </div>

      {(showForm || editingWebhook) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{editingWebhook ? 'Edit Webhook' : 'New Webhook'}</CardTitle>
          </CardHeader>
          <CardContent>
            <WebhookForm
              initial={editingWebhook || undefined}
              onSubmit={(data) =>
                editingWebhook
                  ? updateMutation.mutate({ id: editingWebhook.id, data })
                  : createMutation.mutate(data)
              }
              onCancel={() => { setShowForm(false); setEditingWebhook(null) }}
              isPending={createMutation.isPending || updateMutation.isPending}
            />
          </CardContent>
        </Card>
      )}

      {(!webhooks || webhooks.length === 0) && !showForm && (
        <Card>
          <CardContent className="p-8 text-center text-gray-500 dark:text-gray-400">
            No webhooks configured yet. Add one to get started.
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {webhooks?.map((webhook) => (
          <Card key={webhook.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate font-mono text-sm">
                      {webhook.url}
                    </p>
                    <Badge variant={webhook.is_active ? 'default' : 'secondary'}>
                      {webhook.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {webhook.events.map((event) => (
                      <span key={event} className="inline-flex rounded bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-400">
                        {event}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Last triggered: {webhook.last_triggered_at ? new Date(webhook.last_triggered_at).toLocaleString() : 'Never'}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => testMutation.mutate(webhook.id)}
                    disabled={testMutation.isPending}
                  >
                    {testMutation.isPending ? 'Testing...' : 'Test'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => { setEditingWebhook(webhook); setShowForm(false) }}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => { if (confirm('Delete this webhook?')) deleteMutation.mutate(webhook.id) }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
