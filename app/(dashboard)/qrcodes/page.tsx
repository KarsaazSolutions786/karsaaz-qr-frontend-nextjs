'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQRCodes } from '@/lib/hooks/queries/useQRCodes'
import { QRCodeList } from '@/components/features/qrcodes/QRCodeList'

export default function QRCodesPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const { data, isLoading, error } = useQRCodes({ page, search: search || undefined })

  // Debug: Log the response
  if (error) {
    console.error('QR Codes fetch error:', error)
  }
  if (data) {
    console.log('QR Codes data:', data)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">QR Codes</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage all your QR codes in one place
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/qrcodes/new"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create QR Code
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-6">
          <input
            type="search"
            placeholder="Search QR codes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:max-w-md"
          />
        </div>

        <QRCodeList qrcodes={data?.data || []} isLoading={isLoading} />

        {data?.pagination && data.pagination.total > data.pagination.perPage && (
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {data.pagination.lastPage}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= data.pagination.lastPage}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
