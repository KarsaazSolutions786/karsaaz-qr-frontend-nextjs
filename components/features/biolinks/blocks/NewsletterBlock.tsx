'use client'

import { useState } from 'react'
import type { NewsletterBlockData } from '@/types/entities/biolink'

interface NewsletterBlockProps {
  block: NewsletterBlockData
  isEditing?: boolean
  onUpdate?: (data: NewsletterBlockData['data']) => void
}

export default function NewsletterBlock({ block, isEditing, onUpdate }: NewsletterBlockProps) {
  const { title, description, placeholder = 'Enter your email', buttonText = 'Subscribe', apiEndpoint } = block.data
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => onUpdate?.({ ...block.data, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description (optional)</label>
          <input
            type="text"
            value={description || ''}
            onChange={(e) => onUpdate?.({ ...block.data, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Placeholder</label>
          <input
            type="text"
            value={placeholder}
            onChange={(e) => onUpdate?.({ ...block.data, placeholder: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Button Text</label>
          <input
            type="text"
            value={buttonText}
            onChange={(e) => onUpdate?.({ ...block.data, buttonText: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">API Endpoint</label>
          <input
            type="url"
            value={apiEndpoint}
            onChange={(e) => onUpdate?.({ ...block.data, apiEndpoint: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !apiEndpoint) return
    try {
      await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setSubmitted(true)
    } catch {
      // Silently fail
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg bg-green-50 p-6 text-center">
        <p className="font-medium text-green-800">✓ Thank you for subscribing!</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-1 text-center text-lg font-semibold text-gray-900">{title}</h3>
      {description && <p className="mb-4 text-center text-sm text-gray-600">{description}</p>}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          {buttonText}
        </button>
      </form>
    </div>
  )
}
