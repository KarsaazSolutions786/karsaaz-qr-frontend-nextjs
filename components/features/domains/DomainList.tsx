'use client'

import type { Domain } from '@/types/entities/domain'

interface DomainListProps {
  domains: Domain[]
  onEdit: (domain: Domain) => void
  onDelete: (domain: Domain) => void
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  verified: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
}

export function DomainList({ domains, onEdit, onDelete }: DomainListProps) {
  if (domains.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-gray-500">
        <p className="text-lg font-medium">No domains yet</p>
        <p className="text-sm">Add a custom domain to get started</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Domain
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Connectivity
            </th>
            <th className="w-28 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {domains.map((domain) => {
            const allVerified = domain.dnsRecords.every((r) => r.status === 'verified' || r.status === 'valid')
            return (
              <tr key={domain.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {domain.domain}
                  {domain.isDefault && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                      Default
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[domain.status] ?? 'bg-gray-100 text-gray-800'}`}
                  >
                    {domain.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="flex items-center gap-1.5">
                    <span
                      className={`inline-block h-2.5 w-2.5 rounded-full ${allVerified ? 'bg-green-500' : 'bg-red-500'}`}
                    />
                    <span className="text-gray-600">
                      {allVerified ? 'Connected' : 'Not connected'}
                    </span>
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(domain)}
                      className="rounded px-2 py-1 text-blue-600 hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(domain)}
                      className="rounded px-2 py-1 text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
