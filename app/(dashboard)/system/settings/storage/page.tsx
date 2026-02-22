'use client'

import { useEffect, useState } from 'react'
import { useSystemConfigs } from '@/lib/hooks/queries/useSystemConfigs'
import { useSaveSystemConfigs } from '@/lib/hooks/mutations/useSystemConfigMutations'

const CONFIG_KEYS = [
  'app.storage_type',
  'filesystems.s3.key',
  'filesystems.s3.secret',
  'filesystems.s3.region',
  'filesystems.s3.bucket',
  'filesystems.s3.url',
  'filesystems.s3.endpoint',
]

export default function StorageSettingsPage() {
  const { data: configs, isLoading } = useSystemConfigs(CONFIG_KEYS)
  const { mutateAsync: save, isPending: isSaving, error } = useSaveSystemConfigs(CONFIG_KEYS)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (configs) {
      setFormData({
        ...configs,
        'app.storage_type': configs['app.storage_type'] || 'local',
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

  const isS3 = formData['app.storage_type'] === 's3'

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
        <h1 className="text-3xl font-bold text-gray-900">File Storage</h1>
        <p className="mt-2 text-sm text-gray-600">
          Configure where uploaded files are stored.
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
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Storage Driver</h2>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Storage Type</label>
            <select
              value={formData['app.storage_type'] || 'local'}
              onChange={(e) => update('app.storage_type', e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="local">Local</option>
              <option value="s3">Amazon S3 / S3-Compatible</option>
            </select>
          </div>
        </section>

        {isS3 && (
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">S3 Configuration</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Access Key</label>
                <input
                  type="text"
                  value={formData['filesystems.s3.key'] || ''}
                  onChange={(e) => update('filesystems.s3.key', e.target.value)}
                  placeholder="AKIA..."
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Secret Key</label>
                <input
                  type="password"
                  value={formData['filesystems.s3.secret'] || ''}
                  onChange={(e) => update('filesystems.s3.secret', e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Region</label>
                <input
                  type="text"
                  value={formData['filesystems.s3.region'] || ''}
                  onChange={(e) => update('filesystems.s3.region', e.target.value)}
                  placeholder="us-east-1"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Bucket</label>
                <input
                  type="text"
                  value={formData['filesystems.s3.bucket'] || ''}
                  onChange={(e) => update('filesystems.s3.bucket', e.target.value)}
                  placeholder="my-bucket"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">URL</label>
                <input
                  type="text"
                  value={formData['filesystems.s3.url'] || ''}
                  onChange={(e) => update('filesystems.s3.url', e.target.value)}
                  placeholder="https://s3.amazonaws.com"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Endpoint</label>
                <input
                  type="text"
                  value={formData['filesystems.s3.endpoint'] || ''}
                  onChange={(e) => update('filesystems.s3.endpoint', e.target.value)}
                  placeholder="https://s3.amazonaws.com"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
