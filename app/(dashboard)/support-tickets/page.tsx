'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/context/AuthContext'
import { supportTicketsAPI } from '@/lib/api/endpoints/support-tickets'
import SupportTicketList from '@/components/features/support/SupportTicketList'
import type { SupportTicket } from '@/types/entities/support-ticket'

export default function SupportTicketsPage() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    if (!user?.email) return

    const fetchTickets = async () => {
      try {
        setIsLoading(true)
        const data = await supportTicketsAPI.list(user.email)
        setTickets(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to fetch tickets:', err)
        setError('Failed to load support tickets')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTickets()
  }, [user?.email])

  const filteredTickets =
    statusFilter === 'all' ? tickets : tickets.filter(t => t.status === statusFilter)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
          <p className="mt-2 text-sm text-gray-600">View and manage your support requests</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/support-tickets/new"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            New Ticket
          </Link>
        </div>
      </div>

      {/* T220: Ticket status filter */}
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

      <div className="mt-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="mt-2 text-sm text-gray-600">Loading...</p>
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        ) : (
          <SupportTicketList tickets={filteredTickets} />
        )}
      </div>
    </div>
  )
}
