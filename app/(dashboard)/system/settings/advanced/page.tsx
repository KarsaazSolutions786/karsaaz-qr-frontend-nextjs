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
  'security.password_min_length',
  'security.password_characters',
  'security.account_lock_enabled',
  'security.login_attempts_before_lock',
  'security.minutes_to_reset_attempts',
  'services.google.api_key',
  'google_recaptcha.site_key',
  'google_recaptcha.secret_key',
  'google_recaptcha.enabled',
  'app.allow_iframe_embed',
  'app.paid_subscriptions',
  'billing.mode',
  'cookie_consent_enabled',
  'users_can_delete_qrcodes',
  'reset_scans_every_month',
  'log.max_file_size',
  'customer.short_link_change',
  'bulk_operation.max_rows',
]

export default function AdvancedSettingsPage() {
  const { data: configs, isLoading } = useSystemConfigs(CONFIG_KEYS)
  const saveMutation = useSaveSystemConfigs(CONFIG_KEYS)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState<Record<string, string>>({})

  useEffect(() => {
    if (configs) setForm({ ...configs })
  }, [configs])

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSave= async () => {
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
        <h1 className="text-3xl font-bold text-gray-900">Advanced Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Security, integrations, billing, feature flags, and system limits.
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
        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>Password Min Length</Label>
                <Input
                  type="number"
                  className="mt-1"
                  value={form['security.password_min_length'] ?? ''}
                  onChange={(e) =>
                    set('security.password_min_length', e.target.value)
                  }
                  placeholder="8"
                />
              </div>
              <div>
                <Label>Password Characters</Label>
                <Select
                  value={
                    form['security.password_characters'] ?? 'letters_numbers'
                  }
                  onValueChange={(v) => set('security.password_characters', v)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select rule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="letters_numbers">
                      Letters &amp; Numbers
                    </SelectItem>
                    <SelectItem value="letters_numbers_symbols">
                      Letters, Numbers &amp; Symbols
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Account Lock Enabled</Label>
              <Switch
                checked={form['security.account_lock_enabled'] === 'true'}
                onCheckedChange={(v) =>
                  set('security.account_lock_enabled', v ? 'true' : 'false')
                }
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>Login Attempts Before Lock</Label>
                <Input
                  type="number"
                  className="mt-1"
                  value={form['security.login_attempts_before_lock'] ?? ''}
                  onChange={(e) =>
                    set('security.login_attempts_before_lock', e.target.value)
                  }
                  placeholder="5"
                />
              </div>
              <div>
                <Label>Minutes to Reset Attempts</Label>
                <Input
                  type="number"
                  className="mt-1"
                  value={form['security.minutes_to_reset_attempts'] ?? ''}
                  onChange={(e) =>
                    set('security.minutes_to_reset_attempts', e.target.value)
                  }
                  placeholder="30"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Google Services */}
        <Card>
          <CardHeader>
            <CardTitle>Google Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Google API Key</Label>
              <Input
                type="password"
                className="mt-1"
                value={form['services.google.api_key'] ?? ''}
                onChange={(e) => set('services.google.api_key', e.target.value)}
                placeholder="AIza..."
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>reCAPTCHA Site Key</Label>
                <Input
                  className="mt-1"
                  value={form['google_recaptcha.site_key'] ?? ''}
                  onChange={(e) =>
                    set('google_recaptcha.site_key', e.target.value)
                  }
                />
              </div>
              <div>
                <Label>reCAPTCHA Secret Key</Label>
                <Input
                  type="password"
                  className="mt-1"
                  value={form['google_recaptcha.secret_key'] ?? ''}
                  onChange={(e) =>
                    set('google_recaptcha.secret_key', e.target.value)
                  }
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>reCAPTCHA Enabled</Label>
              <Switch
                checked={form['google_recaptcha.enabled'] === 'true'}
                onCheckedChange={(v) =>
                  set('google_recaptcha.enabled', v ? 'true' : 'false')
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Billing */}
        <Card>
          <CardHeader>
            <CardTitle>Billing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Paid Subscriptions</Label>
              <Switch
                checked={form['app.paid_subscriptions'] === 'true'}
                onCheckedChange={(v) =>
                  set('app.paid_subscriptions', v ? 'true' : 'false')
                }
              />
            </div>
            <div>
              <Label>Billing Mode</Label>
              <Select
                value={form['billing.mode'] ?? 'subscription'}
                onValueChange={(v) => set('billing.mode', v)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subscription">Subscription</SelectItem>
                  <SelectItem value="one_time">One Time</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Allow Iframe Embed</Label>
              <Switch
                checked={form['app.allow_iframe_embed'] === 'true'}
                onCheckedChange={(v) =>
                  set('app.allow_iframe_embed', v ? 'true' : 'false')
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Cookie Consent</Label>
              <Switch
                checked={form['cookie_consent_enabled'] === 'true'}
                onCheckedChange={(v) =>
                  set('cookie_consent_enabled', v ? 'true' : 'false')
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Users Can Delete QR Codes</Label>
              <Switch
                checked={form['users_can_delete_qrcodes'] === 'true'}
                onCheckedChange={(v) =>
                  set('users_can_delete_qrcodes', v ? 'true' : 'false')
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Reset Scans Monthly</Label>
              <Switch
                checked={form['reset_scans_every_month'] === 'true'}
                onCheckedChange={(v) =>
                  set('reset_scans_every_month', v ? 'true' : 'false')
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Customer Short Link Change</Label>
              <Switch
                checked={form['customer.short_link_change'] === 'true'}
                onCheckedChange={(v) =>
                  set('customer.short_link_change', v ? 'true' : 'false')
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Limits */}
        <Card>
          <CardHeader>
            <CardTitle>Limits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>Bulk Operation Max Rows</Label>
                <Input
                  type="number"
                  className="mt-1"
                  value={form['bulk_operation.max_rows'] ?? ''}
                  onChange={(e) =>
                    set('bulk_operation.max_rows', e.target.value)
                  }
                  placeholder="500"
                />
              </div>
              <div>
                <Label>Log Max File Size (MB)</Label>
                <Input
                  type="number"
                  className="mt-1"
                  value={form['log.max_file_size'] ?? ''}
                  onChange={(e) => set('log.max_file_size', e.target.value)}
                  placeholder="50"
                />
              </div>
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
