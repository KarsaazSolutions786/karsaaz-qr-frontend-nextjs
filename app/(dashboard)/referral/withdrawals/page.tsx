'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n'
import { WithdrawalRequestForm } from '@/components/features/referral/WithdrawalRequestForm'
import { WithdrawalHistory } from '@/components/features/referral/WithdrawalHistory'

/**
 * Purpose: Executes WithdrawalsPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function WithdrawalsPage() {
  const { t } = useTranslation()
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('Withdrawals')}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {t('Request withdrawals and view your withdrawal history.')}
          </p>
        </div>

        <WithdrawalRequestForm onSuccess={() => setRefreshKey((k) => k + 1)} />
        <WithdrawalHistory refreshKey={refreshKey} />
      </div>
    </div>
  )
}
