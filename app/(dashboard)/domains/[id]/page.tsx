'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n'
import { useParams } from 'next/navigation'
import { useDomain } from '@/lib/hooks/queries/useDomains'
import {
  useUpdateDomain,
  useTestDomainConnection,
  useChangeDomainAvailability,
  useSetDefaultDomain,
} from '@/lib/hooks/mutations/useDomainMutations'
import { DomainForm } from '@/components/features/domains/DomainForm'
import { DomainConnectivityTest } from '@/components/features/domains/DomainConnectivityTest'
import { DomainVisibilityModal } from '@/components/features/domains/DomainVisibilityModal'
import type { DomainConnectivity, DomainAvailability } from '@/types/entities/domain'
import { toast } from 'sonner'
import Link from 'next/link'
import { LottieLoader } from '@/components/ui/lottie-loader'

/**
 * Purpose: Executes EditDomainPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function EditDomainPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { data: domain, isLoading, refetch } = useDomain(id)
  const updateMutation = useUpdateDomain()
  const testMutation = useTestDomainConnection()
  const availabilityMutation = useChangeDomainAvailability()
  const setDefaultMutation = useSetDefaultDomain()

  const [connectivity, setConnectivity] = useState<DomainConnectivity | null>(null)
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false)

  /**
   * Purpose: Executes handleTest functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleTest = async () => {
    const result = await testMutation.mutateAsync(id)
    setConnectivity(result)
  }

  /**
   * Purpose: Executes handleAvailabilityChange functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
  const handleAvailabilityChange = async (availability: DomainAvailability) => {
    await availabilityMutation.mutateAsync({ id, availability })
    toast.success(t('Availability changed successfully'))
    setShowAvailabilityModal(false)
    refetch()
  }

  /**
   * Purpose: Executes handleSetDefault functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
  const handleSetDefault = async () => {
    if (!confirm(t('Are you sure you want to set this domain as the default domain for all new QR codes?'))) return
    await setDefaultMutation.mutateAsync(id)
    toast.success(t('Domain has been set as the default domain'))
    refetch()
  }

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <LottieLoader size={80} />
      </div>
    )
  }

  if (!domain) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-gray-500">{t('Domain not found.')}</p>
        <Link href="/domains" className="mt-2 text-sm text-blue-600 hover:underline">
          {t('Back to Domains')}
        </Link>
      </div>
    )
  }

  // Build connectivity from domain data if not yet tested
  const currentConnectivity: DomainConnectivity = connectivity ?? {
    is_connected: domain.status === 'verified',
    dns_records: domain.dnsRecords ?? [],
    ssl_status: domain.status === 'verified' ? 'active' : 'pending',
    last_checked_at: domain.verifiedAt ?? '',
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/domains"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {t('Back to Domains')}
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">{t('Edit Domain')}</h1>
        <p className="mt-2 text-sm text-gray-600">
          {t('Update settings for')} <span className="font-medium">{domain.domain}</span>
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Domain Settings */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('Domain Settings')}</h2>
            <DomainForm
              defaultValues={{ domain: domain.domain }}
              onSubmit={async (data) => { await updateMutation.mutateAsync({ id, data }) }}
              isLoading={updateMutation.isPending}
            />
          </div>

          {/* Domain Actions Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('Domain Actions')}</h2>
            <div className="space-y-4">
              {/* Availability */}
              <div className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 p-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">{t('Availability')}</p>
                  <p className="text-sm text-gray-500">
                    {domain.availability === 'private'
                      ? t('Private (domain owner)')
                      : t('Public (all users)')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAvailabilityModal(true)}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {t('Change')}
                </button>
              </div>

              {/* Is Default */}
              <div className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 p-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">{t('Default Domain')}</p>
                  <p className="text-sm text-gray-500">
                    {domain.isDefault ? t('Yes') : t('No')}
                  </p>
                </div>
                {!domain.isDefault && (
                  <button
                    type="button"
                    onClick={handleSetDefault}
                    disabled={setDefaultMutation.isPending}
                    className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {setDefaultMutation.isPending
                      ? t('Setting...')
                      : t('Set as Default')}
                  </button>
                )}
              </div>

              {/* Status */}
              <div className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 p-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">{t('Status')}</p>
                  <p className="text-sm text-gray-500 capitalize">{domain.status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connectivity Test */}
        <DomainConnectivityTest
          connectivity={currentConnectivity}
          onTest={handleTest}
          isTesting={testMutation.isPending}
        />
      </div>

      {/* Availability Modal */}
      {showAvailabilityModal && (
        <DomainVisibilityModal
          domain={domain}
          open={showAvailabilityModal}
          onClose={() => setShowAvailabilityModal(false)}
          onConfirm={handleAvailabilityChange}
          isLoading={availabilityMutation.isPending}
        />
      )}
    </div>
  )
}
