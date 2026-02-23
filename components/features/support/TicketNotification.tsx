'use client'

import { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'

interface TicketNotificationProps {
  ticketId: number
  ticketReference: string
  message?: string
  onDismiss?: () => void
  onView?: (ticketId: number) => void
}

/**
 * T219: Notification badge/toast when admin replies to a support ticket.
 */
export function TicketNotification({
  ticketId,
  ticketReference,
  message = 'You have a new reply on your support ticket.',
  onDismiss,
  onView,
}: TicketNotificationProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onDismiss?.()
    }, 10000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  if (!visible) return null

  return (
    <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Bell className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">Ticket #{ticketReference}</p>
            <p className="mt-1 text-sm text-gray-500">{message}</p>
            <div className="mt-3 flex gap-3">
              <button
                onClick={() => onView?.(ticketId)}
                className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
              >
                View Ticket
              </button>
              <button
                onClick={() => {
                  setVisible(false)
                  onDismiss?.()
                }}
                className="rounded-md bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 ring-1 ring-inset ring-gray-300"
              >
                Dismiss
              </button>
            </div>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              onClick={() => {
                setVisible(false)
                onDismiss?.()
              }}
              className="inline-flex rounded-md text-gray-400 hover:text-gray-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Notification badge showing unread ticket reply count.
 */
export function TicketNotificationBadge({ count }: { count: number }) {
  if (count <= 0) return null

  return (
    <span className="inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
      {count > 99 ? '99+' : count}
    </span>
  )
}
