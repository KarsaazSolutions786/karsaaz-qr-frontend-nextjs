'use client'

import Link from 'next/link'
import { Wallet } from 'lucide-react'
import { useAccountCredit } from '@/lib/hooks/useAccountCredit'
import { useTranslation } from '@/lib/i18n'

/**
 * Compact widget showing the user's current credit balance.
 * Displayed in the dashboard header when account-credit billing mode is active.
 * The balance is derived from the user object (populated by GET /api/myself)
 * so no additional API call is needed.
 */
export function AccountBalanceWidget() {
  const { balance, isAccountCreditMode } = useAccountCredit()
  const { t } = useTranslation()

  // Don't render if not in credit mode
  if (!isAccountCreditMode) return null

  return (
    <Link
      href="/account-credits"
      className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm transition-colors hover:bg-gray-50"
    >
      <Wallet className="h-3.5 w-3.5 text-blue-600" />
      <span className="text-gray-500">{t('Credits:')}</span>
      <span className="font-semibold text-gray-900">${balance.toFixed(2)}</span>
    </Link>
  )
}
