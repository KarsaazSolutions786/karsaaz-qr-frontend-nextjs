'use client'

import { useState, useMemo } from 'react'
import { useLeadFormResponses } from '@/lib/hooks/queries/useLeadForms'
import { useDeleteLeadFormResponse } from '@/lib/hooks/mutations/useLeadFormMutations'
import type { LeadFormResponse, LeadFormResponseField } from '@/types/entities/lead-form'
import { ChevronDown, ChevronRight, Download, Search, Trash2 } from 'lucide-react'

// ─── CSV helpers ─────────────────────────────────────────────────────────────

function arrayToCsv(rows: (string | number | null)[][]): string {
  return rows
    .map((row) =>
      row.map((val) => `"${String(val ?? '').replace(/"/g, '""')}"`).join(',')
    )
    .join('\n')
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

// ─── Component ───────────────────────────────────────────────────────────────

interface ResponsesViewerProps {
  formId: number
}

function getFields(response: LeadFormResponse): LeadFormResponseField[] {
  if (response.fields && response.fields.length > 0) return response.fields
  return Object.entries(response.data).map(([k, v]) => ({
    question: k,
    value: v as string | number | null,
  }))
}

export default function ResponsesViewer({ formId }: ResponsesViewerProps) {
  const [keyword, setKeyword] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const deleteMutation = useDeleteLeadFormResponse()
  const { data, isLoading } = useLeadFormResponses(formId)

  const responses: LeadFormResponse[] = data?.data ?? []

  const filtered = useMemo(() => {
    let list = responses

    // Date range filter
    if (dateFrom) {
      const from = new Date(dateFrom)
      list = list.filter((r) => new Date(r.createdAt) >= from)
    }
    if (dateTo) {
      const to = new Date(dateTo)
      to.setHours(23, 59, 59, 999)
      list = list.filter((r) => new Date(r.createdAt) <= to)
    }

    // Keyword filter
    if (keyword.trim()) {
      const re = new RegExp(
        keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'i'
      )
      list = list.filter((r) =>
        getFields(r).some((f) => re.test(String(f.value ?? '')))
      )
    }

    return list
  }, [responses, keyword, dateFrom, dateTo])

  const handleExportCsv = () => {
    if (filtered.length === 0) return
    const firstResponse = filtered[0]
    if (!firstResponse) return
    const headers = ['#', 'Date', ...getFields(firstResponse).map((f) => f.question)]
    const rows = filtered.map((r, i) => [
      i + 1,
      new Date(r.createdAt).toLocaleString(),
      ...getFields(r).map((f) => f.value),
    ])
    const csv = arrayToCsv([headers, ...rows])
    const d = new Date()
    const filename = `responses-${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}.csv`
    downloadCsv(csv, filename)
  }

  const handleDelete = async (responseId: number) => {
    if (!confirm('Delete this response? This cannot be undone.')) return
    await deleteMutation.mutateAsync(responseId)
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-4 text-sm text-gray-500">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
        Loading responses…
      </div>
    )
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search responses…"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="block w-full rounded-md border border-gray-300 pl-9 pr-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>

        {/* Date range filters */}
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          title="From date"
        />
        <span className="text-gray-400 text-xs">to</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          title="To date"
        />

        {filtered.length > 0 && (
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        )}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <p className="py-4 text-sm text-gray-400 italic">
          {responses.length === 0
            ? 'No responses yet.'
            : 'No responses match your filters.'}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-8 px-3 py-2" />
                <th className="px-3 py-2 text-left font-medium text-gray-600">
                  #
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">
                  Date
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">
                  Summary
                </th>
                <th className="px-3 py-2 text-right font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((response, idx) => {
                const fields = getFields(response)
                const isExpanded = expandedId === response.id
                const summary = fields
                  .slice(0, 2)
                  .map((f) => `${f.question}: ${f.value ?? '—'}`)
                  .join(' | ')

                return (
                  <>
                    <tr
                      key={response.id}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() =>
                        setExpandedId(isExpanded ? null : response.id)
                      }
                    >
                      <td className="px-3 py-2">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                      </td>
                      <td className="px-3 py-2 font-medium text-gray-500">
                        {idx + 1}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-600">
                        {new Date(response.createdAt).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-gray-700 truncate max-w-xs">
                        {summary}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(response.id)
                          }}
                          disabled={deleteMutation.isPending}
                          className="text-red-500 hover:text-red-700 disabled:opacity-50"
                          aria-label="Delete response"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${response.id}-detail`}>
                        <td colSpan={5} className="bg-gray-50 px-6 py-4">
                          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                            {fields.map((field, fi) => (
                              <div key={fi} className="contents">
                                <dt className="font-medium text-gray-600 whitespace-nowrap">
                                  {field.question}
                                </dt>
                                <dd className="text-gray-800 break-words">
                                  {field.value !== null &&
                                  field.value !== undefined &&
                                  field.value !== ''
                                    ? String(field.value)
                                    : '—'}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer count */}
      <p className="mt-2 text-xs text-gray-400">
        Showing {filtered.length} of {responses.length} response
        {responses.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}
