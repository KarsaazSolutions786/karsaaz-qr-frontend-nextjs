'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import apiClient from '@/lib/api/client'

type CloudProvider = 'aws_s3' | 'google_cloud' | 'azure' | 'digitalocean'

interface CloudStorageForm {
  provider: CloudProvider
  name: string
  access_key: string
  secret_key: string
  bucket: string
  region: string
}

const PROVIDERS: { value: CloudProvider; label: string }[] = [
  { value: 'aws_s3', label: 'Amazon S3' },
  { value: 'google_cloud', label: 'Google Cloud Storage' },
  { value: 'azure', label: 'Azure Blob Storage' },
  { value: 'digitalocean', label: 'DigitalOcean Spaces' },
]

export default function NewCloudStoragePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<CloudStorageForm>({
    provider: 'aws_s3',
    name: '',
    access_key: '',
    secret_key: '',
    bucket: '',
    region: '',
  })

  const set = <K extends keyof CloudStorageForm>(key: K, value: CloudStorageForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await apiClient.post('/cloud-storage/connections', form)
      router.push('/cloud-storage')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create cloud storage configuration.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Cloud Storage</h1>
          <p className="mt-2 text-sm text-gray-600">Configure a new cloud storage provider</p>
        </div>
        <Link href="/cloud-storage" className="text-sm text-blue-600 hover:text-blue-900">← Back</Link>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="My S3 Bucket"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Provider <span className="text-red-500">*</span></label>
          <select
            required
            value={form.provider}
            onChange={(e) => set('provider', e.target.value as CloudProvider)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
          >
            {PROVIDERS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Access Key <span className="text-red-500">*</span></label>
          <input
            type="text"
            required
            value={form.access_key}
            onChange={(e) => set('access_key', e.target.value)}
            placeholder="AKIAIOSFODNN7EXAMPLE"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Secret Key <span className="text-red-500">*</span></label>
          <input
            type="password"
            required
            value={form.secret_key}
            onChange={(e) => set('secret_key', e.target.value)}
            placeholder="••••••••••••••••"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bucket <span className="text-red-500">*</span></label>
          <input
            type="text"
            required
            value={form.bucket}
            onChange={(e) => set('bucket', e.target.value)}
            placeholder="my-app-bucket"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Region <span className="text-red-500">*</span></label>
          <input
            type="text"
            required
            value={form.region}
            onChange={(e) => set('region', e.target.value)}
            placeholder="us-east-1"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
          />
        </div>

        <div className="flex items-center justify-end gap-4 border-t pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  )
}
