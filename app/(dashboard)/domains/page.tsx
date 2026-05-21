'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n'
import { useRouter } from 'next/navigation'
import { useDomains } from '@/lib/hooks/queries/useDomains'
import { useDeleteDomain, useChangeDomainStatus } from '@/lib/hooks/mutations/useDomainMutations'
import { DomainList } from '@/components/features/domains/DomainList'
import { DomainStatusModal } from '@/components/features/domains/DomainStatusModal'
import type { Domain } from '@/types/entities/domain'
import Link from 'next/link'
import { LottieLoader } from '@/components/ui/lottie-loader'

/**
 * Purpose: Executes DomainsPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function DomainsPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { data, isLoading } = useDomains()
  const deleteMutation = useDeleteDomain()
  const statusMutation = useChangeDomainStatus()

  const [statusTarget, setStatusTarget] = useState<Domain | null>(null)

  const domains = data?.data ?? []

  /**
   * Purpose: Executes handleEdit functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleEdit = (domain: Domain) => {
    router.push(`/domains/${domain.id}`)
  }

  /**
   * Purpose: Executes handleDelete functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleDelete = async (domain: Domain) => {
    if (!confirm(t('Delete domain "{{domain}}"? This action cannot be undone.').replace('{{domain}}', domain.domain))) return
    await deleteMutation.mutateAsync(domain.id)
  }

  /**
   * Purpose: Executes handleStatusConfirm functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
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
          <h1 className="text-3xl font-bold text-gray-900">{t('Domains')}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {t('Manage custom domains for your QR codes')}
          </p>
        </div>
        <Link
          href="/domains/new"
          className="rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-purple-700"
        >
          {t('Add Domain')}
        </Link>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <LottieLoader size={80} />
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
