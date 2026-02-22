'use client'

import { useState, useEffect, useCallback } from 'react'
import apiClient from '@/lib/api/client'

interface Domain {
  id: number
  domain: string
  status: 'verified' | 'pending' | 'failed'
  ssl: boolean
  created_at: string
  user_id?: number
}

export default function SystemDomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newDomain, setNewDomain] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchDomains = useCallback(async () => {
    try {
      const res = await apiClient.get('/domains', { params: { page } })
      const data = res.data as any
      setDomains(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [])
      if (data.last_page) setLastPage(data.last_page)
    } catch { /* empty */ }
    setLoading(false)
  }, [page])

  useEffect(() => { fetchDomains() }, [fetchDomains])

  const handleAdd = async () => {
    if (!newDomain.trim()) return
    setSaving(true)
    try {
      await apiClient.post('/domains', { domain: newDomain.trim() })
      setNewDomain('')
      setShowAddModal(false)
      fetchDomains()
    } catch { /* toast error */ }
    setSaving(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this domain?')) return
    try {
      await apiClient.delete(`/domains/${id}`)
      fetchDomains()
    } catch { /* toast error */ }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Domains</h1>
          <p className="mt-2 text-sm text-gray-600">Manage custom domains for QR code pages</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            <svg className="-ml-0.5 mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Domain
          </button>
        </div>
      </div>

      {/* Add Domain Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">Add Custom Domain</h2>
            <p className="mt-1 text-sm text-gray-500">
              Enter the domain you want to connect. You&apos;ll need to update DNS records after adding.
            </p>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Domain Name</label>
              <input
                type="text"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="example.com"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="mt-5 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!newDomain.trim() || saving}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Adding...' : 'Add Domain'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        {domains.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <h3 className="mt-4 text-sm font-medium text-gray-900">No domains configured</h3>
            <p className="mt-1 text-sm text-gray-500">Add a custom domain to use with your QR code pages and bio links.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
              >
                Add Your First Domain
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Domain</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">SSL</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Created</th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {domains.map((domain) => (
                    <tr key={domain.id}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{domain.domain}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          domain.status === 'verified' ? 'bg-green-100 text-green-800'
                          : domain.status === 'pending' ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                        }`}>{domain.status}</span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {domain.ssl ? <span className="text-green-600">✓ Active</span> : <span className="text-gray-400">—</span>}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {domain.created_at ? new Date(domain.created_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                        <button
                          onClick={() => handleDelete(domain.id)}
                          className="font-medium text-red-600 hover:text-red-500"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {lastPage > 1 && (
              <div className="mt-4 flex justify-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="rounded px-3 py-1 text-sm border disabled:opacity-50"
                >Previous</button>
                <span className="px-3 py-1 text-sm text-gray-600">Page {page} of {lastPage}</span>
                <button
                  disabled={page >= lastPage}
                  onClick={() => setPage(page + 1)}
                  className="rounded px-3 py-1 text-sm border disabled:opacity-50"
                >Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
