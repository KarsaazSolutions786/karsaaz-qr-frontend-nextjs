'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { useDeleteLeadFormResponse } from '@/lib/hooks/mutations/useLeadFormMutations'
import { useQRCode } from '@/lib/hooks/queries/useQRCode'
import { leadFormsAPI } from '@/lib/api/endpoints/lead-forms'
import { queryKeys } from '@/lib/query/keys'
import type { LeadFormResponse, LeadFormResponseField } from '@/types/entities/lead-form'
import { useTranslation } from '@/lib/i18n'
import { LottieLoader } from '@/components/ui/lottie-loader'
import {
  ChevronLeftIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  CalendarIcon,
  FunnelIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline'

// ---------- CSV helpers ----------

function escapeCsvCell(val: string | number | null | undefined): string {
  const str = String(val ?? '')
  return `"${str.replace(/"/g, '""')}"`
}

function downloadCsv(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ---------- Field extraction ----------

function getFields(response: LeadFormResponse): LeadFormResponseField[] {
  if (response.fields && response.fields.length > 0) return response.fields
  return Object.entries(response.data).map(([k, v]) => ({
    question: k,
    value: v as string | number | null,
  }))
}

// ---------- Date range helpers ----------

function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function endOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

// ---------- Main page ----------

export default function FormResponsesPage({ params }: { params: { id: string } }) {
  const { t } = useTranslation()
  const qrCodeId = params.id

  // Fetch QR code details to get the lead form info
  const { data: qrcode, isLoading: qrLoading } = useQRCode(qrCodeId)

  // Extract lead form id from QR code data.
  // The data.formId or data.lead_form_id field should contain the associated lead form id.
  const leadFormId = useMemo(() => {
    if (!qrcode?.data) return null
    const data = qrcode.data as unknown as Record<string, unknown>
    const id = data.formId ?? data.lead_form_id ?? data.leadFormId ?? null
    return id ? Number(id) : null
  }, [qrcode])

  // Pagination
  const [page, setPage] = useState(1)

  // Fetch responses
  const { data: responsesData, isLoading: responsesLoading } = useQuery({
    queryKey: queryKeys.leadForms.responses(leadFormId ?? undefined, { page }),
    queryFn: () => leadFormsAPI.getResponses(leadFormId!, { page }),
    enabled: !!leadFormId,
    staleTime: 30000,
  })

  const deleteMutation = useDeleteLeadFormResponse()

  // Filters
  const [keyword, setKeyword] = useState('')
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)

  const allResponses: LeadFormResponse[] = responsesData?.data ?? []

  // Filter by keyword and date range (client-side, since we already have the page)
  const filtered = useMemo(() => {
    let results = allResponses

    // Keyword filter
    if (keyword.trim()) {
      const re = new RegExp(keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
      results = results.filter(r =>
        getFields(r).some(f => re.test(String(f.value ?? '')))
      )
    }

    // Date range filter
    if (dateFrom) {
      const from = startOfDay(new Date(dateFrom))
      results = results.filter(r => new Date(r.createdAt) >= from)
    }
    if (dateTo) {
      const to = endOfDay(new Date(dateTo))
      results = results.filter(r => new Date(r.createdAt) <= to)
    }

    return results
  }, [allResponses, keyword, dateFrom, dateTo])

  // Derive column headers from the first response
  const columns = useMemo(() => {
    if (allResponses.length === 0) return []
    const first = allResponses[0]
    if (!first) return []
    return getFields(first).map(f => f.question)
  }, [allResponses])

  // CSV export
  const handleExportCsv = useCallback(() => {
    if (filtered.length === 0) return
    const headers = [...columns, 'Submitted At', 'IP Address', 'Source']
    const rows = filtered.map(r => {
      const fields = getFields(r)
      const fieldValues = columns.map(col => {
        const match = fields.find(f => f.question === col)
        return match ? match.value : null
      })
      return [
        ...fieldValues,
        new Date(r.createdAt).toLocaleString(),
        r.ipAddress,
        r.source,
      ]
    })
    const csvLines = [
      headers.map(h => escapeCsvCell(h)).join(','),
      ...rows.map(row => row.map(v => escapeCsvCell(v)).join(',')),
    ]
    const date = new Date().toISOString().slice(0, 10)
    downloadCsv(csvLines.join('\n'), `form-responses-${qrCodeId}-${date}.csv`)
  }, [filtered, columns, qrCodeId])

  const handleDelete = async (responseId: number) => {
    if (!window.confirm(t('Delete this response? This cannot be undone.'))) return
    await deleteMutation.mutateAsync(responseId)
  }

  const pagination = responsesData?.pagination

  const isLoading = qrLoading || responsesLoading

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link and header */}
      <div className="mb-6">
        <Link
          href={`/qrcodes/${qrCodeId}`}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-3"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          {t('Back to QR Code')}
        </Link>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('Form Responses')}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {qrcode ? qrcode.name : t('Loading...')}
              {allResponses.length > 0 && (
                <span className="ml-2 text-gray-400">
                  ({allResponses.length} response{allResponses.length !== 1 ? 's' : ''} on this page)
                </span>
              )}
            </p>
          </div>
          {filtered.length > 0 && (
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              {t('Export CSV')}
            </button>
          )}
        </div>
      </div>

      {/* No lead form associated */}
      {!isLoading && !leadFormId && (
        <div className="text-center py-16">
          <TableCellsIcon className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-3 text-sm font-medium text-gray-900">{t('No lead form found')}</h3>
          <p className="mt-1 text-sm text-gray-500">
            {t('This QR code does not have a lead form associated with it. Form responses are only available for lead-form type QR codes.')}
          </p>
          <Link
            href={`/qrcodes/${qrCodeId}`}
            className="mt-4 inline-block text-sm text-indigo-600 hover:text-indigo-500"
          >
            {t('Go back')}
          </Link>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <LottieLoader size={80} />
        </div>
      )}

      {/* Main content */}
      {!isLoading && leadFormId && (
        <>
          {/* Toolbar */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder={t('Search responses...')}
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                className="block w-full rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Filter toggle */}
            <button
              type="button"
              onClick={() => setShowFilters(prev => !prev)}
              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                showFilters
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FunnelIcon className="h-4 w-4" />
              {t('Filters')}
            </button>
          </div>

          {/* Filter row */}
          {showFilters && (
            <div className="mb-4 flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  <CalendarIcon className="inline h-3.5 w-3.5 mr-1" />
                  {t('From')}
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  <CalendarIcon className="inline h-3.5 w-3.5 mr-1" />
                  {t('To')}
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={e => setDateTo(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              {(dateFrom || dateTo) && (
                <button
                  type="button"
                  onClick={() => {
                    setDateFrom('')
                    setDateTo('')
                  }}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  {t('Clear dates')}
                </button>
              )}
            </div>
          )}

          {/* Empty state */}
          {allResponses.length === 0 && (
            <div className="text-center py-16">
              <TableCellsIcon className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-3 text-sm font-medium text-gray-900">{t('No responses yet')}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {t('When users submit the form linked to this QR code, their responses will appear here.')}
              </p>
            </div>
          )}

          {/* Responses table */}
          {allResponses.length > 0 && (
            <>
              {filtered.length === 0 ? (
                <div className="text-center py-12 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-500">{t('No responses match your filters.')}</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          #
                        </th>
                        {columns.map(col => (
                          <th
                            key={col}
                            className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                          >
                            {col}
                          </th>
                        ))}
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          {t('Submitted')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          {t('Source')}
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                          {t('Actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filtered.map((response, idx) => {
                        const fields = getFields(response)
                        return (
                          <tr key={response.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                              {idx + 1 + (page - 1) * (pagination?.perPage ?? 15)}
                            </td>
                            {columns.map(col => {
                              const match = fields.find(f => f.question === col)
                              const val = match?.value
                              return (
                                <td
                                  key={col}
                                  className="px-4 py-3 text-sm text-gray-900 max-w-[200px] truncate"
                                  title={String(val ?? '')}
                                >
                                  {val !== null && val !== undefined && val !== ''
                                    ? String(val)
                                    : <span className="text-gray-400 italic">--</span>}
                                </td>
                              )
                            })}
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {new Date(response.createdAt).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {response.source || '--'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right">
                              <button
                                onClick={() => handleDelete(response.id)}
                                disabled={deleteMutation.isPending}
                                className="inline-flex items-center gap-1 rounded p-1 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                                title={t('Delete response')}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.lastPage > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t('Previous')}
                  </button>
                  <span className="text-sm text-gray-600">
                    {t('Page')} {page} {t('of')} {pagination.lastPage}
                    <span className="ml-2 text-gray-400">
                      ({pagination.total} total)
                    </span>
                  </span>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page >= pagination.lastPage}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t('Next')}
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
