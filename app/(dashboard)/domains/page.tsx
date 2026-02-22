'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDomains } from '@/hooks/queries/useDomains'
import { useDeleteDomain, useChangeDomainStatus } from '@/hooks/mutations/useDomainMutations'
import { DomainList } from '@/components/features/domains/DomainList'
import { DomainStatusModal } from '@/components/features/domains/DomainStatusModal'
import type { Domain } from '@/types/entities/domain'
import Link from 'next/link'

export default function DomainsPage() {
  const router = useRouter()
  const { data, isLoading } = useDomains()
  const deleteMutation = useDeleteDomain()
  const statusMutation = useChangeDomainStatus()

  const [statusTarget, setStatusTarget] = useState<Domain | null>(null)

  const domains = data?.data ?? []

  const handleEdit = (domain: Domain) => {
    router.push(`/domains/${domain.id}`)
  }

  const handleDelete = async (domain: Domain) => {
    if (!confirm(`Delete domain "${domain.domain}"? This action cannot be undone.`)) return
    await deleteMutation.mutateAsync(domain.id)
  }

  const handleStatusConfirm = async () => {
    if (!statusTarget) return
    const newStatus = statusTarget.status === 'verified' ? 'failed' : 'verified'
    await statusMutation.mutateAsync({ id: statusTarget.id, status: newStatus })
    setStatusTarget(null)
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Domains</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage custom domains for your QR codes
          </p>
        </div>
        <Link
          href="/domains/new"
          className="rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-purple-700"
        >
          Add Domain
        </Link>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
        </div>
      ) : (
        <DomainList domains={domains} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {statusTarget && (
        <DomainStatusModal
          domain={statusTarget}
          open={!!statusTarget}
          onClose={() => setStatusTarget(null)}
          onConfirm={handleStatusConfirm}
          isLoading={statusMutation.isPending}
        />
      )}
    </div>
  )
}
