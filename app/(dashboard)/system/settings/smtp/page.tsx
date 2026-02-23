'use client'

import { useEffect, useState } from 'react'
import { useSystemConfigs } from '@/lib/hooks/queries/useSystemConfigs'
import { useSaveSystemConfigs } from '@/lib/hooks/mutations/useSystemConfigMutations'
import { systemConfigsAPI } from '@/lib/api/endpoints/system-configs'

const CONFIG_KEYS = [
  'mail.mailers.smtp.host',
  'mail.mailers.smtp.port',
  'mail.mailers.smtp.username',
  'mail.mailers.smtp.password',
  'mail.mailers.smtp.encryption',
  'mail.mailers.smtp.auth_type',
  'mail.mailers.smtp.timeout',
  'mail.from.address',
  'mail.from.name',
]

export default function SmtpSettingsPage() {
  const { data: configs, isLoading } = useSystemConfigs(CONFIG_KEYS)
  const { mutateAsync: save, isPending: isSaving, error } = useSaveSystemConfigs(CONFIG_KEYS)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [testSubject, setTestSubject] = useState('SMTP Test Email')
  const [testMessage, setTestMessage] = useState('This is a test email from Karsaaz QR.')
  const [testResult, setTestResult] = useState<{ success: boolean; debug?: string } | null>(null)
  const [isTesting, setIsTesting] = useState(false)

  useEffect(() => {
    if (configs) {
      setFormData({
        ...configs,
        'mail.mailers.smtp.auth_type': configs['mail.mailers.smtp.auth_type'] || 'login',
        'mail.mailers.smtp.timeout': configs['mail.mailers.smtp.timeout'] || '30',
        'mail.mailers.smtp.encryption': configs['mail.mailers.smtp.encryption'] || 'none',
      })
    }
  }, [configs])

  const update = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    await save(Object.entries(formData).map(([key, value]) => ({ key, value })))
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
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">SMTP / Mail Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Configure your outgoing email server and sender information.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
          Failed to save settings. Please try again.
        </div>
      )}
      {saved && (
        <div className="mb-6 rounded-md bg-green-50 p-4 text-sm text-green-700">
          Settings saved successfully.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">SMTP Server</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">SMTP Host</label>
              <input
                type="text"
                value={formData['mail.mailers.smtp.host'] || ''}
                onChange={(e) => update('mail.mailers.smtp.host', e.target.value)}
                placeholder="smtp.example.com"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Port</label>
              <input
                type="text"
                value={formData['mail.mailers.smtp.port'] || ''}
                onChange={(e) => update('mail.mailers.smtp.port', e.target.value)}
                placeholder="587"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={formData['mail.mailers.smtp.username'] || ''}
                onChange={(e) => update('mail.mailers.smtp.username', e.target.value)}
                placeholder="user@example.com"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={formData['mail.mailers.smtp.password'] || ''}
                onChange={(e) => update('mail.mailers.smtp.password', e.target.value)}
                placeholder="••••••••"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Encryption</label>
              <select
                value={formData['mail.mailers.smtp.encryption'] || 'none'}
                onChange={(e) => update('mail.mailers.smtp.encryption', e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="none">None</option>
                <option value="tls">TLS</option>
                <option value="ssl">SSL</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Auth Type</label>
              <input
                type="text"
                value={formData['mail.mailers.smtp.auth_type'] || 'login'}
                onChange={(e) => update('mail.mailers.smtp.auth_type', e.target.value)}
                placeholder="login"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Timeout (seconds)</label>
              <input
                type="number"
                value={formData['mail.mailers.smtp.timeout'] || '30'}
                onChange={(e) => update('mail.mailers.smtp.timeout', e.target.value)}
                placeholder="30"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Sender Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">From Address</label>
              <input
                type="email"
                value={formData['mail.from.address'] || ''}
                onChange={(e) => update('mail.from.address', e.target.value)}
                placeholder="noreply@example.com"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">From Name</label>
              <input
                type="text"
                value={formData['mail.from.name'] || ''}
                onChange={(e) => update('mail.from.name', e.target.value)}
                placeholder="My App"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </form>

      {/* SMTP Test Section */}
      <section className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Test SMTP Connection</h2>
        <p className="mb-4 text-sm text-gray-600">
          Send a test email to verify your SMTP settings are working correctly.
        </p>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Recipient Email</label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              value={testSubject}
              onChange={(e) => setTestSubject(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Message</label>
            <textarea
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              rows={3}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            type="button"
            disabled={isTesting || !testEmail}
            onClick={async () => {
              setIsTesting(true)
              setTestResult(null)
              try {
                const result = await systemConfigsAPI.testSmtp({
                  email: testEmail,
                  subject: testSubject,
                  message: testMessage,
                })
                setTestResult(result)
              } catch {
                setTestResult({ success: false, debug: 'Failed to send test email. Check your settings and try again.' })
              } finally {
                setIsTesting(false)
              }
            }}
            className="rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 disabled:opacity-50"
          >
            {isTesting ? 'Sending…' : 'Send Test Email'}
          </button>
          {testResult && (
            <div className={`mt-4 rounded-md p-4 text-sm ${testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              <p className="font-medium">{testResult.success ? '✅ Test email sent successfully!' : '❌ Failed to send test email'}</p>
              {testResult.debug && (
                <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded bg-gray-100 p-3 text-xs text-gray-700">
                  {testResult.debug}
                </pre>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
