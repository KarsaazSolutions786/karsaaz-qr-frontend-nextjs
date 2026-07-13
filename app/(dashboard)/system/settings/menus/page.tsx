'use client'

import { useEffect, useState } from 'react'
import { useSystemConfigs } from '@/lib/hooks/queries/useSystemConfigs'
import { useSaveSystemConfigs } from '@/lib/hooks/mutations/useSystemConfigMutations'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useTranslation } from '@/lib/i18n'
import { LottieLoader } from '@/components/ui/lottie-loader'

const CONFIG_KEYS = [
  'app.dashboard-client-menu',
  'app.website-header-menu',
  'app.website-footer-menu',
]

const MENU_TABS = [
  { key: 'app.dashboard-client-menu', label: 'Dashboard Menu' },
  { key: 'app.website-header-menu', label: 'Header Menu' },
  { key: 'app.website-footer-menu', label: 'Footer Menu' },
] as const

const PLACEHOLDER_JSON = JSON.stringify(
  [
    { label: 'Home', url: '/', target: '_self' },
    { label: 'About', url: '/about', target: '_blank' },
  ],
  null,
  2
)

/**
 * Purpose: Executes MenuManagementPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function MenuManagementPage() {
  const { t } = useTranslation()
  const { data: configs, isLoading } = useSystemConfigs(CONFIG_KEYS)
  const saveMutation = useSaveSystemConfigs(CONFIG_KEYS)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState<string>(MENU_TABS[0].key)

  useEffect(() => {
    if (configs) setForm({ ...configs })
  }, [configs])

  /**
   * Purpose: Sets .
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const set = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  /**
   * Purpose: Executes validateJson functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const validateJson = (key: string, value: string): boolean => {
    if (!value.trim()) return true
    try {
      const parsed = JSON.parse(value)
      if (!Array.isArray(parsed)) {
        setErrors((prev) => ({ ...prev, [key]: 'Must be a JSON array.' }))
        return false
      }
      return true
    } catch {
      setErrors((prev) => ({ ...prev, [key]: 'Invalid JSON format.' }))
      return false
    }
  }

  /**
   * Purpose: Executes handleSave functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleSave = async () => {
    let valid = true
    for (const tab of MENU_TABS) {
      if (!validateJson(tab.key, form[tab.key] ?? '')) {
        valid = false
      }
    }
    if (!valid) return

    await saveMutation.mutateAsync(
      CONFIG_KEYS.map((key) => ({ key, value: form[key] ?? '' }))
    )
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <LottieLoader size={80} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('Menu Management')}</h1>
        <p className="mt-2 text-sm text-gray-600">
          {t('Configure navigation menus for the dashboard, website header, and footer.')}
        </p>
      </div>

      {saveMutation.error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
          {t('Failed to save settings. Please try again.')}
        </div>
      )}
      {saved && (
        <div className="mb-6 rounded-md bg-green-50 p-4 text-sm text-green-700">
          {t('Settings saved successfully.')}
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              {MENU_TABS.map((tab) => (
                <TabsTrigger key={tab.key} value={tab.key}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {MENU_TABS.map((tab) => (
              <TabsContent key={tab.key} value={tab.key}>
                <div className="mt-4 space-y-3">
                  <Label>{tab.label} Items (JSON)</Label>
                  <Textarea
                    rows={12}
                    className="font-mono text-sm"
                    value={form[tab.key] ?? ''}
                    onChange={(e) => set(tab.key, e.target.value)}
                    placeholder={PLACEHOLDER_JSON}
                  />
                  {errors[tab.key] && (
                    <p className="text-sm text-red-600">{errors[tab.key]}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Define menu items as a JSON array. Each item should have{' '}
                    <code className="rounded bg-gray-100 px-1 py-0.5">label</code>,{' '}
                    <code className="rounded bg-gray-100 px-1 py-0.5">url</code>, and
                    optional{' '}
                    <code className="rounded bg-gray-100 px-1 py-0.5">target</code>{' '}
                    ({'"_blank"'} or {'"_self"'}).
                  </p>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="rounded-md bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-105 disabled:opacity-50 transition-all"
        >
          {saveMutation.isPending ? t('Saving...') : t('Save Settings')}
        </button>
      </div>
    </div>
  )
}
