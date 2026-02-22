'use client'

import { useState } from 'react'
import { pluginsAPI, type PluginConfig } from '@/lib/api/endpoints/plugins'
import { toast } from 'sonner'

interface PluginSettingsFormProps {
  configs: PluginConfig[]
  onSaved?: () => void
}

export function PluginSettingsForm({ configs, onSaved }: PluginSettingsFormProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    configs.forEach((c) => {
      initial[c.expandedKey ?? c.key] = c.value ?? ''
    })
    return initial
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await pluginsAPI.saveConfig(values)
      toast.success('Plugin settings saved')
      onSaved?.()
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const renderField = (config: PluginConfig) => {
    const key = config.expandedKey ?? config.key
    const value = values[key] ?? ''

    switch (config.type) {
      case 'textarea':
      case 'code':
        return (
          <textarea
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            placeholder={config.placeholder}
            rows={config.type === 'code' ? 8 : 4}
            className={`block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              config.type === 'code' ? 'font-mono text-xs' : ''
            }`}
          />
        )
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            placeholder={config.placeholder}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        )
      case 'file':
        return (
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleChange(key, file.name)
            }}
            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
          />
        )
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            placeholder={config.placeholder}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        )
    }
  }

  if (configs.length === 0) {
    return (
      <p className="text-sm text-gray-500">This plugin has no configurable settings.</p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {configs.map((config) => (
        <div key={config.key}>
          <label className="block text-sm font-medium text-gray-700">{config.title}</label>
          {config.instructions && (
            <p className="mt-0.5 text-xs text-gray-500">{config.instructions}</p>
          )}
          <div className="mt-1">{renderField(config)}</div>
        </div>
      ))}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  )
}
