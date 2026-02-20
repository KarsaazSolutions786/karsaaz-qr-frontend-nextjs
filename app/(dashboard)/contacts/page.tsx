'use client'

import { useState } from 'react'
import { useContacts } from '@/lib/hooks/queries/useContacts'
import { useDeleteContact } from '@/lib/hooks/mutations/useContactMutations'
import type { Contact } from '@/types/entities/contact'
import Link from 'next/link'

export default function ContactsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useContacts({ page, search: search || undefined })
  const deleteMutation = useDeleteContact()

  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

  const handleDelete = async (contact: Contact) => {
    if (!confirm(`Delete contact from "${contact.name}"? This action cannot be undone.`)) return
    setDeleteTarget(contact.id)
    try {
      await deleteMutation.mutateAsync(contact.id)
    } finally {
      setDeleteTarget(null)
    }
  }

  const contacts = data?.data ?? []
  const pagination = data?.pagination

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
        <p className="mt-2 text-sm text-gray-600">Contact form submissions from your public website</p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="search"
          placeholder="Search by anything…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:max-w-sm"
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          </div>
        ) : contacts.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 text-gray-500">
            <p className="text-lg font-medium">No contacts yet</p>
            <p className="text-sm">Submissions from your public contact form will appear here</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Subject</th>
                <th className="w-28 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{contact.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <a href={`mailto:${contact.email}`} className="hover:underline">{contact.email}</a>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{contact.subject}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/contacts/${contact.id}`}
                        className="rounded px-2 py-1 text-blue-600 hover:bg-blue-50">View</Link>
                      <button
                        onClick={() => handleDelete(contact)}
                        disabled={deleteTarget === contact.id}
                        className="rounded px-2 py-1 text-red-600 hover:bg-red-50 disabled:opacity-50">
                        {deleteTarget === contact.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pagination && pagination.lastPage > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>Page {pagination.currentPage} of {pagination.lastPage} ({pagination.total} total)</span>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pagination.currentPage === 1}
              className="rounded border px-3 py-1 disabled:opacity-40">← Prev</button>
            <button onClick={() => setPage((p) => Math.min(pagination.lastPage, p + 1))}
              disabled={pagination.currentPage === pagination.lastPage}
              className="rounded border px-3 py-1 disabled:opacity-40">Next →</button>
          </div>
        </div>
      )}
    </div>
  )
}
