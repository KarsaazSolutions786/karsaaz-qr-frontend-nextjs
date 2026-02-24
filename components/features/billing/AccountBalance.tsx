'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  CurrencyDollarIcon,
  ArrowPathIcon,
  PlusIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { cn } from '@/lib/utils'

interface AccountBalanceData {
  balance: number
  currency: string
  currencySymbol: string
  formattedBalance: string
  lowBalanceThreshold?: number
  lastUpdated?: string
}

interface AccountBalanceProps {
  className?: string
  showAddButton?: boolean
  addBalanceHref?: string
  compact?: boolean
  onAddBalance?: () => void
}

// Mock API function - replace with actual API call
async function fetchAccountBalance(): Promise<AccountBalanceData> {
  const response = await fetch('/api/account/balance')
  if (!response.ok) {
    throw new Error('Failed to fetch balance')
  }
  return response.json()
}

export function AccountBalance({
  className,
  showAddButton = true,
  addBalanceHref = '/dashboard/billing/add-balance',
  compact = false,
  onAddBalance,
}: AccountBalanceProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const {
    data: balanceData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['account-balance'],
    queryFn: fetchAccountBalance,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refresh every minute
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refetch()
    } finally {
      setIsRefreshing(false)
    }
  }

  const isLowBalance =
    balanceData?.lowBalanceThreshold !== undefined &&
    balanceData.balance < balanceData.lowBalanceThreshold

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <CurrencyDollarIcon className="h-5 w-5 text-gray-500" />
        {isLoading ? (
          <span className="text-sm text-gray-400">Loading...</span>
        ) : isError ? (
          <span className="text-sm text-red-500">Error</span>
        ) : (
          <span
            className={cn(
              'text-sm font-medium',
              isLowBalance ? 'text-orange-600' : 'text-gray-900'
            )}
          >
            {balanceData?.formattedBalance ||
              `${balanceData?.currencySymbol || '$'}${balanceData?.balance.toFixed(2)}`}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={cn('rounded-lg border border-gray-200 bg-white p-4', className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">Account Balance</h3>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors"
          title="Refresh balance"
        >
          <ArrowPathIcon className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
        </button>
      </div>

      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-24 mb-3" />
          <div className="h-4 bg-gray-100 rounded w-32" />
        </div>
      ) : isError ? (
        <div className="flex items-center gap-2 text-red-600">
          <ExclamationTriangleIcon className="h-5 w-5" />
          <span className="text-sm">Failed to load balance</span>
        </div>
      ) : (
        <>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">
              {balanceData?.formattedBalance ||
                `${balanceData?.currencySymbol || '$'}${balanceData?.balance.toFixed(2)}`}
            </span>
            <span className="text-sm text-gray-500">{balanceData?.currency || 'USD'}</span>
          </div>

          {isLowBalance && (
            <div className="mt-2 flex items-center gap-1.5 text-orange-600">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <span className="text-xs">Low balance</span>
            </div>
          )}

          {balanceData?.lastUpdated && (
            <p className="mt-2 text-xs text-gray-400">
              Updated {new Date(balanceData.lastUpdated).toLocaleTimeString()}
            </p>
          )}
        </>
      )}

      {showAddButton && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          {onAddBalance ? (
            <button
              type="button"
              onClick={onAddBalance}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              Add Balance
            </button>
          ) : (
            <Link
              href={addBalanceHref}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              Add Balance
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

// Widget version for sidebar/header
interface AccountBalanceWidgetProps {
  className?: string
}

export function AccountBalanceWidget({ className }: AccountBalanceWidgetProps) {
  return <AccountBalance className={className} compact={false} showAddButton={true} />
}

// Minimal inline version
interface InlineBalanceProps {
  className?: string
  showCurrency?: boolean
}

export function InlineBalance({ className, showCurrency = false }: InlineBalanceProps) {
  const {
    data: balanceData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['account-balance'],
    queryFn: fetchAccountBalance,
    staleTime: 30 * 1000,
  })

  if (isLoading) {
    return <span className={cn('text-gray-400', className)}>...</span>
  }

  if (isError) {
    return <span className={cn('text-red-500', className)}>--</span>
  }

  return (
    <span className={cn('font-medium', className)}>
      {balanceData?.formattedBalance ||
        `${balanceData?.currencySymbol || '$'}${balanceData?.balance.toFixed(2)}`}
      {showCurrency && balanceData?.currency && (
        <span className="text-gray-500 ml-1">{balanceData.currency}</span>
      )}
    </span>
  )
}

// Hook for accessing balance data
export function useAccountBalance() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['account-balance'],
    queryFn: fetchAccountBalance,
    staleTime: 30 * 1000,
  })

  const refresh = () => {
    return queryClient.invalidateQueries({ queryKey: ['account-balance'] })
  }

  return {
    ...query,
    refresh,
    balance: query.data?.balance ?? 0,
    formattedBalance: query.data?.formattedBalance ?? '$0.00',
    currency: query.data?.currency ?? 'USD',
    isLowBalance:
      query.data?.lowBalanceThreshold !== undefined &&
      (query.data?.balance ?? 0) < query.data.lowBalanceThreshold,
  }
}

export default AccountBalance
