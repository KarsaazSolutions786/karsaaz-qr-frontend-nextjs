'use client'

import { useEffect, useState } from 'react'
import { useSystemConfigs } from '@/lib/hooks/queries/useSystemConfigs'
import { useSaveSystemConfigs } from '@/lib/hooks/mutations/useSystemConfigMutations'

const CONFIG_KEYS = [
  'app.available_qrcode_types',
  'event_qrcode_type.date_format',
  'qrcode.error_correction',
  'qrcode.prevented_slugs',
]

const QR_TYPE_OPTIONS = [
  { value: 'url', label: 'URL' },
  { value: 'vcard', label: 'vCard' },
  { value: 'wifi', label: 'WiFi' },
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'sms', label: 'SMS' },
  { value: 'geo', label: 'Geo Location' },
  { value: 'event', label: 'Event' },
  { value: 'app', label: 'App' },
  { value: 'biolink', label: 'Bio Link' },
]

const ERROR_CORRECTION_OPTIONS = [
  { value: 'L', label: 'L – Low (7% recovery)' },
  { value: 'M', label: 'M – Medium (15% recovery)' },
  { value: 'Q', label: 'Q – Quartile (25% recovery)' },
  { value: 'H', label: 'H – High (30% recovery)' },
]

export default function QrCodeTypesSettingsPage() {
  const { data: configs, isLoading } = useSystemConfigs(CONFIG_KEYS)
  const { mutateAsync: save, isPending: isSaving, error } = useSaveSystemConfigs(CONFIG_KEYS)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (configs) {
      setFormData({
        ...configs,
        'qrcode.error_correction': configs['qrcode.error_correction'] || 'M',
      })
    }
  }, [configs])

  const update = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const selectedTypes = (formData['app.available_qrcode_types'] || '').split(',').filter(Boolean)

  const toggleType = (type: string) => {
    const current = new Set(selectedTypes)
    if (current.has(type)) {
      current.delete(type)
    } else {
      current.add(type)
    }
    update('app.available_qrcode_types', Array.from(current).join(','))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    await save(Object.entries(formData).map(([key, value]) => ({ key, value })))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">QR Code Types Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Configure which QR code types are available and their defaults.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
          Failed to save settings. Please try again.
        </div>
      )}
      {saved && (
        <div className="mb-6 rounded-md bg-green-50 p-4 text-sm text-green-700">
          Settings saved successfully.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Available QR Code Types</h2>
          <p className="mb-4 text-sm text-gray-500">Select which QR code types users can create.</p>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {QR_TYPE_OPTIONS.map(({ value, label }) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm transition-colors hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(value)}
                  onChange={() => toggleType(value)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {label}
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Defaults</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Error Correction Level
              </label>
              <select
                value={formData['qrcode.error_correction'] || 'M'}
                onChange={(e) => update('qrcode.error_correction', e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {ERROR_CORRECTION_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Event QR Date Format
              </label>
              <input
                type="text"
                value={formData['event_qrcode_type.date_format'] || ''}
                onChange={(e) => update('event_qrcode_type.date_format', e.target.value)}
                placeholder="YYYY-MM-DD HH:mm"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Prevented Slugs</h2>
          <p className="mb-4 text-sm text-gray-500">
            Slugs that cannot be used for QR codes. Enter one per line or comma-separated.
          </p>
          <textarea
            rows={5}
            value={formData['qrcode.prevented_slugs'] || ''}
            onChange={(e) => update('qrcode.prevented_slugs', e.target.value)}
            placeholder={"admin\napi\nlogin\ndashboard"}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-xs shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
