'use client'

import { useState } from 'react'

interface AuthOption {
  key: string
  label: string
  description: string
}

const authOptions: AuthOption[] = [
  { key: 'emailVerification', label: 'Email Verification Required', description: 'Users must verify their email address after registration' },
  { key: 'twoFactor', label: 'Two-Factor Authentication Available', description: 'Allow users to enable 2FA for their accounts' },
  { key: 'socialLogin', label: 'Social Login Enabled', description: 'Allow users to sign in with Google, GitHub, and other providers' },
  { key: 'registrationOpen', label: 'Registration Open', description: 'Allow new users to create accounts' },
  { key: 'adminApproval', label: 'Admin Approval Required', description: 'New accounts require admin approval before activation' },
  { key: 'passwordReset', label: 'Password Reset Via Email', description: 'Allow users to reset their password through email' },
  { key: 'magicLink', label: 'Magic Link Login', description: 'Allow passwordless login via email magic links' },
]

export default function AuthWorkflowPage() {
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState<Record<string, boolean>>({
    emailVerification: true,
    twoFactor: true,
    socialLogin: true,
    registrationOpen: true,
    adminApproval: false,
    passwordReset: true,
    magicLink: false,
  })

  const toggle = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Auth Workflow</h1>
        <p className="mt-2 text-sm text-gray-600">Configure authentication and registration settings</p>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg bg-white shadow">
        <div className="divide-y divide-gray-200">
          {authOptions.map((option) => (
            <div key={option.key} className="flex items-center justify-between px-4 py-5 sm:px-6">
              <div>
                <p className="text-sm font-medium text-gray-900">{option.label}</p>
                <p className="mt-1 text-sm text-gray-500">{option.description}</p>
              </div>
              <button
                type="button"
                onClick={() => toggle(option.key)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings[option.key] ? 'bg-indigo-600' : 'bg-gray-200'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings[option.key] ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        {saved && (
          <span className="text-sm font-medium text-green-600">Auth settings saved successfully!</span>
        )}
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save Settings
        </button>
      </div>
    </div>
  )
}
