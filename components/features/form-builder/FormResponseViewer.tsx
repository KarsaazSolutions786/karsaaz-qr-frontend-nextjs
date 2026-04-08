'use client'

import { useState, useMemo, useCallback } from 'react'
import { useTranslation } from '@/lib/i18n'
import type { FormResponse } from './types'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { LottieLoader } from '@/components/ui/lottie-loader'

interface FormResponseViewerProps {
  responses: FormResponse[]
  onDeleteResponse?: (id: number) => Promise<void>
  loading?: boolean
}

/**
 * Displays all submissions for a form in a table view with:
 * - Individual response detail view
 * - CSV export
 * - Date filtering
 * - Delete individual responses
 */
export default function FormResponseViewer({
  responses,
  onDeleteResponse,
  loading = false,
}: FormResponseViewerProps) {
  const { t } = useTranslation();
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // Extract column headers from the first response
  const columns = useMemo(() => {
    if (responses.length === 0) return []
    const firstResponse = responses[0]!
    return firstResponse.fields.map((f) => f.name)
  }, [responses])

  // Filter by date range
  const filteredResponses = useMemo(() => {
    return responses.filter((response) => {
      const responseDate = new Date(response.createdAt)

      if (dateFrom) {
        const from = new Date(dateFrom)
        from.setHours(0, 0, 0, 0)
        if (responseDate < from) return false
      }

      if (dateTo) {
        const to = new Date(dateTo)
        to.setHours(23, 59, 59, 999)
        if (responseDate > to) return false
      }

      return true
    })
  }, [responses, dateFrom, dateTo])

  const handleDelete = useCallback(
    async (id: number) => {
      if (!onDeleteResponse) return

      const confirmed = window.confirm('Are you sure you want to delete this response?')
      if (!confirmed) return

      setDeletingId(id)
      try {
        await onDeleteResponse(id)
        if (selectedResponse?.id === id) {
          setSelectedResponse(null)
        }
      } catch (err) {
        console.error('Failed to delete response:', err)
      } finally {
        setDeletingId(null)
      }
    },
    [onDeleteResponse, selectedResponse]
  )

  const exportCsv = useCallback(() => {
    if (filteredResponses.length === 0) return

    const headers = ['#', 'Date', ...columns]
    const rows = filteredResponses.map((response, index) => {
      const fieldValues = columns.map((colName) => {
        const field = response.fields.find((f) => f.name === colName)
        return field?.value || ''
      })
      return [
        String(index + 1),
        new Date(response.createdAt).toLocaleString(),
        ...fieldValues,
      ]
    })

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => {
            // Escape double quotes and wrap in quotes if contains comma/newline
            const escaped = cell.replace(/"/g, '""')
            return /[,\n"]/.test(cell) ? `"${escaped}"` : escaped
          })
          .join(',')
      )
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    const now = new Date()
    link.download = `form-responses-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [filteredResponses, columns])

  // Detail view for a single response
  if (selectedResponse) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSelectedResponse(null)}
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('Back to list')}
          </button>
          <span className="text-sm text-gray-500">
            {t('Submitted:')} {new Date(selectedResponse.createdAt).toLocaleString()}
          </span>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('Response')} #{selectedResponse.id}
            </h3>
          </div>
          <div className="divide-y divide-gray-100 px-6">
            {selectedResponse.fields.map((field, index) => (
              <div key={index} className="flex gap-4 py-4">
                <div className="w-40 shrink-0">
                  <p className="text-sm font-medium text-gray-500">{field.name}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {field.value || '-'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="space-y-3 text-center">
          <LottieLoader size={80} className="mx-auto" />
          <p className="text-sm text-gray-500">{t('Loading responses...')}</p>
        </div>
      </div>
    )
  }

  // Empty state
  if (responses.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <div className="mb-3 text-4xl text-gray-300">&#128203;</div>
        <p className="text-sm text-gray-500">{t('No responses yet')}</p>
        <p className="text-xs text-gray-400 mt-1">{t('Responses will appear here once the form is submitted')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">{t('Filter by date:')}</span>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-40"
            placeholder="From"
          />
          <span className="text-sm text-gray-500">{t('to')}</span>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-40"
            placeholder="To"
          />
          {(dateFrom || dateTo) && (
            <button
              type="button"
              onClick={() => {
                setDateFrom('')
                setDateTo('')
              }}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              {t('Clear')}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {filteredResponses.length} response{filteredResponses.length !== 1 ? 's' : ''}
          </span>
          <button
            type="button"
            onClick={exportCsv}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {t('Export CSV')}
          </button>
        </div>
      </div>

      {/* Response Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('Date')}
              </th>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('Actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredResponses.map((response, index) => (
              <tr
                key={response.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedResponse(response)}
              >
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                  {new Date(response.createdAt).toLocaleDateString()}
                </td>
                {columns.map((col) => {
                  const field = response.fields.find((f) => f.name === col)
                  return (
                    <td
                      key={col}
                      className="max-w-[200px] truncate px-4 py-3 text-sm text-gray-900"
                    >
                      {field?.value || '-'}
                    </td>
                  )
                })}
                <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(response.id)
                    }}
                    disabled={deletingId === response.id}
                    className={cn(
                      'text-red-600 hover:text-red-700',
                      deletingId === response.id && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {deletingId === response.id ? t('Deleting...') : t('Delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredResponses.length === 0 && responses.length > 0 && (
        <div className="py-8 text-center">
          <p className="text-sm text-gray-500">{t('No responses match the selected date range')}</p>
        </div>
      )}
    </div>
  )
}
