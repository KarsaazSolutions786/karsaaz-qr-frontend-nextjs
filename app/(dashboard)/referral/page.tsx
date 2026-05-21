'use client'

import { useTranslation } from '@/lib/i18n'
import { ReferralDashboard } from '@/components/features/referral/ReferralDashboard'
import { ReferralCodeShare } from '@/components/features/referral/ReferralCodeShare'
import { ReferralList } from '@/components/features/referral/ReferralList'

/**
 * Purpose: Executes ReferralPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function ReferralPage() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('Referral Program')}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {t('Earn commissions by referring new users to the platform.')}
          </p>
        </div>

        <ReferralDashboard />
        <ReferralCodeShare />
        <ReferralList />
      </div>
    </div>
  )
}
