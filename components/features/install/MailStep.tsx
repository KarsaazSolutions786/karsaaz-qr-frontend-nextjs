'use client'

import React, { useState } from 'react'
import {
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

interface MailConfig {
  host: string
  port: string
  username: string
  password: string
  encryption: 'tls' | 'ssl' | 'none'
  fromAddress: string
  fromName: string
}

interface MailStepProps {
  config: MailConfig
  onChange: (config: MailConfig) => void
  onTestEmail?: (
    config: MailConfig,
    testEmail: string
  ) => Promise<{ success: boolean; message: string }>
  onSkip?: () => void
  showSkipOption?: boolean
}

export function MailStep({
  config,
  onChange,
  onTestEmail,
  onSkip,
  showSkipOption = true,
}: MailStepProps) {
  const [testEmail, setTestEmail] = useState('')
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [showSkipConfirm, setShowSkipConfirm] = useState(false)

  const update = (field: keyof MailConfig, value: string) => {
    onChange({ ...config, [field]: value })
    // Clear test result when config changes
    if (testResult) setTestResult(null)
  }

  const handleTestEmail = async () => {
    if (!testEmail || !onTestEmail) return

    setIsTesting(true)
    setTestResult(null)

    try {
      const result = await onTestEmail(config, testEmail)
      setTestResult(result)
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send test email',
      })
    } finally {
      setIsTesting(false)
    }
  }

  const isConfigValid = config.host && config.port && config.fromAddress

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">SMTP Host</label>
          <input
            type="text"
            value={config.host}
            onChange={e => update('host', e.target.value)}
            placeholder="smtp.example.com"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Port</label>
          <input
            type="text"
            value={config.port}
            onChange={e => update('port', e.target.value)}
            placeholder="587"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={config.username}
            onChange={e => update('username', e.target.value)}
            placeholder="user@example.com"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={config.password}
            onChange={e => update('password', e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Encryption</label>
        <select
          value={config.encryption}
          onChange={e => update('encryption', e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="tls">TLS</option>
          <option value="ssl">SSL</option>
          <option value="none">None</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">From Address</label>
          <input
            type="email"
            value={config.fromAddress}
            onChange={e => update('fromAddress', e.target.value)}
            placeholder="noreply@example.com"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">From Name</label>
          <input
            type="text"
            value={config.fromName}
            onChange={e => update('fromName', e.target.value)}
            placeholder="Karsaaz QR"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Test Email Section */}
      <div className="mt-6 border-t pt-6">
        <h4 className="mb-3 text-sm font-medium text-gray-900">Test Email Configuration</h4>
        <p className="mb-4 text-sm text-gray-500">
          Send a test email to verify your SMTP settings are correct.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <input
              type="email"
              value={testEmail}
              onChange={e => setTestEmail(e.target.value)}
              placeholder="Enter email address to test"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={handleTestEmail}
            disabled={!testEmail || !isConfigValid || isTesting || !onTestEmail}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isTesting ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending...
              </>
            ) : (
              <>
                <EnvelopeIcon className="h-4 w-4" />
                Send Test Email
              </>
            )}
          </button>
        </div>

        {/* Test Result */}
        {testResult && (
          <div
            className={`mt-4 flex items-start gap-3 rounded-md p-3 ${
              testResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {testResult.success ? (
              <CheckCircleIcon className="h-5 w-5 flex-shrink-0 text-green-500" />
            ) : (
              <XCircleIcon className="h-5 w-5 flex-shrink-0 text-red-500" />
            )}
            <div className="text-sm">
              <p className="font-medium">
                {testResult.success ? 'Test email sent successfully!' : 'Failed to send test email'}
              </p>
              <p className="mt-1 opacity-80">{testResult.message}</p>
            </div>
          </div>
        )}

        {!onTestEmail && (
          <p className="mt-3 text-xs text-gray-400">
            Test email functionality will be available after the installation is complete.
          </p>
        )}
      </div>

      {/* Skip Mail Configuration */}
      {showSkipOption && onSkip && (
        <div className="mt-6 border-t pt-6 text-center">
          <button
            type="button"
            onClick={() => setShowSkipConfirm(true)}
            className="text-sm text-gray-500 underline hover:text-gray-700 transition-colors"
          >
            Skip Mail Configuration
          </button>
        </div>
      )}

      {/* Skip Confirmation Dialog */}
      {showSkipConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSkipConfirm(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Skip Mail Configuration?</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Are you sure you want to skip mail configuration? Password reset emails and
                    other notifications won&apos;t work until you configure SMTP settings.
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    You can change SMTP configurations later from{' '}
                    <strong>Settings → Email Settings</strong>.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSkipConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSkipConfirm(false)
                    onSkip?.()
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700"
                >
                  Skip Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
