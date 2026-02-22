'use client'

import React from 'react'
import { TimezoneSelect } from '@/components/ui/timezone-select'

interface AppDetailsConfig {
  appName: string
  appUrl: string
  description: string
  timezone: string
  defaultLanguage: string
}

interface AppDetailsStepProps {
  config: AppDetailsConfig
  onChange: (config: AppDetailsConfig) => void
}

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'ar', label: 'Arabic' },
  { value: 'ur', label: 'Urdu' },
  { value: 'hi', label: 'Hindi' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'pt', label: 'Portuguese' },
]

export function AppDetailsStep({ config, onChange }: AppDetailsStepProps) {
  const update = (field: keyof AppDetailsConfig, value: string) => {
    onChange({ ...config, [field]: value })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">App Name</label>
        <input
          type="text"
          value={config.appName}
          onChange={(e) => update('appName', e.target.value)}
          placeholder="Karsaaz QR"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">App URL</label>
        <input
          type="url"
          value={config.appUrl}
          onChange={(e) => update('appUrl', e.target.value)}
          placeholder="https://example.com"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={config.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="A brief description of your application"
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Timezone</label>
        <TimezoneSelect
          value={config.timezone}
          onChange={(value) => update('timezone', value)}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Default Language</label>
        <select
          value={config.defaultLanguage}
          onChange={(e) => update('defaultLanguage', e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>{lang.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
