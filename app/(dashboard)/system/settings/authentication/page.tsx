'use client'

import { useEffect, useState } from 'react'
import { useSystemConfigs } from '@/lib/hooks/queries/useSystemConfigs'
import { useSaveSystemConfigs } from '@/lib/hooks/mutations/useSystemConfigMutations'

const CONFIG_KEYS = [
  'app.email_verification_after_sign_up',
  'app.after_logout_action',
  'app.new_user_registration',
  'app.mobile_number_field',
  'app.passwordless_checkout',
  'app.authentication_type',
  'app.firebase_config_object',
  'app.firebase_service_account_credentials',
]

export default function AuthenticationSettingsPage() {
  const { data: configs, isLoading } = useSystemConfigs(CONFIG_KEYS)
  const { mutateAsync: save, isPending: isSaving, error } = useSaveSystemConfigs(CONFIG_KEYS)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (configs) {
      setFormData({
        ...configs,
        'app.after_logout_action': configs['app.after_logout_action'] || 'redirect_to_login',
        'app.authentication_type': configs['app.authentication_type'] || 'default',
      })
    }
  }, [configs])

  const update = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const toggleBool = (key: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key] === '1' || prev[key] === 'true' ? '0' : '1',
    }))
  }

  const isTruthy = (key: string) => formData[key] === '1' || formData[key] === 'true'

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    await save(Object.entries(formData).map(([key, value]) => ({ key, value })))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const isFirebase = formData['app.authentication_type'] === 'firebase'

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
        <h1 className="text-3xl font-bold text-gray-900">Authentication Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Configure user authentication, registration, and login behaviour.
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
          <h2 className="mb-4 text-lg font-semibold text-gray-900">General</h2>
          <div className="space-y-4">
            {([
              { key: 'app.email_verification_after_sign_up', label: 'Email Verification After Sign Up' },
              { key: 'app.new_user_registration', label: 'New User Registration Enabled' },
              { key: 'app.passwordless_checkout', label: 'Passwordless Checkout' },
              { key: 'app.mobile_number_field', label: 'Mobile Number Field' },
            ] as const).map(({ key, label }) => (
              <label key={key} className="flex cursor-pointer items-center justify-between rounded-md border border-gray-200 px-4 py-3 transition-colors hover:bg-gray-50">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isTruthy(key)}
                  onClick={() => toggleBool(key)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    isTruthy(key) ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
                      isTruthy(key) ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Behaviour</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">After Logout Action</label>
              <select
                value={formData['app.after_logout_action'] || 'redirect_to_login'}
                onChange={(e) => update('app.after_logout_action', e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="redirect_to_login">Redirect to Login</option>
                <option value="redirect_to_homepage">Redirect to Homepage</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Authentication Type</label>
              <select
                value={formData['app.authentication_type'] || 'default'}
                onChange={(e) => update('app.authentication_type', e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="default">Default</option>
                <option value="firebase">Firebase</option>
              </select>
            </div>
          </div>
        </section>

        {isFirebase && (
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Firebase Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Firebase Config Object (JSON)
                </label>
                <textarea
                  rows={6}
                  value={formData['app.firebase_config_object'] || ''}
                  onChange={(e) => update('app.firebase_config_object', e.target.value)}
                  placeholder={'{\n  "apiKey": "...",\n  "authDomain": "...",\n  "projectId": "..."\n}'}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-xs shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Service Account Credentials (JSON)
                </label>
                <textarea
                  rows={6}
                  value={formData['app.firebase_service_account_credentials'] || ''}
                  onChange={(e) => update('app.firebase_service_account_credentials', e.target.value)}
                  placeholder={'{\n  "type": "service_account",\n  "project_id": "..."\n}'}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-xs shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>
        )}

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
    </div>
  )
}
