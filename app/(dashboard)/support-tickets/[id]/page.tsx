'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/context/AuthContext'
import { supportTicketsAPI } from '@/lib/api/endpoints/support-tickets'
import TicketConversation from '@/components/features/support/TicketConversation'
import type { SupportTicket, TicketMessage } from '@/types/entities/support-ticket'

const STATUS_BADGES: Record<SupportTicket['status'], { label: string; className: string }> = {
  OPEN: { label: 'Open', className: 'bg-blue-100 text-blue-800' },
  IN_PROGRESS: { label: 'In Progress', className: 'bg-yellow-100 text-yellow-800' },
  RESOLVED: { label: 'Resolved', className: 'bg-green-100 text-green-800' },
  CLOSED: { label: 'Closed', className: 'bg-gray-100 text-gray-800' },
}

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user } = useAuth()
  const [ticket, setTicket] = useState<SupportTicket | null>(null)
  const [messages, setMessages] = useState<TicketMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isReplying, setIsReplying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const conversation = await supportTicketsAPI.getConversation(Number(id))
        // The API may return an array of messages directly, or an object with ticket + messages
        if (Array.isArray(conversation)) {
          setMessages(conversation)
        } else if (conversation && typeof conversation === 'object') {
          const conv = conversation as { ticket?: SupportTicket; messages?: TicketMessage[] }
          if (conv.ticket) setTicket(conv.ticket)
          setMessages(conv.messages || [])
        } else {
          setMessages([])
        }
      } catch (err) {
        console.error('Failed to fetch conversation:', err)
        setError('Failed to load ticket conversation')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  // Also fetch ticket details from the list if we don't have them
  useEffect(() => {
    if (ticket || !user?.email) return

    const fetchTicket = async () => {
      try {
        const tickets = await supportTicketsAPI.list(user.email)
        const found = (Array.isArray(tickets) ? tickets : []).find(
          (t: SupportTicket) => t.id === Number(id)
        )
        if (found) setTicket(found)
      } catch {
        // Non-critical — we just won't show ticket info header
      }
    }

    fetchTicket()
  }, [id, user?.email, ticket])

  const handleReply = async (text: string) => {
    if (!user?.email) return
    try {
      setIsReplying(true)
      const newMsg = await supportTicketsAPI.reply(Number(id), user.email, text)
      setMessages((prev) => [...prev, newMsg])
    } catch (err) {
      console.error('Failed to send reply:', err)
      alert('Failed to send reply. Please try again.')
    } finally {
      setIsReplying(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  const status = ticket ? STATUS_BADGES[ticket.status] : null

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link href="/support-tickets" className="text-sm text-blue-600 hover:text-blue-900">
          ← Back to Tickets
        </Link>
      </div>

      {/* Ticket header */}
      {ticket && (
        <div className="mb-8 bg-white shadow-md rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{ticket.subject}</h1>
              <p className="mt-1 text-sm text-gray-500 font-mono">Ref: {ticket.reference}</p>
            </div>
            {status && (
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${status.className}`}>
                {status.label}
              </span>
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600 sm:grid-cols-4">
            <div>
              <span className="font-medium text-gray-900">Priority:</span> {ticket.priority}
            </div>
            <div>
              <span className="font-medium text-gray-900">Department:</span> {ticket.department}
            </div>
            <div>
              <span className="font-medium text-gray-900">Created:</span>{' '}
              {new Date(ticket.created_at).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium text-gray-900">Updated:</span>{' '}
              {new Date(ticket.updated_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}

      {/* Conversation */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversation</h2>
        <TicketConversation
          messages={messages}
          onReply={handleReply}
          isReplying={isReplying}
        />
      </div>
    </div>
  )
}
