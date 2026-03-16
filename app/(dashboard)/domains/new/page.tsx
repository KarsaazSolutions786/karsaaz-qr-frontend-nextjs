'use client'

import { useTranslation } from '@/lib/i18n'
import { useCreateDomain } from '@/lib/hooks/mutations/useDomainMutations'
import { DomainForm } from '@/components/features/domains/DomainForm'
import Link from 'next/link'

export default function NewDomainPage() {
  const { t } = useTranslation()
  const createMutation = useCreateDomain()

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/domains"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {t('Back to Domains')}
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">{t('Add Domain')}</h1>
        <p className="mt-2 text-sm text-gray-600">
          {t('Connect a custom domain to your QR codes')}
        </p>
      </div>

      <div className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <DomainForm
          onSubmit={async (data) => { await createMutation.mutateAsync(data) }}
          isLoading={createMutation.isPending}
        />
      </div>
    </div>
  )
}
