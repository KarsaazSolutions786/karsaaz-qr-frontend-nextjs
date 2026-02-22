'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { pluginsAPI, type PluginInfo } from '@/lib/api/endpoints/plugins'
import { PluginSettingsForm } from '@/components/features/plugins/PluginSettingsForm'
import { ArrowLeft, Loader2 } from 'lucide-react'

export default function PluginDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [plugin, setPlugin] = useState<PluginInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPlugin = () => {
    setLoading(true)
    pluginsAPI
      .getDetails(slug)
      .then((data) => setPlugin(data))
      .catch(() => setError('Failed to load plugin details'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadPlugin()
  }, [slug])

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error || !plugin) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error || 'Plugin not found'}
        </div>
        <Link href="/plugins/installed" className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-500">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Installed Plugins
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/plugins/installed"
        className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Installed Plugins
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{plugin.name}</h1>
        {plugin.description && (
          <p className="mt-1 text-sm text-gray-500">{plugin.description}</p>
        )}
        {plugin.tags && plugin.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {plugin.tags.map((tag) => (
              <span key={tag} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Plugin Settings</h2>
        <PluginSettingsForm configs={plugin.configs ?? []} onSaved={loadPlugin} />
      </div>
    </div>
  )
}
