'use client'

import { useState } from 'react'

interface StorageProvider {
  id: string
  name: string
  description: string
  active: boolean
  icon: string
  fields: { label: string; placeholder: string; type?: string }[]
}

const initialProviders: StorageProvider[] = [
  {
    id: 'local',
    name: 'Local Storage',
    description: 'Store files on the local server filesystem. Suitable for single-server setups.',
    active: true,
    icon: '💾',
    fields: [{ label: 'Storage Path', placeholder: '/var/www/storage' }],
  },
  {
    id: 's3',
    name: 'Amazon S3',
    description: 'Use AWS S3 buckets for scalable, durable cloud storage.',
    active: false,
    icon: '☁️',
    fields: [
      { label: 'Access Key', placeholder: 'AKIA...' },
      { label: 'Secret Key', placeholder: '••••••••', type: 'password' },
      { label: 'Bucket Name', placeholder: 'my-bucket' },
      { label: 'Region', placeholder: 'us-east-1' },
    ],
  },
  {
    id: 'gcs',
    name: 'Google Cloud Storage',
    description: 'Store files using Google Cloud Storage buckets.',
    active: false,
    icon: '🔵',
    fields: [
      { label: 'Project ID', placeholder: 'my-project-123' },
      { label: 'Bucket Name', placeholder: 'my-gcs-bucket' },
      { label: 'Service Account Key (JSON)', placeholder: 'Paste key JSON...' },
    ],
  },
  {
    id: 'do_spaces',
    name: 'DigitalOcean Spaces',
    description: 'S3-compatible object storage from DigitalOcean.',
    active: false,
    icon: '🌊',
    fields: [
      { label: 'Access Key', placeholder: 'DO...' },
      { label: 'Secret Key', placeholder: '••••••••', type: 'password' },
      { label: 'Space Name', placeholder: 'my-space' },
      { label: 'Region', placeholder: 'nyc3' },
    ],
  },
]

export default function CloudStoragePage() {
  const [providers, setProviders] = useState<StorageProvider[]>(initialProviders)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const setActive = (id: string) => {
    setProviders((prev) =>
      prev.map((p) => ({ ...p, active: p.id === id }))
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Cloud Storage</h1>
        <p className="mt-2 text-sm text-gray-600">Configure file storage providers</p>
      </div>

      <div className="mt-8 space-y-4">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className={`overflow-hidden rounded-lg border bg-white shadow-sm ${
              provider.active ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center space-x-4">
                <span className="text-2xl">{provider.icon}</span>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{provider.name}</h3>
                  <p className="text-sm text-gray-500">{provider.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {provider.active ? (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Active
                  </span>
                ) : (
                  <button
                    onClick={() => setActive(provider.id)}
                    className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Activate
                  </button>
                )}
                <button
                  onClick={() => setExpandedId(expandedId === provider.id ? null : provider.id)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  {expandedId === provider.id ? 'Hide Settings' : 'Settings'}
                </button>
              </div>
            </div>

            {expandedId === provider.id && (
              <div className="border-t border-gray-200 bg-gray-50 p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {provider.fields.map((field) => (
                    <div key={field.label}>
                      <label className="block text-sm font-medium text-gray-700">
                        {field.label}
                      </label>
                      <input
                        type={field.type || 'text'}
                        placeholder={field.placeholder}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Save Configuration
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
