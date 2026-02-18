'use client'

import { useState } from 'react'

interface Connection {
  id: string
  name: string
  description: string
  connected: boolean
  category: string
  icon: string
}

const initialConnections: Connection[] = [
  {
    id: 'google_analytics',
    name: 'Google Analytics',
    description: 'Track website traffic, user behavior, and conversion funnels.',
    connected: false,
    category: 'Analytics',
    icon: '📊',
  },
  {
    id: 'facebook_pixel',
    name: 'Facebook Pixel',
    description: 'Track conversions and build audiences for Facebook Ads.',
    connected: false,
    category: 'Analytics',
    icon: '📘',
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Sync contacts and automate email marketing campaigns.',
    connected: false,
    category: 'Email',
    icon: '📧',
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect with 5,000+ apps via automated workflows.',
    connected: false,
    category: 'Automation',
    icon: '⚡',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Receive notifications and alerts in Slack channels.',
    connected: false,
    category: 'Communication',
    icon: '💬',
  },
  {
    id: 'google_tag_manager',
    name: 'Google Tag Manager',
    description: 'Manage marketing tags without editing site code.',
    connected: false,
    category: 'Analytics',
    icon: '🏷️',
  },
  {
    id: 'webhook',
    name: 'Custom Webhook',
    description: 'Send event data to any external URL via webhooks.',
    connected: false,
    category: 'Developer',
    icon: '🔗',
  },
  {
    id: 'sendgrid',
    name: 'SendGrid',
    description: 'Transactional and marketing email delivery service.',
    connected: false,
    category: 'Email',
    icon: '✉️',
  },
]

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>(initialConnections)
  const [filter, setFilter] = useState<string>('All')

  const categories = ['All', ...Array.from(new Set(initialConnections.map((c) => c.category)))]

  const filtered =
    filter === 'All' ? connections : connections.filter((c) => c.category === filter)

  const toggleConnection = (id: string) => {
    setConnections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, connected: !c.connected } : c))
    )
  }

  const connectedCount = connections.filter((c) => c.connected).length

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Connections</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage third-party integrations and API connections
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
            {connectedCount} connected
          </span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Integration Cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((conn) => (
          <div
            key={conn.id}
            className={`rounded-lg border bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${
              conn.connected ? 'border-green-300' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <span className="text-2xl">{conn.icon}</span>
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  conn.connected
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {conn.connected ? 'Connected' : 'Not connected'}
              </span>
            </div>
            <h3 className="mt-3 text-sm font-semibold text-gray-900">{conn.name}</h3>
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">{conn.description}</p>
            <div className="mt-4">
              <button
                onClick={() => toggleConnection(conn.id)}
                className={`w-full rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  conn.connected
                    ? 'bg-red-50 text-red-700 hover:bg-red-100'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {conn.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
