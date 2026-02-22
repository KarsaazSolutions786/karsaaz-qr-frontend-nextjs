'use client'

import { useEffect, useState } from 'react'
import { useSystemConfigs } from '@/lib/hooks/queries/useSystemConfigs'
import { useSaveSystemConfigs } from '@/lib/hooks/mutations/useSystemConfigMutations'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

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

export default function MenuManagementPage() {
  const { data: configs, isLoading } = useSystemConfigs(CONFIG_KEYS)
  const saveMutation = useSaveSystemConfigs(CONFIG_KEYS)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState<string>(MENU_TABS[0].key)

  useEffect(() => {
    if (configs) setForm({ ...configs })
  }, [configs])

  const set = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
        <p className="mt-2 text-sm text-gray-600">
          Configure navigation menus for the dashboard, website header, and footer.
        </p>
      </div>

      {saveMutation.error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
          Failed to save settings. Please try again.
        </div>
      )}
      {saved && (
        <div className="mb-6 rounded-md bg-green-50 p-4 text-sm text-green-700">
          Settings saved successfully.
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
        <Button onClick={handleSave} disabled={saveMutation.isPending}>
          {saveMutation.isPending ? 'Saving…' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}
