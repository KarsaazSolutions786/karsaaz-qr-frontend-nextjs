'use client'

import { useState, useEffect, useCallback } from 'react'
import apiClient from '@/lib/api/client'
import { useTranslation } from '@/lib/i18n'
import { toast } from 'sonner'
import type { DomainAvailability } from '@/types/entities/domain'
import { LottieLoader } from '@/components/ui/lottie-loader'

interface Domain {
  id: number
  domain: string
  host?: string
  status: 'verified' | 'pending' | 'failed'
  availability?: DomainAvailability
  ssl: boolean
  is_default: boolean
  created_at: string
  user_id?: number
  user?: { id: number; name: string }
}

/**
 * Purpose: Executes SystemDomainsPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function SystemDomainsPage() {
  const { t } = useTranslation()
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newDomain, setNewDomain] = useState('')
  const [saving, setSaving] = useState(false)
  const [availabilityTarget, setAvailabilityTarget] = useState<Domain | null>(null)
  const [selectedAvailability, setSelectedAvailability] = useState<DomainAvailability>('public')
  const [updatingAvailability, setUpdatingAvailability] = useState(false)

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

  /**
   * Purpose: Executes handleAdd functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleAdd = async () => {
    if (!newDomain.trim()) return
    setSaving(true)
    try {
      await apiClient.post('/domains', { domain: newDomain.trim() })
      setNewDomain('')
      setShowAddModal(false)
      fetchDomains()
      toast.success(t('Domain added successfully'))
    } catch {
      toast.error(t('Failed to add domain'))
    }
    setSaving(false)
  }

  /**
   * Purpose: Executes handleDelete functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleDelete = async (id: number) => {
    if (!confirm(t('Are you sure you want to remove this domain?'))) return
    try {
      await apiClient.delete(`/domains/${id}`)
      fetchDomains()
      toast.success(t('Domain removed'))
    } catch {
      toast.error(t('Failed to remove domain'))
    }
  }

  /**
   * Purpose: Executes openAvailabilityModal functionality.
   * Owner/Author: Syed Ashhad
   * Created: February 2026
   * Last Editor: Syed Ashhad
   * Last Updated: March 2026
   */
  const openAvailabilityModal = (domain: Domain) => {
    setAvailabilityTarget(domain)
    setSelectedAvailability(domain.availability ?? 'public')
  }

  /**
   * Purpose: Executes handleUpdateAvailability functionality.
   * Owner/Author: Syed Ashhad
   * Created: February 2026
   * Last Editor: Syed Ashhad
   * Last Updated: March 2026
   */
  const handleUpdateAvailability = async () => {
    if (!availabilityTarget) return
    setUpdatingAvailability(true)
    try {
      await apiClient.put(`/domains/${availabilityTarget.id}/update-availability`, {
        availability: selectedAvailability,
      })
      toast.success(t('Availability changed successfully'))
      setAvailabilityTarget(null)
      fetchDomains()
    } catch {
      toast.error(t('Failed to update availability'))
    }
    setUpdatingAvailability(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LottieLoader size={80} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('Domains')}</h1>
          <p className="mt-2 text-sm text-gray-600">{t('Manage custom domains for QR code pages')}</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            <svg className="-ml-0.5 mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('Add Domain')}
          </button>
        </div>
      </div>

      {/* Add Domain Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">{t('Add Custom Domain')}</h2>
            <p className="mt-1 text-sm text-gray-500">
              {t("Enter the domain you want to connect. You'll need to update DNS records after adding.")}
            </p>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">{t('Domain Name')}</label>
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
                {t('Cancel')}
              </button>
              <button
                onClick={handleAdd}
                disabled={!newDomain.trim() || saving}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? t('Adding...') : t('Add Domain')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Availability Modal */}
      {availabilityTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setAvailabilityTarget(null)} />
          <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">{t('Change Availability')}</h3>
            <p className="mt-2 text-sm text-gray-600">
              {t('Domain:')}{' '}
              <span className="font-medium text-gray-900">
                {availabilityTarget.host ?? availabilityTarget.domain}
              </span>
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {t(
                'Public domains are available for all application users. User submitted domains (other than admins) cannot be made public.'
              )}
            </p>

            <div className="mt-5 space-y-2">
              {(['public', 'private'] as DomainAvailability[]).map((value) => (
                <label
                  key={value}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                    selectedAvailability === value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="availability"
                    value={value}
                    checked={selectedAvailability === value}
                    onChange={() => setSelectedAvailability(value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {value === 'public' ? t('Public (all users)') : t('Private (domain owner)')}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setAvailabilityTarget(null)}
                disabled={updatingAvailability}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {t('Cancel')}
              </button>
              <button
                type="button"
                onClick={handleUpdateAvailability}
                disabled={updatingAvailability}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {updatingAvailability ? t('Saving...') : t('Update Availability')}
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
            <h3 className="mt-4 text-sm font-medium text-gray-900">{t('No domains configured')}</h3>
            <p className="mt-1 text-sm text-gray-500">{t('Add a custom domain to use with your QR code pages and bio links.')}</p>
            <div className="mt-6">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
              >
                {t('Add Your First Domain')}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t('ID')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t('Domain')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t('Availability')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t('Status')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t('Default?')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t('Owner')}</th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">{t('Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {domains.map((domain) => (
                    <tr key={domain.id}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{domain.id}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {domain.host ?? domain.domain}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                          domain.availability === 'private'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {domain.availability ?? 'public'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          domain.status === 'verified' ? 'bg-green-100 text-green-800'
                          : domain.status === 'pending' ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                        }`}>{domain.status}</span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          domain.is_default
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {domain.is_default ? t('Yes') : t('No')}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {domain.user?.name ?? '--'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openAvailabilityModal(domain)}
                            className="font-medium text-blue-600 hover:text-blue-500"
                            title={t('Change availability')}
                          >
                            {t('Availability')}
                          </button>
                          <button
                            onClick={() => handleDelete(domain.id)}
                            className="font-medium text-red-600 hover:text-red-500"
                          >
                            {t('Remove')}
                          </button>
                        </div>
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
                >{t('Previous')}</button>
                <span className="px-3 py-1 text-sm text-gray-600">{t('Page')} {page} {t('of')} {lastPage}</span>
                <button
                  disabled={page >= lastPage}
                  onClick={() => setPage(page + 1)}
                  className="rounded px-3 py-1 text-sm border disabled:opacity-50"
                >{t('Next')}</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
