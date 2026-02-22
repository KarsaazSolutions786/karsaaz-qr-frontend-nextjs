'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { pluginsAPI, type PluginInfo } from '@/lib/api/endpoints/plugins'
import { Settings, Loader2 } from 'lucide-react'

export default function PluginsInstalledPage() {
  const [plugins, setPlugins] = useState<PluginInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    pluginsAPI
      .getInstalled()
      .then((data) => setPlugins(Array.isArray(data) ? data : []))
      .catch(() => setError('Failed to load installed plugins'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Installed Plugins</h1>
          <p className="mt-2 text-sm text-gray-600">Manage your installed plugins</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/plugins/available"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Browse Plugins
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="mt-8">
        {plugins.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3 className="mt-4 text-sm font-medium text-gray-900">No plugins installed</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by installing plugins from the marketplace.
            </p>
            <div className="mt-6">
              <Link
                href="/plugins/available"
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
              >
                Browse Available Plugins
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Plugin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tags</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {plugins.map((plugin) => (
                  <tr key={plugin.slug}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{plugin.name}</p>
                      {plugin.description && (
                        <p className="text-xs text-gray-500">{plugin.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {plugin.tags?.map((tag) => (
                          <span key={tag} className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      {plugin.show_settings_link !== false && (
                        <Link
                          href={`/plugins/${plugin.slug}`}
                          className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-500"
                        >
                          <Settings className="h-3.5 w-3.5" />
                          Settings
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
