'use client'

import React from 'react'

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
}

export function MailStep({ config, onChange }: MailStepProps) {
  const update = (field: keyof MailConfig, value: string) => {
    onChange({ ...config, [field]: value })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">SMTP Host</label>
          <input
            type="text"
            value={config.host}
            onChange={(e) => update('host', e.target.value)}
            placeholder="smtp.example.com"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Port</label>
          <input
            type="text"
            value={config.port}
            onChange={(e) => update('port', e.target.value)}
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
            onChange={(e) => update('username', e.target.value)}
            placeholder="user@example.com"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={config.password}
            onChange={(e) => update('password', e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Encryption</label>
        <select
          value={config.encryption}
          onChange={(e) => update('encryption', e.target.value)}
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
            onChange={(e) => update('fromAddress', e.target.value)}
            placeholder="noreply@example.com"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">From Name</label>
          <input
            type="text"
            value={config.fromName}
            onChange={(e) => update('fromName', e.target.value)}
            placeholder="Karsaaz QR"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
}
