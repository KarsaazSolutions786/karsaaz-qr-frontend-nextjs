'use client'

import { useState } from 'react'

type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed'

interface AbuseReport {
  id: string
  reporter: string
  reportedUrl: string
  reason: string
  status: ReportStatus
  date: string
  details: string
}

export default function AbuseReportsPage() {
  const [reports, setReports] = useState<AbuseReport[]>([])
  const [statusFilter, setStatusFilter] = useState<'all' | ReportStatus>('all')

  const filtered =
    statusFilter === 'all' ? reports : reports.filter((r) => r.status === statusFilter)

  const updateStatus = (id: string, status: ReportStatus) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    )
  }

  const statusCounts = {
    all: reports.length,
    pending: reports.filter((r) => r.status === 'pending').length,
    reviewed: reports.filter((r) => r.status === 'reviewed').length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
    dismissed: reports.filter((r) => r.status === 'dismissed').length,
  }

  const statusStyles: Record<ReportStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    reviewed: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    dismissed: 'bg-gray-100 text-gray-600',
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Abuse Reports</h1>
        <p className="mt-2 text-sm text-gray-600">Review and manage reported content</p>
      </div>

      {/* Status Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {(
            ['all', 'pending', 'reviewed', 'resolved', 'dismissed'] as const
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium capitalize ${
                statusFilter === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {tab}
              <span
                className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  statusFilter === tab
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {statusCounts[tab]}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {filtered.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <h3 className="mt-4 text-sm font-medium text-gray-900">No abuse reports</h3>
            <p className="mt-1 text-sm text-gray-500">
              {statusFilter === 'all'
                ? 'No reports have been submitted yet. All clear!'
                : `No ${statusFilter} reports found.`}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Reporter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Reported URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((report) => (
                  <tr key={report.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {report.reporter}
                    </td>
                    <td className="max-w-xs truncate px-6 py-4 text-sm text-blue-600 hover:underline">
                      <a href={report.reportedUrl} target="_blank" rel="noopener noreferrer">
                        {report.reportedUrl}
                      </a>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {report.reason}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          statusStyles[report.status]
                        }`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {report.date}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      {report.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateStatus(report.id, 'reviewed')}
                            className="mr-3 font-medium text-blue-600 hover:text-blue-500"
                          >
                            Review
                          </button>
                          <button
                            onClick={() => updateStatus(report.id, 'dismissed')}
                            className="font-medium text-gray-500 hover:text-gray-700"
                          >
                            Dismiss
                          </button>
                        </>
                      )}
                      {report.status === 'reviewed' && (
                        <button
                          onClick={() => updateStatus(report.id, 'resolved')}
                          className="font-medium text-green-600 hover:text-green-500"
                        >
                          Resolve
                        </button>
                      )}
                      {(report.status === 'resolved' || report.status === 'dismissed') && (
                        <span className="text-xs text-gray-400">No actions</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
