'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCloudConnection, useCloudStorageMutations } from '@/lib/hooks/queries/useCloudStorage'

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

export default function EditCloudStoragePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState<CloudStorageForm>({
    provider: 'aws_s3',
    name: '',
    access_key: '',
    secret_key: '',
    bucket: '',
    region: '',
  })

  // TanStack Query hooks
  const { data: connectionData, isLoading: queryLoading, error: queryError } = useCloudConnection(id)
  const { updateConnection } = useCloudStorageMutations()

  // Sync fetched data to local state
  useEffect(() => {
    if (connectionData) {
      const config = connectionData as any
      setForm({
        provider: config.provider ?? 'aws_s3',
        name: config.name ?? '',
        access_key: config.access_key ?? '',
        secret_key: config.secret_key ?? '',
        bucket: config.bucket ?? '',
        region: config.region ?? '',
      })
    }
  }, [connectionData])

  const loading = queryLoading
  const saving = updateConnection.isPending
  const error = queryError
    ? 'Failed to load cloud storage configuration.'
    : updateConnection.isError
      ? (updateConnection.error as any)?.response?.data?.message || 'Failed to update configuration.'
      : ''

  const set = <K extends keyof CloudStorageForm>(key: K, value: CloudStorageForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(false)
    try {
      await updateConnection.mutateAsync({ id, data: form })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      // Error handled by mutation state
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Cloud Storage</h1>
          <p className="mt-2 text-sm text-gray-600">Update cloud storage configuration</p>
        </div>
        <Link href="/cloud-storage" className="text-sm text-blue-600 hover:text-blue-900">← Back</Link>
      </div>

      {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      {saved && <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700">Changes saved successfully.</div>}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
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
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
