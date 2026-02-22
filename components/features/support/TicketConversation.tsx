'use client'

import { useState } from 'react'
import type { TicketMessage } from '@/types/entities/support-ticket'

interface TicketConversationProps {
  messages: TicketMessage[]
  onReply: (text: string) => void
  isReplying: boolean
}

export default function TicketConversation({ messages, onReply, isReplying }: TicketConversationProps) {
  const [replyText, setReplyText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return
    onReply(replyText.trim())
    setReplyText('')
  }

  return (
    <div className="space-y-6">
      {/* Message thread */}
      <div className="space-y-4">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-8">No messages yet</p>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender_type === 'user'
            return (
              <div
                key={msg.id}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-3 ${
                    isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className={`text-xs font-medium mb-1 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                    {msg.sender_name}
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  <div className={`text-xs mt-2 ${isUser ? 'text-blue-200' : 'text-gray-400'}`}>
                    {new Date(msg.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Reply form */}
      <form onSubmit={handleSubmit} className="border-t pt-4">
        <label htmlFor="reply" className="block text-sm font-medium text-gray-700 mb-2">
          Reply
        </label>
        <textarea
          id="reply"
          rows={4}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Type your reply..."
          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={isReplying || !replyText.trim()}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isReplying ? 'Sending...' : 'Send Reply'}
          </button>
        </div>
      </form>
    </div>
  )
}
