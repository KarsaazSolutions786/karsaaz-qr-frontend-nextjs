'use client'

import React, { useState } from 'react'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import apiClient from '@/lib/api/client'

interface DatabaseConfig {
  host: string
  port: string
  database: string
  username: string
  password: string
}

interface DatabaseStepProps {
  config: DatabaseConfig
  onChange: (config: DatabaseConfig) => void
}

export function DatabaseStep({ config, onChange }: DatabaseStepProps) {
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [migrateStatus, setMigrateStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const update = (field: keyof DatabaseConfig, value: string) => {
    onChange({ ...config, [field]: value })
  }

  const testConnection = async () => {
    setTestStatus('testing')
    setMessage('')
    try {
      await apiClient.post('/install/test-database', config)
      setTestStatus('success')
      setMessage('Connection successful!')
    } catch {
      setTestStatus('error')
      setMessage('Connection failed. Please check your credentials.')
    }
  }

  const runMigrations = async () => {
    setMigrateStatus('running')
    setMessage('')
    try {
      await apiClient.post('/install/run-migrations', config)
      setMigrateStatus('success')
      setMessage('Migrations completed successfully!')
    } catch {
      setMigrateStatus('error')
      setMessage('Migration failed. Please try again.')
    }
  }

  const fields: { key: keyof DatabaseConfig; label: string; type: string; placeholder: string }[] = [
    { key: 'host', label: 'Database Host', type: 'text', placeholder: 'localhost' },
    { key: 'port', label: 'Port', type: 'text', placeholder: '3306' },
    { key: 'database', label: 'Database Name', type: 'text', placeholder: 'karsaaz_qr' },
    { key: 'username', label: 'Username', type: 'text', placeholder: 'root' },
    { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
  ]

  return (
    <div className="space-y-4">
      {fields.map((f) => (
        <div key={f.key}>
          <label className="mb-1 block text-sm font-medium text-gray-700">{f.label}</label>
          <input
            type={f.type}
            value={config[f.key]}
            onChange={(e) => update(f.key, e.target.value)}
            placeholder={f.placeholder}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      ))}

      {message && (
        <div className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm ${
          testStatus === 'success' || migrateStatus === 'success'
            ? 'bg-green-50 text-green-700'
            : testStatus === 'error' || migrateStatus === 'error'
            ? 'bg-red-50 text-red-700'
            : 'bg-gray-50 text-gray-700'
        }`}>
          {(testStatus === 'success' || migrateStatus === 'success') && <CheckCircle className="h-4 w-4" />}
          {(testStatus === 'error' || migrateStatus === 'error') && <XCircle className="h-4 w-4" />}
          {message}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={testConnection}
          disabled={testStatus === 'testing'}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {testStatus === 'testing' && <Loader2 className="h-4 w-4 animate-spin" />}
          Test Connection
        </button>
        <button
          type="button"
          onClick={runMigrations}
          disabled={migrateStatus === 'running'}
          className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
        >
          {migrateStatus === 'running' && <Loader2 className="h-4 w-4 animate-spin" />}
          Run Migrations
        </button>
      </div>
    </div>
  )
}
