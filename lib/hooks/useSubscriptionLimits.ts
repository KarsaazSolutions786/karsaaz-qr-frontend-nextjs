'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSubscription } from '@/lib/hooks/useSubscription'
import { useAccountCredit } from '@/lib/hooks/useAccountCredit'
import { useGuest } from '@/lib/hooks/useGuest'
import { getUserStats } from '@/lib/api/sidebar'
import { queryKeys } from '@/lib/query/keys'

interface SubscriptionLimitsResult {
  isLoading: boolean
  canCreateQR: boolean
  canScan: boolean
  plan: {
    name: string
    number_of_dynamic_qrcodes: number
    number_of_scans: number
  } | null
  usage: {
    totalQRCodes: number
    totalScans: number
  }
  limits: {
    maxQRCodes: number
    maxScans: number
  }
  upgradeReason: string
  showUpgradeModal: boolean
  setShowUpgradeModal: (open: boolean) => void
  isAccountCreditMode: boolean
}

export function useSubscriptionLimits(): SubscriptionLimitsResult {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const { isGuest, sessionLimits } = useGuest()

  const {
    plan,
    isLoading: isSubLoading,
    isUserSubscribed,
  } = useSubscription()

  const {
    isAccountCreditMode,
    balance,
    dynamicQRPrice,
    staticQRPrice,
  } = useAccountCredit()

  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: [...queryKeys.qrcodes.all(), 'usage-stats'],
    queryFn: getUserStats,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 1,
    enabled: !isGuest && typeof window !== 'undefined' && !!(localStorage.getItem('logged_in') || localStorage.getItem('token')),
  })

  const totalQRCodes = stats?.dynamic_qrcodes_count ?? 0
  const totalScans = stats?.total_scans ?? 0

  const maxQRCodes = plan?.number_of_dynamic_qrcodes ?? 0
  const maxScans = plan?.number_of_scans ?? 0

  const isLoading = isSubLoading || isStatsLoading

  const { canCreateQR, upgradeReason } = useMemo(() => {
    if (isLoading) return { canCreateQR: true, upgradeReason: '' }
    if (isGuest) {
      if (sessionLimits && sessionLimits.qrcodes.remaining <= 0) {
        return {
          canCreateQR: false,
          upgradeReason: 'You have reached the guest QR code limit. Sign up for a free account to create more.',
        }
      }
      return { canCreateQR: true, upgradeReason: '' }
    }

    if (isAccountCreditMode) {
      const cheapestPrice = Math.min(
        dynamicQRPrice > 0 ? dynamicQRPrice : Infinity,
        staticQRPrice > 0 ? staticQRPrice : Infinity,
      )
      if (!isFinite(cheapestPrice) || cheapestPrice <= 0) {
        return { canCreateQR: true, upgradeReason: '' }
      }
      if (balance < cheapestPrice) {
        return {
          canCreateQR: false,
          upgradeReason: `Your credit balance ($${balance.toFixed(2)}) is too low to create any QR code. The minimum price is $${cheapestPrice.toFixed(2)}.`,
        }
      }
      return { canCreateQR: true, upgradeReason: '' }
    }

    if (!isUserSubscribed()) {
      return {
        canCreateQR: false,
        upgradeReason: 'Your subscription has expired. Please renew or upgrade to create QR codes.',
      }
    }
    if (maxQRCodes > 0 && totalQRCodes >= maxQRCodes) {
      return {
        canCreateQR: false,
        upgradeReason: `You have reached your limit of ${maxQRCodes} dynamic QR codes. Upgrade your plan to create more.`,
      }
    }

    return { canCreateQR: true, upgradeReason: '' }
  }, [isLoading, isGuest, sessionLimits, isAccountCreditMode, balance, dynamicQRPrice, staticQRPrice, isUserSubscribed, maxQRCodes, totalQRCodes])
  const canScan = useMemo(() => {
    if (isLoading) return true
    if (isGuest) {
      if (sessionLimits && sessionLimits.scans.remaining <= 0) return false
      return true
    }
    if (isAccountCreditMode) return true
    if (!isUserSubscribed()) return false

    if (maxScans <= 0) return true
    return totalScans < maxScans
  }, [isLoading, isGuest, sessionLimits, isAccountCreditMode, isUserSubscribed, maxScans, totalScans])

  return {
    isLoading,
    canCreateQR,
    canScan,
    plan: plan
      ? {
          name: plan.name,
          number_of_dynamic_qrcodes: plan.number_of_dynamic_qrcodes,
          number_of_scans: plan.number_of_scans,
        }
      : null,
    usage: {
      totalQRCodes,
      totalScans,
    },
    limits: {
      maxQRCodes,
      maxScans,
    },
    upgradeReason,
    showUpgradeModal,
    setShowUpgradeModal,
    isAccountCreditMode,
  }
}
