'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supportTicketsAPI } from '@/lib/api/endpoints/support-tickets'
import type { SupportTicket } from '@/types/entities/support-ticket'

const STATUS_BADGES: Record<SupportTicket['status'], { label: string; className: string }> = {
  OPEN: { label: 'Open', className: 'bg-blue-100 text-blue-800' },
  IN_PROGRESS: { label: 'In Progress', className: 'bg-yellow-100 text-yellow-800' },
  RESOLVED: { label: 'Resolved', className: 'bg-green-100 text-green-800' },
  CLOSED: { label: 'Closed', className: 'bg-gray-100 text-gray-800' },
}

/**
 * T221: Admin page showing ALL tickets across users.
 */
export default function AdminSupportTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    const fetchAllTickets = async () => {
      try {
        setIsLoading(true)
        // Admin endpoint — list all tickets (not scoped to a single user email)
        const data = await supportTicketsAPI.list('__admin__')
        setTickets(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to fetch admin tickets:', err)
        setError('Failed to load support tickets')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllTickets()
  }, [])

  const filtered = statusFilter === 'all' ? tickets : tickets.filter(t => t.status === statusFilter)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Support Tickets</h1>
          <p className="mt-2 text-sm text-gray-600">Admin view — all tickets across users</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="mt-6 flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Status:</label>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        >
          <option value="all">All</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
            <p className="mt-2 text-sm text-gray-600">Loading...</p>
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">No tickets found.</p>
          </div>
        ) : (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                    Ticket ID
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    User Name
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Subject
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Created
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Last Reply
                  </th>
                  <th className="relative py-3.5 pl-3 pr-4">
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filtered.map(ticket => {
                  const status = STATUS_BADGES[ticket.status]
                  return (
                    <tr key={ticket.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-mono text-gray-500">
                        {ticket.reference}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {ticket.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                        {ticket.subject}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {ticket.updated_at ? new Date(ticket.updated_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                        <Link
                          href={`/support-tickets/${ticket.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
