'use client'

import { useEffect, useState } from 'react'
import { useSystemConfigs } from '@/lib/hooks/queries/useSystemConfigs'
import { useSaveSystemConfigs } from '@/lib/hooks/mutations/useSystemConfigMutations'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  'dashboard.top_banner_option',
  'dashboard.top_banner_image',
  'dashboard.top_banner_video',
  'dashboard.top_banner_title',
  'dashboard.top_banner_subtitle',
  'dashboard.top_banner_text_color',
  'dashboard.top_banner_height',
  'dashboard.qrcode_list_mode',
  'dashboard.welcome_popup_enabled',
  'dashboard.welcome_popup_modal_video',
  'dashboard.welcome_popup_modal_text',
  'dashboard.welcome_popup_show_times',
  'dashboard.sidebar_account_widget_style',
]

export default function DashboardAreaSettingsPage() {
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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Area Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Configure the dashboard layout, banners, and welcome popup.
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
        {/* Top Banner Section */}
        <Card>
          <CardHeader>
            <CardTitle>Top Banner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Banner Option</Label>
              <Select
                value={form['dashboard.top_banner_option'] ?? 'none'}
                onValueChange={(v) => set('dashboard.top_banner_option', v)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>Image URL</Label>
                <Input
                  className="mt-1"
                  value={form['dashboard.top_banner_image'] ?? ''}
                  onChange={(e) => set('dashboard.top_banner_image', e.target.value)}
                  placeholder="https://example.com/banner.jpg"
                />
              </div>
              <div>
                <Label>Video URL</Label>
                <Input
                  className="mt-1"
                  value={form['dashboard.top_banner_video'] ?? ''}
                  onChange={(e) => set('dashboard.top_banner_video', e.target.value)}
                  placeholder="https://example.com/video.mp4"
                />
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  className="mt-1"
                  value={form['dashboard.top_banner_title'] ?? ''}
                  onChange={(e) => set('dashboard.top_banner_title', e.target.value)}
                />
              </div>
              <div>
                <Label>Subtitle</Label>
                <Input
                  className="mt-1"
                  value={form['dashboard.top_banner_subtitle'] ?? ''}
                  onChange={(e) => set('dashboard.top_banner_subtitle', e.target.value)}
                />
              </div>
              <div>
                <Label>Text Color</Label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={form['dashboard.top_banner_text_color'] || '#ffffff'}
                    onChange={(e) => set('dashboard.top_banner_text_color', e.target.value)}
                    className="h-10 w-14 cursor-pointer rounded border border-gray-300"
                  />
                  <Input
                    value={form['dashboard.top_banner_text_color'] ?? ''}
                    onChange={(e) => set('dashboard.top_banner_text_color', e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <Label>Height (px)</Label>
                <Input
                  type="number"
                  className="mt-1"
                  value={form['dashboard.top_banner_height'] ?? ''}
                  onChange={(e) => set('dashboard.top_banner_height', e.target.value)}
                  placeholder="300"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code List */}
        <Card>
          <CardHeader>
            <CardTitle>QR Code List</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label>Display Mode</Label>
              <Select
                value={form['dashboard.qrcode_list_mode'] ?? 'grid'}
                onValueChange={(v) => set('dashboard.qrcode_list_mode', v)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="list">List</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Welcome Popup */}
        <Card>
          <CardHeader>
            <CardTitle>Welcome Popup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Enabled</Label>
              <Switch
                checked={form['dashboard.welcome_popup_enabled'] === 'true'}
                onCheckedChange={(v) =>
                  set('dashboard.welcome_popup_enabled', v ? 'true' : 'false')
                }
              />
            </div>
            <div>
              <Label>Video URL</Label>
              <Input
                className="mt-1"
                value={form['dashboard.welcome_popup_modal_video'] ?? ''}
                onChange={(e) =>
                  set('dashboard.welcome_popup_modal_video', e.target.value)
                }
                placeholder="https://example.com/welcome.mp4"
              />
            </div>
            <div>
              <Label>Text</Label>
              <Textarea
                className="mt-1"
                rows={4}
                value={form['dashboard.welcome_popup_modal_text'] ?? ''}
                onChange={(e) =>
                  set('dashboard.welcome_popup_modal_text', e.target.value)
                }
                placeholder="Welcome message..."
              />
            </div>
            <div>
              <Label>Show Times</Label>
              <Input
                type="number"
                className="mt-1"
                value={form['dashboard.welcome_popup_show_times'] ?? ''}
                onChange={(e) =>
                  set('dashboard.welcome_popup_show_times', e.target.value)
                }
                placeholder="3"
              />
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle>Sidebar</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label>Account Widget Style</Label>
              <Select
                value={form['dashboard.sidebar_account_widget_style'] ?? 'compact'}
                onValueChange={(v) =>
                  set('dashboard.sidebar_account_widget_style', v)
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? 'Saving…' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}
