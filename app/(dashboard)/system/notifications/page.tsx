'use client'

import { useState } from 'react'

interface NotificationEvent {
  key: string
  label: string
  description: string
}

const notificationEvents: NotificationEvent[] = [
  { key: 'newUser', label: 'New User Registration', description: 'When a new user signs up' },
  { key: 'newPayment', label: 'New Payment', description: 'When a payment is received' },
  { key: 'newContact', label: 'New Contact Form', description: 'When a contact form is submitted' },
  { key: 'failedPayment', label: 'Failed Payment', description: 'When a payment attempt fails' },
  { key: 'subscriptionExpiring', label: 'Subscription Expiring', description: 'When a subscription is about to expire' },
  { key: 'systemAlert', label: 'System Alert', description: 'Critical system notifications' },
  { key: 'qrScanMilestone', label: 'QR Scan Milestone', description: 'When a QR code reaches a scan milestone' },
]

export default function SystemNotificationsPage() {
  const [saved, setSaved] = useState(false)
  const [email, setEmail] = useState({
    smtpHost: 'smtp.mailgun.org',
    smtpPort: '587',
    smtpUsername: 'postmaster@mg.karsaaz.com',
    smtpPassword: '',
    fromAddress: 'noreply@karsaaz.com',
    fromName: 'Karsaaz QR',
  })
  const [events, setEvents] = useState<Record<string, boolean>>({
    newUser: true,
    newPayment: true,
    newContact: true,
    failedPayment: true,
    subscriptionExpiring: true,
    systemAlert: true,
    qrScanMilestone: false,
  })

  const handleEmailChange = (field: string, value: string) => {
    setEmail((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const toggleEvent = (key: string) => {
    setEvents((prev) => ({ ...prev, [key]: !prev[key] }))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notification Settings</h1>
        <p className="mt-2 text-sm text-gray-600">Configure email and push notification settings</p>
      </div>

      <div className="mt-8 space-y-6">
        {/* Email Configuration */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Email Configuration</h2>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">SMTP Host</label>
                <input
                  type="text"
                  value={email.smtpHost}
                  onChange={(e) => handleEmailChange('smtpHost', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Port</label>
                <input
                  type="text"
                  value={email.smtpPort}
                  onChange={(e) => handleEmailChange('smtpPort', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  value={email.smtpUsername}
                  onChange={(e) => handleEmailChange('smtpUsername', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={email.smtpPassword}
                  onChange={(e) => handleEmailChange('smtpPassword', e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">From Address</label>
                <input
                  type="email"
                  value={email.fromAddress}
                  onChange={(e) => handleEmailChange('fromAddress', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">From Name</label>
                <input
                  type="text"
                  value={email.fromName}
                  onChange={(e) => handleEmailChange('fromName', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Events */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Notification Events</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {notificationEvents.map((event) => (
              <div key={event.key} className="flex items-center justify-between px-4 py-4 sm:px-6">
                <div>
                  <p className="text-sm font-medium text-gray-900">{event.label}</p>
                  <p className="text-sm text-gray-500">{event.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleEvent(event.key)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${events[event.key] ? 'bg-indigo-600' : 'bg-gray-200'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${events[event.key] ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        {saved && (
          <span className="text-sm font-medium text-green-600">Settings saved successfully!</span>
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
