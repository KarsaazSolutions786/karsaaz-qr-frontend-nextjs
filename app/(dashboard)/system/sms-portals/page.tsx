'use client'

import { useState, useEffect, useCallback } from 'react'
import { systemConfigsAPI, SystemConfig } from '@/lib/api/endpoints/system-configs'
import { useTranslation } from '@/lib/i18n'
import { toast } from 'sonner'
import { LottieLoader } from '@/components/ui/lottie-loader'

// ─── SMS Provider Definitions ────────────────────────────────────────────────

interface ProviderField {
  key: string
  label: string
  type: 'text' | 'password' | 'url'
  placeholder?: string
}

interface SmsProviderDef {
  id: string
  slug: string
  name: string
  description: string
  fields: ProviderField[]
}

const SMS_PROVIDERS: SmsProviderDef[] = [
  {
    id: 'twilio',
    slug: 'twilio',
    name: 'Twilio',
    description: 'Programmable SMS with global reach and reliable delivery',
    fields: [
      { key: 'account_sid', label: 'Account SID', type: 'text', placeholder: 'ACxxxxxxxxxxxxxxxxxxxxx' },
      { key: 'auth_token', label: 'Auth Token', type: 'password' },
      { key: 'from_number', label: 'From Number', type: 'text', placeholder: '+1234567890' },
    ],
  },
  {
    id: 'vonage',
    slug: 'vonage',
    name: 'Nexmo / Vonage',
    description: 'Enterprise-grade SMS API with smart routing',
    fields: [
      { key: 'api_key', label: 'API Key', type: 'text' },
      { key: 'api_secret', label: 'API Secret', type: 'password' },
      { key: 'from_name', label: 'From Name / Number', type: 'text' },
    ],
  },
  {
    id: 'messagebird',
    slug: 'messagebird',
    name: 'MessageBird',
    description: 'Omnichannel messaging platform with high throughput',
    fields: [
      { key: 'api_key', label: 'API Key', type: 'password' },
      { key: 'originator', label: 'Originator', type: 'text', placeholder: 'YourBrand' },
    ],
  },
  {
    id: 'rbsoft-sms-portal',
    slug: 'rbsoft-sms-portal',
    name: 'RBSoft SMS Portal',
    description: 'Self-hosted SMS gateway with workspace-based routing',
    fields: [
      { key: 'api_key', label: 'API Key', type: 'password', placeholder: '171779******************' },
      { key: 'server', label: 'Server URL', type: 'url', placeholder: 'https://yourdomain.com/workspace' },
    ],
  },
  {
    id: 'custom',
    slug: 'custom-sms-gateway',
    name: 'Custom Gateway',
    description: 'Connect your own SMS gateway via webhook URL',
    fields: [
      { key: 'webhook_url', label: 'Webhook URL', type: 'url', placeholder: 'https://your-gateway.example.com/send' },
      { key: 'auth_token', label: 'Auth Token', type: 'password' },
      { key: 'method', label: 'HTTP Method', type: 'text', placeholder: 'POST' },
    ],
  },
]

const inputClass =
  'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'

// ─── Build all config keys ───────────────────────────────────────────────────

/**
 * Purpose: Executes buildAllKeys functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function buildAllKeys(): string[] {
  return SMS_PROVIDERS.flatMap((provider) => {
    const prefix = `sms-gateways.${provider.slug}`
    const keys = [`${prefix}.enabled`]
    provider.fields.forEach((f) => keys.push(`${prefix}.${f.key}`))
    return keys
  })
}

// ─── Page Component ──────────────────────────────────────────────────────────

/**
 * Purpose: Executes SmsPortalsPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function SmsPortalsPage() {
  const { t } = useTranslation()
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
   * Created/Updated: March 2026
   */
  const handleSave = async () => {
    setSaving(true)
    try {
      const toSave: SystemConfig[] = Object.entries(configs).map(
        ([key, value]) => ({ key, value })
      )
      await systemConfigsAPI.save(toSave)
      setSaved(true)
      toast.success(t('SMS settings saved successfully'))
      setTimeout(() => setSaved(false), 3000)
    } catch {
      toast.error(t('Failed to save SMS settings'))
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LottieLoader size={80} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('SMS Portals')}</h1>
        <p className="mt-2 text-sm text-gray-600">
          {t('Configure SMS gateway providers for sending notifications via SMS')}
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {SMS_PROVIDERS.map((provider) => {
          const prefix = `sms-gateways.${provider.slug}`
          const isEnabled = configs[`${prefix}.enabled`] === '1'

          return (
            <div
              key={provider.id}
              className="overflow-hidden rounded-lg bg-white shadow"
            >
              <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      {provider.name}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {provider.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateConfig(
                        `${prefix}.enabled`,
                        isEnabled ? '0' : '1'
                      )
                    }
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                      isEnabled ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                    aria-label={
                      isEnabled
                        ? t('Disable') + ' ' + provider.name
                        : t('Enable') + ' ' + provider.name
                    }
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
              {isEnabled && (
                <div className="px-4 py-5 sm:px-6">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {provider.fields.map((field) => (
                      <div
                        key={field.key}
                        className={
                          field.type === 'url' ? 'sm:col-span-2' : ''
                        }
                      >
                        <label className="block text-sm font-medium text-gray-700">
                          {field.label}
                        </label>
                        <input
                          type={
                            field.type === 'url' ? 'url' : field.type
                          }
                          value={
                            configs[`${prefix}.${field.key}`] || ''
                          }
                          onChange={(e) =>
                            updateConfig(
                              `${prefix}.${field.key}`,
                              e.target.value
                            )
                          }
                          placeholder={field.placeholder}
                          className={inputClass}
                        />
                      </div>
                    ))}
                  </div>

                  {/* RBSoft-specific help text */}
                  {provider.id === 'rbsoft-sms-portal' && (
                    <div className="mt-4 rounded-md bg-[#D3BBFF]/15 p-3 text-sm text-primary-700">
                      <p className="font-medium">{t('RBSoft Configuration')}</p>
                      <p className="mt-1 text-xs">
                        {t(
                          'Enter your RBSoft SMS Portal API key and workspace server URL. The server URL should point to your RBSoft instance workspace endpoint.'
                        )}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        {saved && (
          <span className="text-sm font-medium text-green-600">
            {t('SMS settings saved successfully!')}
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
