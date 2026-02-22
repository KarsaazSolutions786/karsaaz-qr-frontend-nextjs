'use client'

import { useState, useEffect } from 'react'
import { pluginsAPI } from '@/lib/api/endpoints/plugins'

interface Plugin {
  id: string
  name: string
  description: string
  author: string
  version: string
  category: string
  price?: string
  tags?: string[]
}

const availablePlugins: Plugin[] = [
  {
    id: 'affiliates-coupons',
    name: 'Affiliates & Coupons',
    description: 'Referral affiliate program with coupon code discounts for subscriptions.',
    author: 'Karsaaz',
    version: '1.0.0',
    category: 'Marketing',
    tags: ['affiliate', 'coupon', 'discount'],
  },
  {
    id: 'pre-printed-qr-codes',
    name: 'Pre-Printed QR Codes',
    description: 'Generate and manage pre-printed QR codes for physical media distribution.',
    author: 'Karsaaz',
    version: '1.0.0',
    category: 'QR Codes',
    tags: ['print', 'bulk', 'physical'],
  },
  {
    id: 'product-store',
    name: 'Product Store',
    description: 'Create and manage a product store with QR code integration.',
    author: 'Karsaaz',
    version: '1.0.0',
    category: 'E-Commerce',
    tags: ['store', 'products', 'commerce'],
  },
]

export default function PluginsAvailablePage() {
  const [search, setSearch] = useState('')
  const [installedSlugs, setInstalledSlugs] = useState<string[]>([])
  const [, setLoading] = useState(true)

  useEffect(() => {
    pluginsAPI
      .getInstalled()
      .then((plugins) => setInstalledSlugs(plugins.map((p) => p.slug)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = availablePlugins.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  )

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

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((plugin) => {
          const isInstalled = installedSlugs.includes(plugin.id)
          return (
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
                {plugin.tags && plugin.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {plugin.tags.map((tag) => (
                      <span key={tag} className="rounded bg-blue-50 px-1.5 py-0.5 text-xs text-blue-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-3 flex items-center space-x-3 text-xs text-gray-400">
                  <span>v{plugin.version}</span>
                  <span>·</span>
                  <span>by {plugin.author}</span>
                </div>
              </div>
              <div className="mt-5">
                {isInstalled ? (
                  <span className="inline-flex w-full items-center justify-center rounded-md bg-green-50 py-2 text-sm font-medium text-green-700">
                    ✓ Installed
                  </span>
                ) : (
                  <a
                    href="https://karsaazqr.com/plugins"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                  >
                    {plugin.price ? `Buy — ${plugin.price}` : 'Get Plugin'}
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">No plugins match your search.</p>
        </div>
      )}
    </div>
  )
}
