'use client'

import { useState } from 'react'

interface Plugin {
  id: string
  name: string
  description: string
  author: string
  version: string
  category: string
  installed: boolean
}

const availablePlugins: Plugin[] = [
  {
    id: 'seo-tools',
    name: 'SEO Tools',
    description: 'Optimize pages with meta tags, sitemaps, structured data, and keyword analysis.',
    author: 'Karsaaz',
    version: '1.2.0',
    category: 'Marketing',
    installed: false,
  },
  {
    id: 'social-media-links',
    name: 'Social Media Links',
    description: 'Add social media profile links and share buttons to bio pages.',
    author: 'Karsaaz',
    version: '1.0.3',
    category: 'Social',
    installed: false,
  },
  {
    id: 'custom-domains',
    name: 'Custom Domains',
    description: 'Allow users to connect their own domains to their bio link pages.',
    author: 'Karsaaz',
    version: '2.0.1',
    category: 'Infrastructure',
    installed: false,
  },
  {
    id: 'advanced-analytics',
    name: 'Advanced Analytics',
    description: 'Detailed analytics with geographic data, device breakdown, and conversion tracking.',
    author: 'Karsaaz',
    version: '1.5.0',
    category: 'Analytics',
    installed: false,
  },
  {
    id: 'email-marketing',
    name: 'Email Marketing',
    description: 'Collect email subscribers and send newsletters from your dashboard.',
    author: 'Karsaaz',
    version: '1.1.0',
    category: 'Marketing',
    installed: false,
  },
  {
    id: 'form-builder',
    name: 'Form Builder',
    description: 'Create custom forms with drag & drop fields, validation, and submissions inbox.',
    author: 'Community',
    version: '0.9.2',
    category: 'Productivity',
    installed: false,
  },
]

export default function PluginsAvailablePage() {
  const [plugins, setPlugins] = useState<Plugin[]>(availablePlugins)
  const [search, setSearch] = useState('')

  const filtered = plugins.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  )

  const installPlugin = (id: string) => {
    setPlugins((prev) =>
      prev.map((p) => (p.id === id ? { ...p, installed: true } : p))
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Available Plugins</h1>
          <p className="mt-2 text-sm text-gray-600">
            Browse and install plugins to extend functionality
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mt-6">
        <div className="relative max-w-md">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search plugins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Plugins Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((plugin) => (
          <div
            key={plugin.id}
            className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div>
              <div className="flex items-start justify-between">
                <h3 className="text-base font-semibold text-gray-900">{plugin.name}</h3>
                <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                  {plugin.category}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">{plugin.description}</p>
              <div className="mt-3 flex items-center space-x-3 text-xs text-gray-400">
                <span>v{plugin.version}</span>
                <span>·</span>
                <span>by {plugin.author}</span>
              </div>
            </div>
            <div className="mt-5">
              {plugin.installed ? (
                <span className="inline-flex w-full items-center justify-center rounded-md bg-green-50 py-2 text-sm font-medium text-green-700">
                  ✓ Installed
                </span>
              ) : (
                <button
                  onClick={() => installPlugin(plugin.id)}
                  className="w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Install
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">No plugins match your search.</p>
        </div>
      )}
    </div>
  )
}
