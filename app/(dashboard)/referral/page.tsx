'use client'

import { ReferralDashboard } from '@/components/features/referral/ReferralDashboard'
import { ReferralCodeShare } from '@/components/features/referral/ReferralCodeShare'
import { ReferralList } from '@/components/features/referral/ReferralList'

export default function ReferralPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Referral Program</h1>
          <p className="mt-2 text-sm text-gray-600">
            Earn commissions by referring new users to the platform.
          </p>
        </div>

        <ReferralDashboard />
        <ReferralCodeShare />
        <ReferralList />
      </div>
    </div>
  )
}
