'use client'

import { useState } from 'react'
import { Download, Upload, CheckCircle, XCircle, Clock, Calendar, Database, ArrowUpDown } from 'lucide-react'

interface StorageProvider {
  id: string
  name: string
  description: string
  active: boolean
  icon: string
  fields: { label: string; placeholder: string; type?: string }[]
}

interface BackupJob {
  id: string
  date: string
  status: 'success' | 'failed' | 'in-progress'
  provider: string
  filesCount: number
  size: string
  duration: string
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

// Mock backup history data
const initialBackups: BackupJob[] = [
  {
    id: '1',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'success',
    provider: 'Amazon S3',
    filesCount: 1247,
    size: '2.3 GB',
    duration: '5m 23s'
  },
  {
    id: '2',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'success',
    provider: 'Amazon S3',
    filesCount: 1245,
    size: '2.3 GB',
    duration: '4m 58s'
  },
  {
    id: '3',
    date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    status: 'failed',
    provider: 'Amazon S3',
    filesCount: 0,
    size: '0 MB',
    duration: '12s'
  },
]

export default function CloudStoragePage() {
  const [activeTab, setActiveTab] = useState<'connections' | 'history'>('connections')
  const [providers, setProviders] = useState<StorageProvider[]>(initialProviders)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [backups] = useState<BackupJob[]>(initialBackups)

  const setActive = (id: string) => {
    setProviders((prev) =>
      prev.map((p) => ({ ...p, active: p.id === id }))
    )
  }
  
  const activeProvider = providers.find(p => p.active)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Cloud Storage</h1>
        <p className="mt-2 text-sm text-gray-600">
          {activeTab === 'connections' ? 'Configure file storage providers' : 'View backup history and manage backups'}
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          <button
            onClick={() => setActiveTab('connections')}
            className={`pb-3 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'connections'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Connections
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Backup History
          </button>
        </nav>
      </div>

      {/* Connections Tab */}
      {activeTab === 'connections' && (
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
      )}

      {/* Backup History Tab */}
      {activeTab === 'history' && (
        <div className="mt-8">
          {/* Backup Actions Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Backup Jobs</h3>
              <p className="text-sm text-gray-600 mt-1">
                {activeProvider ? `Backing up to ${activeProvider.name}` : 'No active storage provider'}
              </p>
            </div>
            <button 
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!activeProvider}
            >
              <Upload className="w-4 h-4" />
              Start Backup Now
            </button>
          </div>

          {/* Backup List */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {backups.length === 0 ? (
              <div className="p-12 text-center">
                <Database className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No backup history yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  Start your first backup to see it here
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {backups.map((backup) => (
                  <div key={backup.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Status Icon */}
                        <div className="mt-1">
                          {backup.status === 'success' && (
                            <div className="p-2 bg-green-100 rounded-lg">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                          )}
                          {backup.status === 'failed' && (
                            <div className="p-2 bg-red-100 rounded-lg">
                              <XCircle className="w-5 h-5 text-red-600" />
                            </div>
                          )}
                          {backup.status === 'in-progress' && (
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Clock className="w-5 h-5 text-blue-600 animate-spin" />
                            </div>
                          )}
                        </div>

                        {/* Backup Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                backup.status === 'success'
                                  ? 'bg-green-100 text-green-700'
                                  : backup.status === 'failed'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {backup.status === 'success' && 'Completed'}
                              {backup.status === 'failed' && 'Failed'}
                              {backup.status === 'in-progress' && 'In Progress'}
                            </span>
                            <span className="text-sm text-gray-500">{backup.provider}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(backup.date).toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Database className="w-3.5 h-3.5" />
                              {backup.filesCount} files
                            </span>
                            <span className="flex items-center gap-1">
                              <ArrowUpDown className="w-3.5 h-3.5" />
                              {backup.size}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {backup.duration}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      {backup.status === 'success' && (
                        <div className="flex items-center gap-2 ml-4">
                          <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                            <Download className="w-4 h-4 inline mr-1" />
                            Restore
                          </button>
                          <button className="px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50">
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Auto-Backup Settings */}
          <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="text-base font-semibold text-gray-900 mb-4">Auto-Backup Settings</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Enable automatic backups</p>
                  <p className="text-sm text-gray-500">Automatically backup your data on a schedule</p>
                </div>
                <button 
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300"
                  disabled={!activeProvider}
                >
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform translate-x-1" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Backup Frequency
                  </label>
                  <select 
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    disabled={!activeProvider}
                  >
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    defaultValue="02:00"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    disabled={!activeProvider}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!activeProvider}
                >
                  Save Auto-Backup Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
