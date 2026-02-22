'use client'

import Link from 'next/link'
import type { SupportTicket } from '@/types/entities/support-ticket'

const STATUS_BADGES: Record<SupportTicket['status'], { label: string; className: string }> = {
  OPEN: { label: 'Open', className: 'bg-blue-100 text-blue-800' },
  IN_PROGRESS: { label: 'In Progress', className: 'bg-yellow-100 text-yellow-800' },
  RESOLVED: { label: 'Resolved', className: 'bg-green-100 text-green-800' },
  CLOSED: { label: 'Closed', className: 'bg-gray-100 text-gray-800' },
}

const PRIORITY_INDICATORS: Record<SupportTicket['priority'], { label: string; className: string }> = {
  LOW: { label: 'Low', className: 'text-gray-500' },
  MEDIUM: { label: 'Medium', className: 'text-yellow-600' },
  HIGH: { label: 'High', className: 'text-red-600 font-semibold' },
}

interface SupportTicketListProps {
  tickets: SupportTicket[]
}

export default function SupportTicketList({ tickets }: SupportTicketListProps) {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets yet</h3>
        <p className="mt-1 text-sm text-gray-500">Create a support ticket to get help</p>
        <div className="mt-6">
          <Link
            href="/support-tickets/new"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            New Ticket
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Reference</th>
            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Subject</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Priority</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created</th>
            <th className="relative py-3.5 pl-3 pr-4">
              <span className="sr-only">View</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {tickets.map((ticket) => {
            const status = STATUS_BADGES[ticket.status]
            const priority = PRIORITY_INDICATORS[ticket.priority]
            return (
              <tr key={ticket.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-mono text-gray-500">
                  {ticket.reference}
                </td>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                  {ticket.subject}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>
                    {status.label}
                  </span>
                </td>
                <td className={`whitespace-nowrap px-3 py-4 text-sm ${priority.className}`}>
                  {priority.label}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {new Date(ticket.created_at).toLocaleDateString()}
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
  )
}
