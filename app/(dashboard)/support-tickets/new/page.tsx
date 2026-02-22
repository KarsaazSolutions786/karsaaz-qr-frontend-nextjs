'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/context/AuthContext'
import { supportTicketsAPI } from '@/lib/api/endpoints/support-tickets'
import CreateTicketForm from '@/components/features/support/CreateTicketForm'
import type { CreateTicketPayload } from '@/types/entities/support-ticket'

export default function NewTicketPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: CreateTicketPayload) => {
    try {
      setIsLoading(true)
      await supportTicketsAPI.create(data)
      router.push('/support-tickets')
    } catch (err) {
      console.error('Failed to create ticket:', err)
      alert('Failed to create ticket. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">New Support Ticket</h1>
        <p className="mt-2 text-sm text-gray-600">Describe your issue and we&apos;ll get back to you</p>
      </div>

      <CreateTicketForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        defaultEmail={user?.email}
        defaultName={user?.name}
      />
    </div>
  )
}
