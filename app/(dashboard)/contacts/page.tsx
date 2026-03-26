'use client'

import { useState, useCallback } from 'react'
import { useContacts } from '@/lib/hooks/queries/useContacts'
import { useDeleteContact } from '@/lib/hooks/mutations/useContactMutations'
import type { Contact } from '@/types/entities/contact'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import { VirtualizedTable } from '@/components/common/VirtualizedList'

export default function ContactsPage() {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useContacts({ page, search: search || undefined })
  const deleteMutation = useDeleteContact()

  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

  const handleDelete = async (contact: Contact) => {
    if (
      !confirm(
        t('Delete contact from "{{name}}"? This action cannot be undone.').replace(
          '{{name}}',
          contact.name
        )
      )
    )
      return
    setDeleteTarget(contact.id)
    try {
      await deleteMutation.mutateAsync(contact.id)
    } finally {
      setDeleteTarget(null)
    }
  }

  const contacts: Contact[] = data?.data ?? []
  const pagination = data?.pagination

  const contactColumns = useCallback(
    () => [
      {
        key: 'name',
        label: t('Name'),
        render: (contact: Contact) => (
          <span className="text-sm font-medium text-gray-900">{contact.name}</span>
        ),
      },
      {
        key: 'email',
        label: t('Email'),
        render: (contact: Contact) => (
          <a href={`mailto:${contact.email}`} className="text-sm text-gray-500 hover:underline">
            {contact.email}
          </a>
        ),
      },
      {
        key: 'subject',
        label: t('Subject'),
        render: (contact: Contact) => (
          <span className="text-sm text-gray-600">{contact.subject}</span>
        ),
      },
      {
        key: 'actions',
        label: t('Actions'),
        width: 160,
        render: (contact: Contact) => (
          <div className="flex items-center justify-end gap-2">
            <Link
              href={`/contacts/${contact.id}`}
              className="rounded px-2 py-1 text-blue-600 hover:bg-blue-50"
            >
              {t('View')}
            </Link>
            <button
              onClick={() => handleDelete(contact)}
              disabled={deleteTarget === contact.id}
              className="rounded px-2 py-1 text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              {deleteTarget === contact.id ? '\u2026' : t('Delete')}
            </button>
          </div>
        ),
      },
    ],
    [t, deleteTarget, handleDelete]
  )

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{t('Contacts')}</h1>
        <p className="mt-2 text-sm text-gray-600">
          {t('Contact form submissions from your public website')}
        </p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="search"
          placeholder={t('Search by anything...')}
          value={search}
          onChange={e => {
            setSearch(e.target.value)
            setPage(1)
          }}
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
            <p className="text-lg font-medium">{t('No contacts yet')}</p>
            <p className="text-sm">
              {t('Submissions from your public contact form will appear here')}
            </p>
          </div>
        ) : (
          <VirtualizedTable
            items={contacts}
            columns={contactColumns()}
            rowHeight={60}
            height={Math.min(480, contacts.length * 60)}
          />
        )}
      </div>

      {pagination && pagination.lastPage > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            {t('Page')} {pagination.currentPage} {t('of')} {pagination.lastPage} ({pagination.total}{' '}
            {t('total')})
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={pagination.currentPage === 1}
              className="rounded border px-3 py-1 disabled:opacity-40"
            >
              {t('\u2190 Prev')}
            </button>
            <button
              onClick={() => setPage(p => Math.min(pagination.lastPage, p + 1))}
              disabled={pagination.currentPage === pagination.lastPage}
              className="rounded border px-3 py-1 disabled:opacity-40"
            >
              {t('Next \u2192')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
