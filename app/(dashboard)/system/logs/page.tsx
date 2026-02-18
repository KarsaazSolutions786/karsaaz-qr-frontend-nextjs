'use client'

import { useState } from 'react'

type LogLevel = 'info' | 'warning' | 'error' | 'debug'

interface LogEntry {
  id: number
  timestamp: string
  level: LogLevel
  message: string
  source: string
}

const mockLogs: LogEntry[] = [
  { id: 1, timestamp: '2026-02-18 14:32:05', level: 'info', message: 'User authentication successful for admin@karsaaz.com', source: 'AuthService' },
  { id: 2, timestamp: '2026-02-18 14:30:12', level: 'warning', message: 'Rate limit threshold reached for IP 192.168.1.45 (85/100 requests)', source: 'RateLimiter' },
  { id: 3, timestamp: '2026-02-18 14:28:44', level: 'error', message: 'Failed to send email notification: SMTP connection timeout after 30s', source: 'MailService' },
  { id: 4, timestamp: '2026-02-18 14:25:33', level: 'info', message: 'QR code batch generation completed — 150 codes processed in 4.2s', source: 'QRGenerator' },
  { id: 5, timestamp: '2026-02-18 14:22:18', level: 'debug', message: 'Cache miss for key user:profile:4821, fetching from database', source: 'CacheManager' },
  { id: 6, timestamp: '2026-02-18 14:20:01', level: 'info', message: 'Scheduled task "cleanup_expired_sessions" executed successfully', source: 'TaskScheduler' },
  { id: 7, timestamp: '2026-02-18 14:15:47', level: 'warning', message: 'Database connection pool usage at 78% (39/50 connections)', source: 'DatabasePool' },
  { id: 8, timestamp: '2026-02-18 14:10:09', level: 'error', message: 'Payment webhook signature verification failed for event evt_3Ks8jP', source: 'PaymentGateway' },
]

export default function SystemLogsPage() {
  const [levelFilter, setLevelFilter] = useState<'all' | LogLevel>('all')

  const filteredLogs = levelFilter === 'all'
    ? mockLogs
    : mockLogs.filter((log) => log.level === levelFilter)

  const levelBadge = (level: LogLevel) => {
    switch (level) {
      case 'info': return 'bg-blue-50 text-blue-700'
      case 'warning': return 'bg-yellow-50 text-yellow-700'
      case 'error': return 'bg-red-50 text-red-700'
      case 'debug': return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
        <p className="mt-2 text-sm text-gray-600">View system activity and error logs</p>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Log Level</label>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as 'all' | LogLevel)}
            className="mt-1 block w-40 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Levels</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="debug">Debug</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">From</label>
          <input
            type="date"
            defaultValue="2026-02-18"
            className="mt-1 block rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">To</label>
          <input
            type="date"
            defaultValue="2026-02-18"
            className="mt-1 block rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Message</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 font-mono">{log.timestamp}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${levelBadge(log.level)}`}>
                    {log.level.charAt(0).toUpperCase() + log.level.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">{log.message}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{log.source}</td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">
                  No log entries match the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
