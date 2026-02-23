'use client'

import { useState } from 'react'
import { systemConfigsAPI } from '@/lib/api/endpoints/system-configs'

interface CacheEntry {
  id: string
  name: string
  description: string
  status: 'active' | 'cleared'
}

const initialCaches: CacheEntry[] = [
  { id: 'app', name: 'Application Cache', description: 'General application data and computed results', status: 'active' },
  { id: 'view', name: 'View Cache', description: 'Compiled and rendered view templates', status: 'active' },
  { id: 'route', name: 'Route Cache', description: 'Cached route registrations and URL mappings', status: 'active' },
  { id: 'config', name: 'Config Cache', description: 'Cached configuration files and environment values', status: 'active' },
]

export default function SystemCachePage() {
  const [caches, setCaches] = useState<CacheEntry[]>(initialCaches)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const showFeedback = (msg: string) => {
    setFeedback(msg)
    setTimeout(() => setFeedback(null), 3000)
  }

  const clearSingle = async (id: string) => {
    setLoading((prev) => ({ ...prev, [`clear-${id}`]: true }))
    try {
      await systemConfigsAPI.clearCache(id)
      setCaches((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: 'cleared' as const } : c))
      )
      showFeedback('Cache cleared successfully!')
    } catch {
      showFeedback('Failed to clear cache.')
    } finally {
      setLoading((prev) => ({ ...prev, [`clear-${id}`]: false }))
    }
  }

  const rebuildSingle = async (id: string) => {
    setLoading((prev) => ({ ...prev, [`rebuild-${id}`]: true }))
    try {
      await systemConfigsAPI.rebuildCache(id)
      setCaches((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: 'active' as const } : c))
      )
      showFeedback('Cache rebuilt successfully!')
    } catch {
      showFeedback('Failed to rebuild cache.')
    } finally {
      setLoading((prev) => ({ ...prev, [`rebuild-${id}`]: false }))
    }
  }

  const clearAll = async () => {
    setLoading((prev) => ({ ...prev, all: true }))
    try {
      await Promise.all(caches.map((c) => systemConfigsAPI.clearCache(c.id)))
      setCaches((prev) => prev.map((c) => ({ ...c, status: 'cleared' as const })))
      showFeedback('All caches cleared successfully!')
    } catch {
      showFeedback('Failed to clear all caches.')
    } finally {
      setLoading((prev) => ({ ...prev, all: false }))
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cache Management</h1>
          <p className="mt-2 text-sm text-gray-600">Manage application cache</p>
        </div>
        <div className="mt-4 flex items-center gap-3 sm:mt-0">
          {feedback && (
            <span className="text-sm font-medium text-green-600">{feedback}</span>
          )}
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Clear All Caches
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {caches.map((cache) => (
          <div key={cache.id} className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">{cache.name}</h3>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    cache.status === 'active'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {cache.status === 'active' ? 'Active' : 'Cleared'}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">{cache.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    cache.status === 'active'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {cache.status === 'active' ? 'Active' : 'Cleared'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => rebuildSingle(cache.id)}
                    disabled={loading[`rebuild-${cache.id}`]}
                    className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-sm font-medium text-blue-700 shadow-sm ring-1 ring-inset ring-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading[`rebuild-${cache.id}`] ? 'Rebuilding…' : 'Rebuild'}
                  </button>
                  <button
                    type="button"
                    onClick={() => clearSingle(cache.id)}
                    disabled={cache.status === 'cleared' || loading[`clear-${cache.id}`]}
                    className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading[`clear-${cache.id}`] ? 'Clearing…' : 'Clear'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
