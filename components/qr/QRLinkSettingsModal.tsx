'use client'

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import apiClient from '@/lib/api/client'

interface QRLinkSettingsModalProps {
  qrCodeId: string
  open: boolean
  onClose: () => void
  onSave: (settings: { slug: string; redirectEnabled: boolean }) => void
}

interface LinkSettings {
  slug: string
  redirectEnabled: boolean
  targetUrl: string
}

export function QRLinkSettingsModal({ qrCodeId, open, onClose, onSave }: QRLinkSettingsModalProps) {
  const [settings, setSettings] = useState<LinkSettings>({
    slug: '',
    redirectEnabled: true,
    targetUrl: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open && qrCodeId) {
      setLoading(true)
      setError('')
      apiClient
        .get(`/qrcodes/${qrCodeId}/link-settings`)
        .then((res) => {
          setSettings({
            slug: res.data.slug || '',
            redirectEnabled: res.data.redirectEnabled ?? true,
            targetUrl: res.data.targetUrl || '',
          })
        })
        .catch(() => setError('Failed to load link settings'))
        .finally(() => setLoading(false))
    }
  }, [open, qrCodeId])

  const handleSave = async () => {
    setLoading(true)
    setError('')
    try {
      await apiClient.put(`/qrcodes/${qrCodeId}/link-settings`, {
        slug: settings.slug,
        redirectEnabled: settings.redirectEnabled,
      })
      onSave({ slug: settings.slug, redirectEnabled: settings.redirectEnabled })
      onClose()
    } catch {
      setError('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">QR Link Settings</h2>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</div>
        )}

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Custom Slug</label>
            <input
              type="text"
              value={settings.slug}
              onChange={(e) => setSettings((s) => ({ ...s, slug: e.target.value }))}
              placeholder="my-custom-slug"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              URL: {typeof window !== 'undefined' ? window.location.origin : ''}/s/{settings.slug || '...'}
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Target URL</label>
            <div className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-600">
              {settings.targetUrl || 'No target URL set'}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Enable Redirect</label>
            <button
              type="button"
              role="switch"
              aria-checked={settings.redirectEnabled}
              onClick={() => setSettings((s) => ({ ...s, redirectEnabled: !s.redirectEnabled }))}
              className={cn(
                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                settings.redirectEnabled ? 'bg-blue-600' : 'bg-gray-200'
              )}
            >
              <span
                className={cn(
                  'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform',
                  settings.redirectEnabled ? 'translate-x-5' : 'translate-x-0'
                )}
              />
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
