'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useDomain } from '@/hooks/queries/useDomains'
import {
  useUpdateDomain,
  useTestDomainConnection,
} from '@/hooks/mutations/useDomainMutations'
import { DomainForm } from '@/components/features/domains/DomainForm'
import { DomainConnectivityTest } from '@/components/features/domains/DomainConnectivityTest'
import type { DomainConnectivity } from '@/types/entities/domain'
import Link from 'next/link'

export default function EditDomainPage() {
  const { id } = useParams<{ id: string }>()
  const { data: domain, isLoading } = useDomain(id)
  const updateMutation = useUpdateDomain()
  const testMutation = useTestDomainConnection()

  const [connectivity, setConnectivity] = useState<DomainConnectivity | null>(null)

  const handleTest = async () => {
    const result = await testMutation.mutateAsync(id)
    setConnectivity(result)
  }

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
      </div>
    )
  }

  if (!domain) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-gray-500">Domain not found.</p>
        <Link href="/domains" className="mt-2 text-sm text-blue-600 hover:underline">
          ← Back to Domains
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
          ← Back to Domains
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Edit Domain</h1>
        <p className="mt-2 text-sm text-gray-600">
          Update settings for <span className="font-medium">{domain.domain}</span>
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Domain Settings</h2>
          <DomainForm
            defaultValues={{ domain: domain.domain }}
            onSubmit={async (data) => { await updateMutation.mutateAsync({ id, data }) }}
            isLoading={updateMutation.isPending}
          />
        </div>

        <DomainConnectivityTest
          connectivity={currentConnectivity}
          onTest={handleTest}
          isTesting={testMutation.isPending}
        />
      </div>
    </div>
  )
}
