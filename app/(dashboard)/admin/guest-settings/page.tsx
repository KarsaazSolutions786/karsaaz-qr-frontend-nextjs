'use client'

import { useState, useEffect } from 'react'
import {
  adminGuestAPI,
  type GuestConfiguration,
  type GuestAnalytics,
} from '@/lib/api/endpoints/guest'
import { useTranslation } from '@/lib/i18n'
import { QR_TYPES } from '@/lib/constants/qr-types'
import { LottieLoader } from '@/components/ui/lottie-loader'

const ALL_QR_TYPES = QR_TYPES.map(t => ({ id: t.id, name: t.name, cat: t.cat }))
const ALL_EXPORT_FORMATS = ['png', 'svg', 'pdf', 'eps']
const ALL_DESIGN_FEATURES = [
  { id: 'basic_colors', label: 'Basic Colors' },
  { id: 'module_shapes', label: 'Module Shapes' },
  { id: 'frames', label: 'Frames' },
  { id: 'logos', label: 'Logos' },
  { id: 'patterns', label: 'Patterns' },
]

const inputClass =
  'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'

/**
 * Purpose: Executes Toggle functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${enabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  )
}

/**
 * Purpose: Executes AdminGuestSettingsPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export default function AdminGuestSettingsPage() {
  const { t } = useTranslation()
  const [config, setConfig] = useState<GuestConfiguration | null>(null)
  const [analytics, setAnalytics] = useState<GuestAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    /**
     * Purpose: Executes load functionality.
     * Owner/Author: Syed Ashhad
     * Created/Updated: March 2026
     */
    const load = async () => {
      try {
        const [cfg, stats] = await Promise.all([
          adminGuestAPI.getConfiguration(),
          adminGuestAPI.getAnalytics().catch(() => null),
        ])
        setConfig(cfg)
        setAnalytics(stats)
      } catch {
        setError(t('Failed to load guest configuration'))
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [t])

  /**
   * Purpose: Updates the configuration or state.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
  const updateConfig = <K extends keyof GuestConfiguration>(key: K, value: GuestConfiguration[K]) => {
    setConfig(prev => (prev ? { ...prev, [key]: value } : prev))
    setSaved(false)
    setError(null)
  }

  /**
   * Purpose: Executes toggleArrayItem functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
  const toggleArrayItem = (key: 'allowed_qr_types' | 'allowed_export_formats' | 'allowed_design_features', item: string) => {
    if (!config) return
    const arr = config[key]
    const next = arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]
    updateConfig(key, next)
  }

  /**
   * Purpose: Executes handleSave functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!config) return
    setIsSaving(true)
    setError(null)
    setSaved(false)
    try {
      const payload: Partial<GuestConfiguration> = {
        is_guest_mode_enabled: config.is_guest_mode_enabled,
        allowed_qr_types: config.allowed_qr_types,
        max_qrcodes_per_session: config.max_qrcodes_per_session,
        max_scans_per_session: config.max_scans_per_session,
        max_downloads_per_session: config.max_downloads_per_session,
        session_expiry_days: config.session_expiry_days,
        allow_dynamic_qrcodes: config.allow_dynamic_qrcodes,
        allow_design_customization: config.allow_design_customization,
        allow_logo_upload: config.allow_logo_upload,
        allow_scanner: config.allow_scanner,
        allow_scan_history: config.allow_scan_history,
        allowed_export_formats: config.allowed_export_formats,
        max_file_size_kb: config.max_file_size_kb,
        storage_quota_bytes: config.storage_quota_bytes,
        show_signup_prompt_after: config.show_signup_prompt_after,
        signup_prompt_message: config.signup_prompt_message,
        watermark_enabled: config.watermark_enabled,
        watermark_text: config.watermark_text,
        allowed_design_features: config.allowed_design_features,
        data_migration_on_signup: config.data_migration_on_signup,
      }
      const updated = await adminGuestAPI.updateConfiguration(payload)
      setConfig(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      setError(err?.response?.data?.message || t('Failed to save configuration'))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <LottieLoader size={80} />
      </div>
    )
  }

  if (!config) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error || t('Unable to load guest configuration.')}
        </div>
      </div>
    )
  }

  const summary = analytics?.summary

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}
      {saved && (
        <div className="mb-6 rounded-md bg-green-50 p-4 text-sm text-green-700">
          {t('Guest configuration saved successfully.')}
        </div>
      )}

      {/* Analytics Summary */}
      {summary && (
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { value: summary.total_sessions, label: t('Total Sessions'), color: 'text-primary-600' },
            { value: summary.active_sessions, label: t('Active'), color: 'text-green-600' },
            { value: `${summary.conversion_rate}%`, label: t('Conversion'), color: 'text-purple-600' },
            { value: summary.converted_sessions, label: t('Converted'), color: 'text-amber-600' },
          ].map(stat => (
            <div key={stat.label} className="overflow-hidden rounded-lg bg-white p-4 text-center shadow dark:bg-gray-800">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* General */}
        <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
          <div className="border-b border-gray-200 px-4 py-5 dark:border-gray-700 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t('General')}</h2>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('Enable Guest Mode')}
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('Allow visitors to create QR codes without signing up')}
                </p>
              </div>
              <Toggle
                enabled={config.is_guest_mode_enabled}
                onChange={v => updateConfig('is_guest_mode_enabled', v)}
              />
            </div>
          </div>
        </div>

        {/* Allowed QR Types */}
        <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
          <div className="border-b border-gray-200 px-4 py-5 dark:border-gray-700 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t('Allowed QR Types')}</h2>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <div className="space-y-6">
              {/* Static types */}
              <div>
                <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">{t('Static QR Types')}</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {ALL_QR_TYPES.filter(t => t.cat === 'static').map(type => (
                    <label key={type.id} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={config.allowed_qr_types.includes(type.id)}
                        onChange={() => toggleArrayItem('allowed_qr_types', type.id)}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      {type.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Dynamic types */}
              <div>
                <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">{t('Dynamic QR Types')}</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {ALL_QR_TYPES.filter(t => t.cat === 'dynamic').map(type => (
                    <label
                      key={type.id}
                      className={`flex items-center gap-2 text-sm ${!config.allow_dynamic_qrcodes ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      <input
                        type="checkbox"
                        checked={config.allowed_qr_types.includes(type.id)}
                        onChange={() => toggleArrayItem('allowed_qr_types', type.id)}
                        disabled={!config.allow_dynamic_qrcodes}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                      />
                      {type.name}
                    </label>
                  ))}
                </div>
                {!config.allow_dynamic_qrcodes && (
                  <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                    {t('Enable "Allow Dynamic QR Codes" in Feature Toggles to select dynamic types.')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Session Limits */}
        <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
          <div className="border-b border-gray-200 px-4 py-5 dark:border-gray-700 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t('Session Limits')}</h2>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('Max QR Codes per Session')}
                </label>
                <input
                  type="number"
                  min={1}
                  value={config.max_qrcodes_per_session}
                  onChange={e => updateConfig('max_qrcodes_per_session', parseInt(e.target.value) || 1)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('Max Scans per Session')}
                </label>
                <input
                  type="number"
                  min={1}
                  value={config.max_scans_per_session}
                  onChange={e => updateConfig('max_scans_per_session', parseInt(e.target.value) || 1)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('Max Downloads per Session')}
                </label>
                <input
                  type="number"
                  min={1}
                  value={config.max_downloads_per_session}
                  onChange={e => updateConfig('max_downloads_per_session', parseInt(e.target.value) || 1)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('Session Expiry (Days)')}
                </label>
                <input
                  type="number"
                  min={1}
                  value={config.session_expiry_days}
                  onChange={e => updateConfig('session_expiry_days', parseInt(e.target.value) || 1)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('Max File Size (KB)')}
                </label>
                <input
                  type="number"
                  min={1}
                  value={config.max_file_size_kb}
                  onChange={e => updateConfig('max_file_size_kb', parseInt(e.target.value) || 100)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('Storage Quota (MB)')}
                </label>
                <input
                  type="number"
                  min={1}
                  step={5}
                  value={Math.round((config.storage_quota_bytes || 10485760) / (1024 * 1024))}
                  onChange={e => updateConfig('storage_quota_bytes', (parseInt(e.target.value) || 10) * 1024 * 1024)}
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-gray-500">{t('Total storage per guest session')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
          <div className="border-b border-gray-200 px-4 py-5 dark:border-gray-700 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t('Feature Toggles')}</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {([
              { key: 'allow_dynamic_qrcodes', label: t('Allow Dynamic QR Codes'), desc: t('Let guests create dynamic (trackable) QR codes') },
              { key: 'allow_design_customization', label: t('Allow Design Customization'), desc: t('Colors, shapes, frames, and other design options') },
              { key: 'allow_logo_upload', label: t('Allow Logo Upload'), desc: t('Let guests upload a logo into QR codes') },
              { key: 'allow_scanner', label: t('Allow Scanner'), desc: t('Let guests use the QR code scanner') },
              { key: 'allow_scan_history', label: t('Allow Scan History'), desc: t('Save scan history for guest sessions') },
              { key: 'data_migration_on_signup', label: t('Data Migration on Signup'), desc: t('Auto-migrate guest QR codes when they create an account') },
            ] as const).map(item => (
              <div key={item.key} className="flex items-center justify-between px-4 py-4 sm:px-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
                <Toggle
                  enabled={config[item.key] as boolean}
                  onChange={v => updateConfig(item.key, v)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Export Formats */}
        <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
          <div className="border-b border-gray-200 px-4 py-5 dark:border-gray-700 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t('Export Formats')}</h2>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <div className="flex flex-wrap gap-6">
              {ALL_EXPORT_FORMATS.map(fmt => (
                <label key={fmt} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={config.allowed_export_formats.includes(fmt)}
                    onChange={() => toggleArrayItem('allowed_export_formats', fmt)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="uppercase">{fmt}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Design Features */}
        <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
          <div className="border-b border-gray-200 px-4 py-5 dark:border-gray-700 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t('Allowed Design Features')}</h2>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <div className="flex flex-wrap gap-6">
              {ALL_DESIGN_FEATURES.map(feat => (
                <label key={feat.id} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={config.allowed_design_features.includes(feat.id)}
                    onChange={() => toggleArrayItem('allowed_design_features', feat.id)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  {feat.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Signup Prompt */}
        <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
          <div className="border-b border-gray-200 px-4 py-5 dark:border-gray-700 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t('Signup Prompt')}</h2>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('Show Prompt After N QR Creations')}
                </label>
                <input
                  type="number"
                  min={1}
                  value={config.show_signup_prompt_after}
                  onChange={e => updateConfig('show_signup_prompt_after', parseInt(e.target.value) || 1)}
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t('Number of QR creations before showing the signup prompt')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('Custom Prompt Message')}
                </label>
                <textarea
                  rows={3}
                  value={config.signup_prompt_message || ''}
                  onChange={e => updateConfig('signup_prompt_message', e.target.value || null)}
                  placeholder={t('Sign up to save your QR codes and unlock more features!')}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Watermark */}
        <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
          <div className="border-b border-gray-200 px-4 py-5 dark:border-gray-700 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t('Watermark')}</h2>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('Enable Watermark')}
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('Add watermark text to guest-generated QR codes')}
                  </p>
                </div>
                <Toggle
                  enabled={config.watermark_enabled}
                  onChange={v => updateConfig('watermark_enabled', v)}
                />
              </div>
              {config.watermark_enabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('Watermark Text')}
                  </label>
                  <input
                    type="text"
                    value={config.watermark_text}
                    onChange={e => updateConfig('watermark_text', e.target.value)}
                    placeholder="KarsaazQR"
                    className={inputClass}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center rounded-md bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-105 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all"
          >
            {isSaving ? t('Saving...') : t('Save Settings')}
          </button>
        </div>
      </form>
    </div>
  )
}
