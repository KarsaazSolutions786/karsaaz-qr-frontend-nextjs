'use client'

import { useState, useCallback } from 'react'
import { notificationPrefsAPI, type NotificationPreferences } from '@/lib/api/endpoints/account'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'

interface NotificationsTabProps {
  userId: number | string
}

const PREF_LABELS: { key: keyof NotificationPreferences; label: string; description: string }[] = [
  { key: 'email_notifications', label: 'Email Notifications', description: 'Receive important account emails' },
  { key: 'marketing_emails', label: 'Marketing Emails', description: 'Product announcements and offers' },
  { key: 'security_alerts', label: 'Security Alerts', description: 'Login attempts and security events' },
  { key: 'product_updates', label: 'Product Updates', description: 'New features and improvements' },
  { key: 'weekly_digest', label: 'Weekly Digest', description: 'Weekly summary of your QR code analytics' },
]

export function NotificationsTab({ userId }: NotificationsTabProps) {
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [fetched, setFetched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const fetchPrefs = useCallback(async () => {
    try {
      setLoading(true)
      const res = await notificationPrefsAPI.get(userId)
      setPrefs(res)
      setFetched(true)
    } catch {
      // Default prefs if endpoint not available yet
      setPrefs({
        email_notifications: true,
        marketing_emails: false,
        security_alerts: true,
        product_updates: true,
        weekly_digest: false,
      })
      setFetched(true)
    } finally {
      setLoading(false)
    }
  }, [userId])

  if (!fetched && !loading) {
    fetchPrefs()
  }

  const handleToggle = (key: keyof NotificationPreferences) => {
    if (!prefs) return
    setPrefs({ ...prefs, [key]: !prefs[key] })
    setSuccess(null)
  }

  const handleSave = async () => {
    if (!prefs) return
    try {
      setSaving(true)
      setError(null)
      await notificationPrefsAPI.update(userId, prefs)
      setSuccess('Notification preferences saved.')
    } catch {
      setError('Failed to save preferences')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Notification Preferences</h2>
        <p className="text-sm text-gray-500 mb-6">Choose what notifications you&apos;d like to receive.</p>

        {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {success && <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">{success}</div>}

        {loading ? (
          <p className="text-sm text-gray-500">Loading preferences...</p>
        ) : prefs ? (
          <div className="space-y-4">
            {PREF_LABELS.map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between rounded-md border border-gray-100 p-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500">{description}</p>
                </div>
                <Switch
                  checked={prefs[key]}
                  onCheckedChange={() => handleToggle(key)}
                />
              </div>
            ))}
            <div className="pt-4">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
