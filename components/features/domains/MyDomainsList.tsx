'use client'

import { useDomains } from '@/hooks/queries/useDomains'
import { useDeleteDomain, useTestDomainConnection } from '@/hooks/mutations/useDomainMutations'
import { Badge } from '@/components/ui/badge'
import type { Domain, DomainStatus } from '@/types/entities/domain'

interface MyDomainsListProps {
  onEdit?: (domain: Domain) => void
  compact?: boolean
}

const statusConfig: Record<DomainStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  verified: { label: 'Active', variant: 'default' },
  pending: { label: 'Pending', variant: 'secondary' },
  failed: { label: 'Error', variant: 'destructive' },
}

export function MyDomainsList({ onEdit, compact = true }: MyDomainsListProps) {
  const { data, isLoading } = useDomains()
  const deleteMutation = useDeleteDomain()
  const testMutation = useTestDomainConnection()
  const domains = data?.data ?? []

  const handleDelete = async (domain: Domain) => {
    if (!confirm(`Delete domain "${domain.domain}"? This cannot be undone.`)) return
    await deleteMutation.mutateAsync(domain.id)
  }

  const handleTest = async (domain: Domain) => {
    await testMutation.mutateAsync(domain.id)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-purple-200 border-t-purple-600" />
      </div>
    )
  }

  if (domains.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-gray-500">
        You do not have any domains.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700">Your Domains</h3>
      <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
        {domains.map((domain) => {
          const cfg = statusConfig[domain.status] ?? statusConfig.pending
          return (
            <li
              key={domain.id}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="truncate text-sm font-medium text-gray-900">
                  {domain.domain}
                </span>
                <Badge variant={cfg.variant}>{cfg.label}</Badge>
                {domain.isDefault && (
                  <Badge variant="outline">Default</Badge>
                )}
              </div>

              {!compact && (
                <div className="flex items-center gap-2 shrink-0">
                  {onEdit && (
                    <button
                      type="button"
                      onClick={() => onEdit(domain)}
                      className="text-xs font-medium text-purple-600 hover:text-purple-800"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleTest(domain)}
                    disabled={testMutation.isPending}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
                  >
                    Test
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(domain)}
                    disabled={deleteMutation.isPending}
                    className="text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
