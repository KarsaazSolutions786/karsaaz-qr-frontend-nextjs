'use client'

import { useState } from 'react'

interface ServiceStatus {
  name: string
  status: 'operational' | 'degraded' | 'down'
  uptime: string
  responseTime: string
  lastChecked: string
}

const services: ServiceStatus[] = [
  { name: 'API Server', status: 'operational', uptime: '99.99%', responseTime: '45ms', lastChecked: 'Just now' },
  { name: 'Database', status: 'operational', uptime: '99.98%', responseTime: '12ms', lastChecked: 'Just now' },
  { name: 'Cache (Redis)', status: 'operational', uptime: '99.99%', responseTime: '2ms', lastChecked: 'Just now' },
  { name: 'Queue Worker', status: 'operational', uptime: '99.95%', responseTime: '—', lastChecked: 'Just now' },
  { name: 'Storage', status: 'operational', uptime: '99.99%', responseTime: '85ms', lastChecked: 'Just now' },
]

export default function SystemStatusPage() {
  const [_refreshing] = useState(false)

  const statusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'operational': return 'bg-green-400'
      case 'degraded': return 'bg-yellow-400'
      case 'down': return 'bg-red-400'
    }
  }

  const statusText = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'operational': return 'text-green-700 bg-green-50'
      case 'degraded': return 'text-yellow-700 bg-yellow-50'
      case 'down': return 'text-red-700 bg-red-50'
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
          <p className="mt-2 text-sm text-gray-600">Monitor system health and performance</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-green-400"></span>
            All Systems Operational
          </span>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {services.map((service) => (
          <div key={service.name} className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`mr-3 h-3 w-3 rounded-full ${statusColor(service.status)}`}></span>
                  <h3 className="text-sm font-medium text-gray-900">{service.name}</h3>
                </div>
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusText(service.status)}`}>
                  {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                </span>
              </div>
              <div className="mt-2 flex space-x-6 text-sm text-gray-500">
                <span>Uptime: {service.uptime}</span>
                <span>Response: {service.responseTime}</span>
                <span>Last checked: {service.lastChecked}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
