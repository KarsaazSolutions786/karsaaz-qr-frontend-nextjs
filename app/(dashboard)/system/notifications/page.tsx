'use client'

import { useState, useEffect, useCallback } from 'react'
import { systemConfigsAPI, SystemConfig } from '@/lib/api/endpoints/system-configs'
import { useTranslation } from '@/lib/i18n'
import { toast } from 'sonner'
import { LottieLoader } from '@/components/ui/lottie-loader'

// ─── Template Variable Definitions ───────────────────────────────────────────

interface TemplateVariable {
  name: string
  description: string
}

// ─── Notification Event Config ───────────────────────────────────────────────

interface NotificationEventConfig {
  key: string
  label: string
  description: string
  variables?: TemplateVariable[]
  extraFields?: { key: string; label: string; type: 'number' | 'text' | 'toggle'; hint?: string }[]
  /** If true, show a "Send to QR owner" toggle */
  hasSendToOwner?: boolean
  /** If true, show a "Recipients" text field for comma-separated emails */
  hasRecipients?: boolean
  /** If true, show a threshold percentage field */
  hasThreshold?: boolean
}

const NOTIFICATION_EVENTS: NotificationEventConfig[] = [
  {
    key: 'trial_expired',
    label: 'Trial Expired',
    description: 'Sent when user trial period expires',
    variables: [
      { name: 'PLANS_PAGE_URL', description: 'Link to the pricing/plans page' },
    ],
  },
  {
    key: 'subscription_expiring_soon',
    label: 'Subscription Expiring Soon',
    description: 'Sent before subscription expiry',
    extraFields: [
      { key: 'remaining_days', label: 'Days Before Expiry', type: 'number', hint: 'Number of days before expiry to send the notification' },
    ],
    variables: [
      { name: 'PLANS_PAGE_URL', description: 'Link to the pricing/plans page' },
    ],
  },
  {
    key: 'subscription_expired',
    label: 'Subscription Expired',
    description: 'Sent when subscription expires',
    variables: [
      { name: 'PLANS_PAGE_URL', description: 'Link to the pricing/plans page' },
    ],
  },
  {
    key: 'dynamic_qr_limit_reached',
    label: 'Dynamic QR Limit Reached',
    description: 'Sent when user hits dynamic QR code limit defined by their plan',
    hasThreshold: true,
    variables: [
      { name: 'PLANS_PAGE_URL', description: 'Link to the pricing/plans page' },
    ],
  },
  {
    key: 'scan_limit_reached',
    label: 'Scan Limit Reached',
    description: 'Sent when user hits the scan limit defined by their plan',
    hasThreshold: true,
    variables: [
      { name: 'PLANS_PAGE_URL', description: 'Link to the pricing/plans page' },
    ],
  },
  {
    key: 'invite_user',
    label: 'Invite User',
    description: 'Sent to users when they are invited by an account owner',
    variables: [
      { name: 'LOGIN_URL', description: 'URL to the login page' },
      { name: 'ACCOUNT_OWNER', description: 'Name of the user who sent the invite' },
      { name: 'APP_NAME', description: 'Application name' },
      { name: 'INVITED_EMAIL_ADDRESS', description: 'Email address of invited user' },
      { name: 'GENERATED_PASSWORD', description: 'Generated password of the invited user' },
      { name: 'FOLDER_NAME', description: 'Name of the folder the user is invited to participate in' },
    ],
  },
  {
    key: 'bulk_operation_completed',
    label: 'Bulk Operation Completed',
    description: 'Sent to users when a bulk QR operation finishes',
    hasRecipients: true,
    variables: [
      { name: 'BULK_OPERATION_NAME', description: 'Name of the completed operation' },
      { name: 'OPERATION_LINK', description: 'Direct link to the operation page' },
    ],
  },
  {
    key: 'lead_form_response',
    label: 'Lead Form Response',
    description: 'Sent when someone submits a lead form QR response',
    hasSendToOwner: true,
    variables: [
      { name: 'FORM_RESPONSE', description: 'Submitted user response content' },
    ],
  },
  {
    key: 'custom_form_response',
    label: 'Custom Form Response',
    description: 'Sent when someone submits a custom form QR response',
    hasSendToOwner: true,
    variables: [
      { name: 'FORM_RESPONSE', description: 'Submitted user response content' },
    ],
  },
]

const inputClass =
  'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'

// ─── Build all config keys needed ────────────────────────────────────────────

/**
 * Purpose: Executes buildAllKeys functionality.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */
function buildAllKeys(): string[] {
  return NOTIFICATION_EVENTS.flatMap((evt) => {
    const prefix = `notification_${evt.key}`
    const keys = [
      `${prefix}_enabled`,
      `${prefix}_email_subject`,
      `${prefix}_email_body`,
      `${prefix}_sms_body`,
    ]
    if (evt.hasRecipients) keys.push(`${prefix}_recipients`)
    if (evt.hasSendToOwner) keys.push(`${prefix}_send_to_owner`)
    if (evt.hasThreshold) keys.push(`${prefix}_threshold_percentage`)
    evt.extraFields?.forEach((f) => keys.push(`${prefix}_${f.key}`))
    return keys
  })
}

// ─── Page Component ──────────────────────────────────────────────────────────

/**
 * Purpose: Executes SystemNotificationsPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function SystemNotificationsPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState(NOTIFICATION_EVENTS[0]?.key ?? 'trial_expired')
  const [configs, setConfigs] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const allKeys = buildAllKeys()

  useEffect(() => {
    systemConfigsAPI
      .get(allKeys)
      .then((data) => {
        const map: Record<string, string> = {}
        data.forEach((c) => {
          if (c.value != null) map[c.key] = c.value
        })
        setConfigs(map)
        setLoading(false)
      })
      .catch(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateConfig = useCallback((key: string, value: string) => {
    setConfigs((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }, [])

  /**
   * Purpose: Executes handleSave functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleSave = async () => {
    setSaving(true)
    try {
      const toSave: SystemConfig[] = Object.entries(configs).map(([key, value]) => ({
        key,
        value,
      }))
      await systemConfigsAPI.save(toSave)
      setSaved(true)
      toast.success(t('Notification settings saved successfully'))
      setTimeout(() => setSaved(false), 3000)
    } catch {
      toast.error(t('Failed to save notification settings'))
    }
    setSaving(false)
  }

  const activeEvent = NOTIFICATION_EVENTS.find((e) => e.key === activeTab)!
  const prefix = `notification_${activeTab}`
  const isEnabled = configs[`${prefix}_enabled`] === '1'

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LottieLoader size={80} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t('Notification Settings')}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {t('Configure email and SMS notification templates for each event type')}
        </p>
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
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{evt.label}</span>
                  <span
                    className={`ml-2 h-2 w-2 flex-shrink-0 rounded-full ${
                      configs[`notification_${evt.key}_enabled`] === '1'
                        ? 'bg-green-400'
                        : 'bg-gray-300'
                    }`}
                  />
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {/* Header Card */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    {activeEvent.label}
                  </h2>
                  <p className="text-sm text-gray-500">{activeEvent.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateConfig(`${prefix}_enabled`, isEnabled ? '0' : '1')
                  }
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    isEnabled ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                  aria-label={isEnabled ? t('Disable notification') : t('Enable notification')}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                      isEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Template Variables Help */}
              {activeEvent.variables && activeEvent.variables.length > 0 && (
                <div className="rounded-md bg-[#D3BBFF]/15 p-4">
                  <h3 className="text-sm font-medium text-primary-800">
                    {t('Available Template Variables')}
                  </h3>
                  <p className="mt-1 text-xs text-primary-600">
                    {t(
                      'Use these variables in Email Body and SMS Body. They will be replaced with actual values when the notification is sent.'
                    )}
                  </p>
                  <div className="mt-3 space-y-1.5">
                    {activeEvent.variables.map((v) => (
                      <div key={v.name} className="flex items-start gap-2 text-sm">
                        <code className="inline-block rounded bg-primary-100 px-1.5 py-0.5 font-mono text-xs text-primary-900">
                          {`{{${v.name}}}`}
                        </code>
                        <span className="text-primary-700">{v.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Threshold Percentage (for limit-type events) */}
              {activeEvent.hasThreshold && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('Threshold Percentage')}
                  </label>
                  <p className="text-xs text-gray-400 mb-1">
                    {t(
                      'Send notification when this percentage of the limit is reached (e.g. 80 sends at 80% usage)'
                    )}
                  </p>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={configs[`${prefix}_threshold_percentage`] || ''}
                    onChange={(e) =>
                      updateConfig(`${prefix}_threshold_percentage`, e.target.value)
                    }
                    placeholder="80"
                    className={inputClass + ' max-w-xs'}
                  />
                </div>
              )}

              {/* Send to QR Owner Toggle (for form response events) */}
              {activeEvent.hasSendToOwner && (
                <div className="flex items-center justify-between rounded-md border border-gray-200 p-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('Send to QR Code Owner')}
                    </label>
                    <p className="text-xs text-gray-400">
                      {t(
                        'When enabled, the notification is also sent to the user who owns the QR code'
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateConfig(
                        `${prefix}_send_to_owner`,
                        configs[`${prefix}_send_to_owner`] === '1' ? '0' : '1'
                      )
                    }
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                      configs[`${prefix}_send_to_owner`] === '1'
                        ? 'bg-primary-600'
                        : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                        configs[`${prefix}_send_to_owner`] === '1'
                          ? 'translate-x-5'
                          : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              )}

              {/* Recipients (for bulk operation events) */}
              {activeEvent.hasRecipients && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('Recipients')}
                  </label>
                  <p className="text-xs text-gray-400 mb-1">
                    {t(
                      'Comma-separated email addresses. Leave empty to send only to the user who initiated the operation.'
                    )}
                  </p>
                  <input
                    type="text"
                    value={configs[`${prefix}_recipients`] || ''}
                    onChange={(e) =>
                      updateConfig(`${prefix}_recipients`, e.target.value)
                    }
                    placeholder="admin@example.com, ops@example.com"
                    className={inputClass}
                  />
                </div>
              )}

              {/* Extra Fields (event-specific, e.g. days before expiry) */}
              {activeEvent.extraFields?.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  {field.hint && (
                    <p className="text-xs text-gray-400 mb-1">{field.hint}</p>
                  )}
                  {field.type === 'toggle' ? (
                    <button
                      type="button"
                      onClick={() =>
                        updateConfig(
                          `${prefix}_${field.key}`,
                          configs[`${prefix}_${field.key}`] === '1' ? '0' : '1'
                        )
                      }
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                        configs[`${prefix}_${field.key}`] === '1'
                          ? 'bg-primary-600'
                          : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                          configs[`${prefix}_${field.key}`] === '1'
                            ? 'translate-x-5'
                            : 'translate-x-0'
                        }`}
                      />
                    </button>
                  ) : (
                    <input
                      type={field.type}
                      value={configs[`${prefix}_${field.key}`] || ''}
                      onChange={(e) =>
                        updateConfig(`${prefix}_${field.key}`, e.target.value)
                      }
                      className={inputClass + ' max-w-xs'}
                    />
                  )}
                </div>
              ))}

              {/* Email Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('Email Subject')}
                </label>
                <input
                  type="text"
                  value={configs[`${prefix}_email_subject`] || ''}
                  onChange={(e) =>
                    updateConfig(`${prefix}_email_subject`, e.target.value)
                  }
                  placeholder={`${activeEvent.label} - Notification`}
                  className={inputClass}
                />
              </div>

              {/* Email Body */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('Email Body')}
                </label>
                <p className="text-xs text-gray-400 mb-1">
                  {t('Supports Markdown formatting. Use template variables above.')}
                </p>
                <textarea
                  rows={8}
                  value={configs[`${prefix}_email_body`] || ''}
                  onChange={(e) =>
                    updateConfig(`${prefix}_email_body`, e.target.value)
                  }
                  placeholder={t('Enter the email notification body...')}
                  className={inputClass}
                />
              </div>

              {/* SMS Body */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('SMS Body')}
                </label>
                <p className="text-xs text-gray-400 mb-1">
                  {t(
                    'Only sent if SMS portal is configured. Set up your SMS portal API keys from SMS Portals settings.'
                  )}
                </p>
                <textarea
                  rows={3}
                  value={configs[`${prefix}_sms_body`] || ''}
                  onChange={(e) =>
                    updateConfig(`${prefix}_sms_body`, e.target.value)
                  }
                  placeholder={t('Enter the SMS notification body...')}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Bar */}
      <div className="mt-6 flex items-center justify-end gap-3">
        {saved && (
          <span className="text-sm font-medium text-green-600">
            {t('Settings saved successfully!')}
          </span>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center rounded-md bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-105 disabled:opacity-50 transition-all"
        >
          {saving ? t('Saving...') : t('Save Settings')}
        </button>
      </div>
    </div>
  )
}
