'use client'

import { useState, useMemo } from 'react'
import { useLeadForms, useLeadFormResponses } from '@/lib/hooks/queries/useLeadForms'
import { useDeleteLeadFormResponse } from '@/lib/hooks/mutations/useLeadFormMutations'
import type { LeadForm, LeadFormResponse, LeadFormResponseField } from '@/types/entities/lead-form'

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

function todayFilename(): string {
  const d = new Date()
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `responses-${dd}-${mm}-${d.getFullYear()}.csv`
}

// ─── Responses viewer (one per card) ─────────────────────────────────────────

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

function LeadFormResponsesViewer({ formId }: ResponsesViewerProps) {
  const [keyword, setKeyword] = useState('')
  const deleteMutation = useDeleteLeadFormResponse()
  const { data, isLoading } = useLeadFormResponses(formId)

  const responses: LeadFormResponse[] = data?.data ?? []

  const filtered = useMemo(() => {
    if (!keyword.trim()) return responses
    const re = new RegExp(keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    return responses.filter((r) =>
      getFields(r).some((f) => re.test(String(f.value ?? '')))
    )
  }, [responses, keyword])

  const handleExportCsv = () => {
    if (responses.length === 0) return
    const headers = getFields(responses[0]).map((f) => f.question)
    const rows = responses.map((r) => getFields(r).map((f) => f.value))
    const csv = arrayToCsv([headers, ...rows])
    downloadCsv(csv, todayFilename())
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
        <input
          type="search"
          placeholder="Search responses…"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="block w-full max-w-xs rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {responses.length > 0 && (
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        )}
      </div>

      {/* Scrollable responses list */}
      {filtered.length === 0 ? (
        <p className="py-4 text-sm text-gray-400 italic">
          {responses.length === 0 ? 'No responses yet.' : 'No responses match your search.'}
        </p>
      ) : (
        <div className="overflow-y-auto max-h-[300px] space-y-3 pr-1">
          {filtered.map((response, idx) => {
            const fields = getFields(response)
            return (
              <div
                key={response.id}
                className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm"
              >
                {/* Response header row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                      #{idx + 1}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {new Date(response.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(response.id)}
                    disabled={deleteMutation.isPending}
                    className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>

                {/* Field pairs */}
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                  {fields.map((field, fi) => (
                    <>
                      <dt key={`q-${fi}`} className="font-medium text-gray-600 whitespace-nowrap">
                        {field.question}
                      </dt>
                      <dd key={`v-${fi}`} className="text-gray-800 break-words">
                        {field.value !== null && field.value !== undefined && field.value !== ''
                          ? String(field.value)
                          : <span className="italic text-gray-400">—</span>}
                      </dd>
                    </>
                  ))}
                </dl>
              </div>
            )
          })}
        </div>
      )}

      {/* Footer count */}
      <p className="mt-2 text-xs text-gray-400">
        Total {responses.length} response{responses.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}

// ─── Individual form card ─────────────────────────────────────────────────────

interface FormCardProps {
  form: LeadForm
}

function LeadFormCard({ form }: FormCardProps) {
  const title = form.qrcode_name ?? `Lead Form #${form.id} - QR Code Not Found`

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="border-b border-gray-100 bg-gray-50 px-5 py-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Created {new Date(form.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span className="text-xs text-gray-500">
          {form.responseCount ?? 0} response{(form.responseCount ?? 0) !== 1 ? 's' : ''} total
        </span>
      </div>

      {/* Responses viewer */}
      <div className="px-5 py-4">
        <LeadFormResponsesViewer formId={form.id} />
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LeadFormsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useLeadForms({ page })

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header — no Create button */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Lead Forms</h1>
        <p className="mt-2 text-sm text-gray-600">
          View and manage lead form responses collected from your QR codes.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          <p className="mt-3 text-sm text-gray-500">Loading lead forms…</p>
        </div>
      ) : data && data.data.length > 0 ? (
        <>
          <div className="space-y-6">
            {data.data.map((form: LeadForm) => (
              <LeadFormCard key={form.id} form={form} />
            ))}
          </div>

          {/* Pagination */}
          {data.pagination && data.pagination.lastPage > 1 && (
            <div className="mt-8 flex items-center justify-between">
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
        </>
      ) : (
        <div className="text-center py-16">
          <svg
            className="mx-auto h-12 w-12 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-3 text-sm font-medium text-gray-900">No lead forms found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Lead forms are created when setting up a QR code.
          </p>
        </div>
      )}
    </div>
  )
}
