'use client'

import React from 'react'
import Link from 'next/link'
import { Bars3Icon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useTranslation } from '@/lib/i18n'
import { LanguagePicker } from '@/components/common/LanguagePicker'
import { GlobalSearch } from '@/components/common/GlobalSearch'
import { AccountBalanceWidget } from '@/components/features/payment/AccountBalanceWidget'

interface DashboardHeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  isAccountCreditMode: boolean
}

/**
 * Purpose: Executes DashboardHeader functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function DashboardHeader({
  sidebarOpen,
  setSidebarOpen,
  isAccountCreditMode,
}: DashboardHeaderProps) {
  const { t } = useTranslation()

  return (
    <>
      {/* Mobile header */}
      <div className="sticky top-0 z-10 flex h-14 items-center gap-x-5 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 shadow-sm lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="-m-2.5 p-2.5 text-gray-700"
          aria-label="Toggle navigation menu"
          aria-expanded={sidebarOpen}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        <div className="flex-1">
          <GlobalSearch />
        </div>
        {isAccountCreditMode && <AccountBalanceWidget />}
        <LanguagePicker />
        <Link
          href="/account"
          className="flex items-center gap-1.5 rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors"
          title={t('My Account')}
        >
          <UserCircleIcon className="h-6 w-6" />
        </Link>
      </div>

      {/* Desktop header bar */}
      <div className="hidden lg:flex sticky top-0 z-10 h-14 items-center gap-x-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 shadow-sm">
        <div className="flex-1">
          <GlobalSearch />
        </div>
        {isAccountCreditMode && <AccountBalanceWidget />}
        <LanguagePicker />
        <Link
          href="/account"
          className="flex items-center gap-1.5 rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors"
          title={t('My Account')}
        >
          <UserCircleIcon className="h-6 w-6" />
        </Link>
      </div>
    </>
  )
}
