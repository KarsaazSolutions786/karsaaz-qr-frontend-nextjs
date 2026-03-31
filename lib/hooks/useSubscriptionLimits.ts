/**
 * useSubscriptionLimits Hook
 *
 * Fetches real usage data (QR code count + scan count) from the backend
 * and compares against the user's current plan limits to determine
 * whether they can create new QR codes or have remaining scan capacity.
 *
 * When the system is in account-credit billing mode, subscription checks
 * are bypassed and affordability is determined by the user's credit balance
 * instead (via useAccountCredit).
 *
 * This hook exists because the main useSubscription hook hardcodes
 * usage to zero. This hook fetches actual counts from the backend
 * via GET /qrcodes (for dynamic count) and GET /qrcodes/count/scans.
 */

'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSubscription } from '@/lib/hooks/useSubscription'
import { useAccountCredit } from '@/lib/hooks/useAccountCredit'
import { useGuest } from '@/lib/hooks/useGuest'
import { getUserStats } from '@/lib/api/sidebar'
import { queryKeys } from '@/lib/query/keys'

interface SubscriptionLimitsResult {
  /** True while plan or usage data is still loading */
  isLoading: boolean
  /** Whether user can create a new QR code (within quota + has active subscription, or has sufficient credits) */
  canCreateQR: boolean
  /** Whether user has remaining scan capacity */
  canScan: boolean
  /** Current plan metadata (null if no plan or in credit mode) */
  plan: {
    name: string
    number_of_dynamic_qrcodes: number
    number_of_scans: number
  } | null
  /** Actual usage counts from the backend */
  usage: {
    totalQRCodes: number
    totalScans: number
  }
  /** Plan limits (-1 means unlimited) */
  limits: {
    maxQRCodes: number
    maxScans: number
  }
  /** Reason string when canCreateQR is false */
  upgradeReason: string
  /** Controls visibility of the upgrade modal */
  showUpgradeModal: boolean
  /** Setter for the upgrade modal visibility */
  setShowUpgradeModal: (open: boolean) => void
  /** Whether system is in account-credit billing mode */
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

  // Fetch real usage stats from backend (disabled for guests)
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

  // Determine if user can create QR codes
  const { canCreateQR, upgradeReason } = useMemo(() => {
    // If still loading, assume they can (don't block the UI)
    if (isLoading) return { canCreateQR: true, upgradeReason: '' }

    // ── Guest mode ──
    // Guests use session-based limits from admin config, not subscriptions
    if (isGuest) {
      if (sessionLimits && sessionLimits.qrcodes.remaining <= 0) {
        return {
          canCreateQR: false,
          upgradeReason: 'You have reached the guest QR code limit. Sign up for a free account to create more.',
        }
      }
      return { canCreateQR: true, upgradeReason: '' }
    }

    // ── Account credit billing mode ──
    // In credit mode, there are no subscription-based limits. The user pays
    // per QR code from their balance. We check if they can afford at least
    // the cheaper of the two QR types (dynamic or static). The per-type
    // affordability check happens at the point of creation.
    if (isAccountCreditMode) {
      const cheapestPrice = Math.min(
        dynamicQRPrice > 0 ? dynamicQRPrice : Infinity,
        staticQRPrice > 0 ? staticQRPrice : Infinity,
      )
      // If both prices are 0 or unset, everything is free
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

    // ── Subscription billing mode ──
    // Must have an active subscription
    if (!isUserSubscribed()) {
      return {
        canCreateQR: false,
        upgradeReason: 'Your subscription has expired. Please renew or upgrade to create QR codes.',
      }
    }

    // Check QR code limit (-1 or 0 from backend typically means unlimited)
    if (maxQRCodes > 0 && totalQRCodes >= maxQRCodes) {
      return {
        canCreateQR: false,
        upgradeReason: `You have reached your limit of ${maxQRCodes} dynamic QR codes. Upgrade your plan to create more.`,
      }
    }

    return { canCreateQR: true, upgradeReason: '' }
  }, [isLoading, isGuest, sessionLimits, isAccountCreditMode, balance, dynamicQRPrice, staticQRPrice, isUserSubscribed, maxQRCodes, totalQRCodes])

  // Determine if user has scan capacity
  const canScan = useMemo(() => {
    if (isLoading) return true
    if (isGuest) {
      if (sessionLimits && sessionLimits.scans.remaining <= 0) return false
      return true
    }
    // In credit mode, scans are not limited by subscription
    if (isAccountCreditMode) return true
    if (!isUserSubscribed()) return false
    // -1 or 0 means unlimited
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
