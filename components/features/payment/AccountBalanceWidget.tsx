'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useAccountCredit } from '@/lib/hooks/useAccountCredit'

export function AccountBalanceWidget() {
  const { balance, refreshBalance } = useAccountCredit()

  useEffect(() => {
    refreshBalance()
  }, [refreshBalance])

  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
      <span className="text-gray-500">Credits:</span>
      <span className="font-semibold text-gray-900">${balance.toFixed(2)}</span>
      <Link
        href="/account-credits"
        className="ml-1 text-xs text-blue-600 hover:text-blue-700"
      >
        Add
      </Link>
    </div>
  )
}
