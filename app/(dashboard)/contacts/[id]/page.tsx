'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useContact } from '@/lib/hooks/queries/useContacts'
import { useUpdateContact } from '@/lib/hooks/mutations/useContactMutations'

export default function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: contact, isLoading } = useContact(Number(id))
  const updateMutation = useUpdateContact()

  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (contact) setNotes(contact.notes ?? '')
  }, [contact])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateMutation.mutateAsync({ id: Number(id), data: { notes } })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (isLoading) return (
    <div className="flex min-h-96 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
    </div>
  )
  if (!contact) return <div className="text-center py-12">Contact not found</div>

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact</h1>
          <p className="mt-1 text-sm text-gray-500">
            Received {new Date(contact.createdAt).toLocaleString()}
          </p>
        </div>
        <Link href="/contacts" className="text-sm text-blue-600 hover:text-blue-900">← Back</Link>
      </div>

      {updateMutation.error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">Failed to save notes.</div>
      )}
      {saved && (
        <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700">Notes saved.</div>
      )}

      {/* Read-only contact fields */}
      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-gray-400">Name</label>
          <p className="mt-1 text-sm text-gray-900">{contact.name}</p>
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-gray-400">Email</label>
          <p className="mt-1 text-sm text-gray-900">
            <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">{contact.email}</a>
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-gray-400">Subject</label>
          <p className="mt-1 text-sm text-gray-900">{contact.subject}</p>
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-gray-400">Message</label>
          <p className="mt-1 whitespace-pre-wrap text-sm text-gray-900">{contact.message}</p>
        </div>
      </div>

      {/* Editable notes */}
      <form onSubmit={handleSave} className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <label className="block text-sm font-medium text-gray-700">Internal Notes</label>
        <p className="mt-0.5 text-xs text-gray-500">For your own reference. The customer will not be notified.</p>
        <textarea
          rows={5}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add internal notes here…"
          className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
        />
        <div className="mt-4 flex items-center justify-end gap-4">
          <button type="button" onClick={() => router.back()}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" disabled={updateMutation.isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
            {updateMutation.isPending ? 'Saving…' : 'Save Notes'}
          </button>
        </div>
      </form>
    </div>
  )
}
