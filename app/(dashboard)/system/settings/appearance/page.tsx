'use client'

import { useEffect, useState } from 'react'
import { useSystemConfigs } from '@/lib/hooks/queries/useSystemConfigs'
import { useSaveSystemConfigs } from '@/lib/hooks/mutations/useSystemConfigMutations'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

const CONFIG_KEYS = [
  'theme.primary_0',
  'theme.primary_1',
  'theme.accent_0',
  'theme.accent_1',
  'theme.dashboard_sidebar_gradient_start',
  'theme.dashboard_sidebar_gradient_end',
  'theme.dynamic_ribbon_color',
  'theme.checkout_page_gradient_start',
  'theme.checkout_page_gradient_end',
  'account_page.background_image',
  'account_page.gradient',
  'account_page.image_round_corner',
  'account_page.image_position',
  'appearance.website_banner',
  'appearance.stats_image',
]

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-14 cursor-pointer rounded border border-gray-300 p-1"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1"
        />
      </div>
    </div>
  )
}

export default function AppearanceSettingsPage() {
  const { data: configs, isLoading } = useSystemConfigs(CONFIG_KEYS)
  const saveMutation = useSaveSystemConfigs(CONFIG_KEYS)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState<Record<string, string>>({})

  useEffect(() => {
    if (configs) setForm({ ...configs })
  }, [configs])

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSave = async () => {
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
        <h1 className="text-3xl font-bold text-gray-900">Appearance Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Customize brand colors, gradients, and visual elements.
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

      <div className="space-y-6">
        {/* Brand Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Brand Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ColorField
                label="Primary Color 0"
                value={form['theme.primary_0'] ?? ''}
                onChange={(v) => set('theme.primary_0', v)}
              />
              <ColorField
                label="Primary Color 1"
                value={form['theme.primary_1'] ?? ''}
                onChange={(v) => set('theme.primary_1', v)}
              />
              <ColorField
                label="Accent Color 0"
                value={form['theme.accent_0'] ?? ''}
                onChange={(v) => set('theme.accent_0', v)}
              />
              <ColorField
                label="Accent Color 1"
                value={form['theme.accent_1'] ?? ''}
                onChange={(v) => set('theme.accent_1', v)}
              />
              <ColorField
                label="Dynamic Ribbon Color"
                value={form['theme.dynamic_ribbon_color'] ?? ''}
                onChange={(v) => set('theme.dynamic_ribbon_color', v)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Sidebar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ColorField
                label="Gradient Start"
                value={form['theme.dashboard_sidebar_gradient_start'] ?? ''}
                onChange={(v) => set('theme.dashboard_sidebar_gradient_start', v)}
              />
              <ColorField
                label="Gradient End"
                value={form['theme.dashboard_sidebar_gradient_end'] ?? ''}
                onChange={(v) => set('theme.dashboard_sidebar_gradient_end', v)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Checkout Page */}
        <Card>
          <CardHeader>
            <CardTitle>Checkout Page</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ColorField
                label="Gradient Start"
                value={form['theme.checkout_page_gradient_start'] ?? ''}
                onChange={(v) => set('theme.checkout_page_gradient_start', v)}
              />
              <ColorField
                label="Gradient End"
                value={form['theme.checkout_page_gradient_end'] ?? ''}
                onChange={(v) => set('theme.checkout_page_gradient_end', v)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Page */}
        <Card>
          <CardHeader>
            <CardTitle>Account Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Background Image URL</Label>
              <Input
                className="mt-1"
                value={form['account_page.background_image'] ?? ''}
                onChange={(e) => set('account_page.background_image', e.target.value)}
                placeholder="https://example.com/bg.jpg"
              />
            </div>
            <div>
              <Label>Gradient</Label>
              <Input
                className="mt-1"
                value={form['account_page.gradient'] ?? ''}
                onChange={(e) => set('account_page.gradient', e.target.value)}
                placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Image Round Corner</Label>
              <Switch
                checked={form['account_page.image_round_corner'] === 'true'}
                onCheckedChange={(v) =>
                  set('account_page.image_round_corner', v ? 'true' : 'false')
                }
              />
            </div>
            <div>
              <Label>Image Position</Label>
              <Select
                value={form['account_page.image_position'] ?? 'center'}
                onValueChange={(v) => set('account_page.image_position', v)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Miscellaneous */}
        <Card>
          <CardHeader>
            <CardTitle>Miscellaneous</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Website Banner Image URL</Label>
              <Input
                className="mt-1"
                value={form['appearance.website_banner'] ?? ''}
                onChange={(e) => set('appearance.website_banner', e.target.value)}
                placeholder="https://example.com/banner.jpg"
              />
            </div>
            <div>
              <Label>Stats Image URL</Label>
              <Input
                className="mt-1"
                value={form['appearance.stats_image'] ?? ''}
                onChange={(e) => set('appearance.stats_image', e.target.value)}
                placeholder="https://example.com/stats.png"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} disabled={saveMutation.isPending}>
          {saveMutation.isPending ? 'Saving…' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}
