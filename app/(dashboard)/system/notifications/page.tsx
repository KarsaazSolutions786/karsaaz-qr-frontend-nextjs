'use client'

import { useState, useEffect, useCallback } from 'react'
import { systemConfigsAPI, SystemConfig } from '@/lib/api/endpoints/system-configs'

interface NotificationEventConfig {
  key: string
  label: string
  description: string
  extraFields?: { key: string; label: string; type: 'number' | 'text' }[]
}

const NOTIFICATION_EVENTS: NotificationEventConfig[] = [
  { key: 'trial_expired', label: 'Trial Expired', description: 'Sent when user trial period expires' },
  {
    key: 'subscription_expiring_soon', label: 'Subscription Expiring Soon',
    description: 'Sent before subscription expiry',
    extraFields: [{ key: 'remaining_days', label: 'Days Before Expiry', type: 'number' }],
  },
  { key: 'subscription_expired', label: 'Subscription Expired', description: 'Sent when subscription expires' },
  { key: 'dynamic_qr_limit_reached', label: 'Dynamic QR Limit Reached', description: 'Sent when user hits dynamic QR code limit' },
  { key: 'scan_limit_reached', label: 'Scan Limit Reached', description: 'Sent when user scan limit is reached' },
  { key: 'invite_user', label: 'Invite User', description: 'Sent for user invitation emails' },
  { key: 'bulk_operation_completed', label: 'Bulk Operation Completed', description: 'Sent when a bulk operation finishes' },
  { key: 'lead_form_response', label: 'Lead Form Response', description: 'Sent on new lead form submissions' },
  { key: 'custom_form_response', label: 'Custom Form Response', description: 'Sent on new custom form submissions' },
]

const inputClass = 'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

export default function SystemNotificationsPage() {
  const [activeTab, setActiveTab] = useState(NOTIFICATION_EVENTS[0]?.key ?? 'trial_expired')
  const [configs, setConfigs] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Build all config keys needed
  const allKeys = NOTIFICATION_EVENTS.flatMap((evt) => {
    const keys = [
      `notification_${evt.key}_enabled`,
      `notification_${evt.key}_email_subject`,
      `notification_${evt.key}_email_body`,
      `notification_${evt.key}_sms_body`,
    ]
    evt.extraFields?.forEach((f) => keys.push(`notification_${evt.key}_${f.key}`))
    return keys
  })

  // Load configs from API
  useEffect(() => {
    systemConfigsAPI.get(allKeys).then((data) => {
      const map: Record<string, string> = {}
      data.forEach((c) => { if (c.value != null) map[c.key] = c.value })
      setConfigs(map)
      setLoading(false)
    }).catch(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateConfig = useCallback((key: string, value: string) => {
    setConfigs((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const toSave: SystemConfig[] = Object.entries(configs).map(([key, value]) => ({ key, value }))
      await systemConfigsAPI.save(toSave)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch { /* toast error */ }
    setSaving(false)
  }

  const activeEvent = NOTIFICATION_EVENTS.find((e) => e.key === activeTab)!
  const prefix = `notification_${activeTab}`

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notification Settings</h1>
        <p className="mt-2 text-sm text-gray-600">Configure email and SMS notification templates for each event type</p>
      </div>

      <div className="mt-8 flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-64 flex-shrink-0">
          <nav className="space-y-1">
            {NOTIFICATION_EVENTS.map((evt) => (
              <button
                key={evt.key}
                type="button"
                onClick={() => setActiveTab(evt.key)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === evt.key
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  {evt.label}
                  <span className={`ml-2 h-2 w-2 rounded-full ${
                    configs[`${`notification_${evt.key}`}_enabled`] === '1' ? 'bg-green-400' : 'bg-gray-300'
                  }`} />
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">{activeEvent.label}</h2>
                  <p className="text-sm text-gray-500">{activeEvent.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateConfig(`${prefix}_enabled`, configs[`${prefix}_enabled`] === '1' ? '0' : '1')}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    configs[`${prefix}_enabled`] === '1' ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                    configs[`${prefix}_enabled`] === '1' ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Extra Fields (event-specific) */}
              {activeEvent.extraFields?.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                  <input
                    type={field.type}
                    value={configs[`${prefix}_${field.key}`] || ''}
                    onChange={(e) => updateConfig(`${prefix}_${field.key}`, e.target.value)}
                    className={inputClass + ' max-w-xs'}
                  />
                </div>
              ))}

              {/* Email Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Subject</label>
                <input
                  type="text"
                  value={configs[`${prefix}_email_subject`] || ''}
                  onChange={(e) => updateConfig(`${prefix}_email_subject`, e.target.value)}
                  placeholder={`${activeEvent.label} - Notification`}
                  className={inputClass}
                />
              </div>

              {/* Email Body */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Body</label>
                <p className="text-xs text-gray-400 mb-1">Supports Markdown formatting</p>
                <textarea
                  rows={6}
                  value={configs[`${prefix}_email_body`] || ''}
                  onChange={(e) => updateConfig(`${prefix}_email_body`, e.target.value)}
                  placeholder="Enter the email notification body..."
                  className={inputClass}
                />
              </div>

              {/* SMS Body */}
              <div>
                <label className="block text-sm font-medium text-gray-700">SMS Body</label>
                <p className="text-xs text-gray-400 mb-1">Only sent if SMS portal is configured</p>
                <textarea
                  rows={3}
                  value={configs[`${prefix}_sms_body`] || ''}
                  onChange={(e) => updateConfig(`${prefix}_sms_body`, e.target.value)}
                  placeholder="Enter the SMS notification body..."
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        {saved && <span className="text-sm font-medium text-green-600">Settings saved successfully!</span>}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
