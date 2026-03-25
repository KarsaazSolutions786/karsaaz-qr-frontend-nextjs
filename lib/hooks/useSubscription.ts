/**
 * Subscription Hook - TanStack Query Based (T010)
 * Manages subscription state derived from user data
 */

'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, useCallback, useMemo } from 'react'
import { queryKeys } from '@/lib/query/keys'
import { useAuth } from '@/lib/hooks/useAuth'
import { getUserStats, type UserStats } from '@/lib/api/sidebar'
import type { FeatureFlags, SubscriptionStatus } from '@/types/entities/feature-flags'
import type { User } from '@/types/entities/user'

// Types
interface Subscription {
  id: number
  user_id: number
  subscription_plan_id: number
  created_at: string
  updated_at: string
  expires_at: string | null
  end_date?: string
  currentPeriodEnd?: string
  on_trial?: boolean
  subscription_plan: SubscriptionPlan | null
  statuses: SubscriptionStatusRecord[]
}

interface SubscriptionPlan {
  id: number
  name: string
  price: string
  monthly_price: string
  yearly_price?: string
  frequency: string
  is_trial: boolean
  is_popular: boolean
  is_hidden: boolean
  number_of_dynamic_qrcodes: number
  number_of_scans: number
  number_of_users: number
  number_of_custom_domains: number
  qr_types: string[]
  features: string[]
  file_size_limit: number
  number_of_bulk_created_qrcodes: number
  dynamic_type_limits?: Record<string, string>
}

interface SubscriptionStatusRecord {
  id: number
  subscription_id: number
  status: string
  created_at: string
}

interface SubscriptionData {
  status: SubscriptionStatus
  subscription: Subscription | null
  plan: SubscriptionPlan | null
  remainingDays: number
  isOnTrial: boolean
  features: FeatureFlags
  subscriptionStatus: string | null
}

const defaultFeatures: FeatureFlags = {
  qr_code_types: [],
  max_dynamic_qrcodes: 0,
  max_scans_per_month: 0,
  max_bulk_operations: 0,
  max_invited_users: 0,
  allow_custom_domain: false,
  allow_api_access: false,
  allow_white_label: false,
  allow_advanced_analytics: false,
  allow_bulk_operations: false,
  allow_templates: false,
  allow_ai_design: false,
}

/**
 * Get the latest status from a subscription's statuses array
 */
function getLatestStatus(sub: Subscription | null): string | null {
  if (!sub) return null
  const statuses = sub.statuses || []
  if (statuses.length === 0) return null

  const sortedStatuses = [...statuses].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime()
    const dateB = new Date(b.created_at).getTime()
    return dateB - dateA
  })
  return sortedStatuses[0]?.status || null
}

/**
 * Check if subscription is a trial plan
 */
function isTrialPlan(sub: Subscription | null): boolean {
  return sub?.subscription_plan?.is_trial === true
}

/**
 * Select the best subscription to display from a list of subscriptions
 */
function selectSubscription(subscriptions: Subscription[]): Subscription | null {
  if (!subscriptions || subscriptions.length === 0) return null

  // Sort subscriptions by created_at descending (newest first)
  const sortedSubs = [...subscriptions].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime()
    const dateB = new Date(b.created_at).getTime()
    return dateB - dateA
  })

  // First, try to find the most recent "active" non-trial subscription
  let activeSub = sortedSubs.find(s => getLatestStatus(s) === 'active' && !isTrialPlan(s))

  if (activeSub) return activeSub

  // If no active non-trial, check if there's a more recent subscription attempt
  const mostRecent = sortedSubs[0]
  const activeTrial = sortedSubs.find(s => getLatestStatus(s) === 'active' && isTrialPlan(s))

  if (mostRecent && activeTrial) {
    const mostRecentDate = new Date(mostRecent.created_at).getTime()
    const trialDate = new Date(activeTrial.created_at).getTime()
    return mostRecentDate > trialDate ? mostRecent : activeTrial
  }

  return mostRecent || activeTrial || null
}

/**
 * Check if user has super admin role
 */
function isSuperAdminUser(user: User | null): boolean {
  if (!user) return false
  return (user as any).roles?.some((r: any) => !!r.super_admin) ?? false
}

/**
 * Build an unlimited admin plan (no restrictions)
 */
const adminPlan: SubscriptionPlan = {
  id: 0,
  name: 'Admin (Unlimited)',
  price: '999',
  monthly_price: '999',
  frequency: 'lifetime',
  is_trial: false,
  is_popular: false,
  is_hidden: true,
  number_of_dynamic_qrcodes: -1,
  number_of_scans: -1,
  number_of_users: -1,
  number_of_custom_domains: -1,
  qr_types: [],
  features: [
    'api_access',
    'white_label',
    'advanced_analytics',
    'bulk_operations',
    'templates',
    'ai_design',
    'custom_domain',
    'svg_download',
    'pdf_download',
    'eps_download',
  ],
  file_size_limit: -1,
  number_of_bulk_created_qrcodes: -1,
}

const adminFeatures: FeatureFlags = {
  qr_code_types: [],
  max_dynamic_qrcodes: -1,
  max_scans_per_month: -1,
  max_bulk_operations: -1,
  max_invited_users: -1,
  allow_custom_domain: true,
  allow_api_access: true,
  allow_white_label: true,
  allow_advanced_analytics: true,
  allow_bulk_operations: true,
  allow_templates: true,
  allow_ai_design: true,
}

/**
 * Process user data to extract subscription information
 */
function processSubscriptionData(user: User | null): SubscriptionData {
  if (!user) {
    return {
      status: 'expired',
      subscription: null,
      plan: null,
      remainingDays: 0,
      isOnTrial: false,
      features: defaultFeatures,
      subscriptionStatus: null,
    }
  }

  // Admin users get unlimited access regardless of subscription status
  if (isSuperAdminUser(user)) {
    return {
      status: 'active',
      subscription: null,
      plan: adminPlan,
      remainingDays: 9999,
      isOnTrial: false,
      features: adminFeatures,
      subscriptionStatus: 'active',
    }
  }

  const subscriptions = (user.subscriptions || []) as unknown as Subscription[]
  const activeSub = selectSubscription(subscriptions)
  const plan = activeSub?.subscription_plan || null
  const isOnTrial = !!activeSub?.on_trial || !!plan?.is_trial
  const subscriptionStatus = getLatestStatus(activeSub)

  // Calculate remaining days
  let remainingDays = 0
  if (activeSub) {
    const expiresAt = activeSub.expires_at || activeSub.end_date || activeSub.currentPeriodEnd
    if (expiresAt) {
      const endDate = new Date(expiresAt)
      remainingDays = Math.max(
        0,
        Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      )
    }
  }

  // Derive display status
  let status: SubscriptionStatus = 'active'
  if (!activeSub) {
    status = 'expired'
  } else if (subscriptionStatus === 'pending_payment') {
    status = 'active'
  } else if (isOnTrial && remainingDays <= 0) {
    status = 'trial_expired'
  } else if (isOnTrial && remainingDays <= 3) {
    status = 'trial_expiring_soon'
  } else if (isOnTrial) {
    status = 'trial'
  } else if (subscriptionStatus === 'active') {
    if (remainingDays <= 0) {
      status = 'expired'
    } else if (remainingDays <= 7) {
      status = 'expiring_soon'
    } else {
      status = 'active'
    }
  } else if (remainingDays <= 0) {
    status = 'expired'
  } else if (remainingDays <= 7) {
    status = 'expiring_soon'
  }

  // Extract features from plan
  const features: FeatureFlags = {
    qr_code_types: plan?.qr_types || [],
    max_dynamic_qrcodes: plan?.number_of_dynamic_qrcodes || 0,
    max_scans_per_month: plan?.number_of_scans || 0,
    max_bulk_operations: plan?.number_of_bulk_created_qrcodes || 10,
    max_invited_users: plan?.number_of_users || 0,
    allow_custom_domain: (plan?.number_of_custom_domains || 0) > 0,
    allow_api_access: plan?.features?.includes('api_access') || false,
    allow_white_label: plan?.features?.includes('white_label') || false,
    allow_advanced_analytics: plan?.features?.includes('advanced_analytics') || false,
    allow_bulk_operations:
      plan?.features?.includes('bulk_operations') ||
      plan?.features?.includes('bulk-qrcode-creation') ||
      false,
    allow_templates: plan?.features?.includes('templates') || false,
    allow_ai_design: plan?.features?.includes('ai_design') || false,
  }

  return {
    status,
    subscription: activeSub,
    plan,
    remainingDays,
    isOnTrial,
    features,
    subscriptionStatus,
  }
}

/**
 * Main subscription hook using TanStack Query
 */
export function useSubscription() {
  const queryClient = useQueryClient()
  const { user, isLoading, refreshUserData } = useAuth()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeReason, setUpgradeReason] = useState('')

  // Process subscription data from user
  const subscriptionData = processSubscriptionData(user || null)

  // Fetch real usage stats from backend (same pattern as useSubscriptionLimits)
  const { data: usageStats } = useQuery<UserStats>({
    queryKey: [...queryKeys.qrcodes.all(), 'usage-stats'],
    queryFn: getUserStats,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 1,
    enabled: typeof window !== 'undefined' && !!user,
  })

  const usage = useMemo(
    () => ({
      dynamicQrcodes: usageStats?.dynamic_qrcodes_count ?? 0,
      scansThisMonth: usageStats?.total_scans ?? 0,
      invitedUsers: 0, // No backend endpoint for invited user count yet
    }),
    [usageStats]
  )

  // Helper functions
  const isUserSubscribed = useCallback(() => {
    const { status } = subscriptionData
    return (
      status === 'active' ||
      status === 'trial' ||
      status === 'expiring_soon' ||
      status === 'trial_expiring_soon'
    )
  }, [subscriptionData])

  const onTrial = useCallback(() => {
    return subscriptionData.isOnTrial
  }, [subscriptionData.isOnTrial])

  const getPlanRemainingDays = useCallback(() => {
    return subscriptionData.remainingDays
  }, [subscriptionData.remainingDays])

  const featureAllowed = useCallback(
    (feature: string) => {
      const key = `allow_${feature}` as keyof FeatureFlags
      return !!subscriptionData.features[key]
    },
    [subscriptionData.features]
  )

  const currentPlanHasQrCodeType = useCallback(
    (type: string) => {
      const { qr_code_types } = subscriptionData.features
      if (qr_code_types.length === 0) return true
      return qr_code_types.includes(type)
    },
    [subscriptionData.features]
  )

  const userInvitedUsersLimitReached = useCallback(() => {
    const maxInvited = subscriptionData.features.max_invited_users
    // -1 or 0 means unlimited
    if (maxInvited <= 0) return false
    return usage.invitedUsers >= maxInvited
  }, [subscriptionData.features.max_invited_users, usage.invitedUsers])

  const canCreateQRCode = useCallback(() => {
    if (!isUserSubscribed()) {
      return { allowed: false, reason: 'Subscription expired. Please renew to create QR codes.' }
    }
    const maxQR = subscriptionData.features.max_dynamic_qrcodes
    // -1 or 0 means unlimited
    if (maxQR > 0 && usage.dynamicQrcodes >= maxQR) {
      return {
        allowed: false,
        reason: `You have reached your limit of ${maxQR} dynamic QR codes. Upgrade your plan to create more.`,
      }
    }
    return { allowed: true }
  }, [isUserSubscribed, subscriptionData.features.max_dynamic_qrcodes, usage.dynamicQrcodes])

  const canEditQRCode = useCallback(() => {
    if (!isUserSubscribed()) {
      return { allowed: false, reason: 'Subscription expired. Please renew to edit QR codes.' }
    }
    return { allowed: true }
  }, [isUserSubscribed])

  // Actions
  const loadSubscription = useCallback(async () => {
    await refreshUserData()
  }, [refreshUserData])

  const openUpgradeModal = useCallback((reason: string) => {
    setUpgradeReason(reason)
    setShowUpgradeModal(true)
  }, [])

  const closeUpgradeModal = useCallback(() => {
    setShowUpgradeModal(false)
    setUpgradeReason('')
  }, [])

  const invalidateSubscription = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser() })
  }, [queryClient])

  return {
    // State
    status: subscriptionData.status,
    plan: subscriptionData.plan,
    subscription: subscriptionData.subscription,
    remainingDays: subscriptionData.remainingDays,
    isOnTrial: subscriptionData.isOnTrial,
    features: subscriptionData.features,
    usage,
    loaded: !isLoading,
    isLoading,
    error: null,
    showUpgradeModal,
    upgradeReason,

    // Status checks
    isUserSubscribed,
    onTrial,
    getPlanRemainingDays,

    // Feature gates
    featureAllowed,
    currentPlanHasQrCodeType,
    userInvitedUsersLimitReached,

    // Enforcement
    canCreateQRCode,
    canEditQRCode,

    // Actions
    loadSubscription,
    openUpgradeModal,
    closeUpgradeModal,
    invalidateSubscription,
    refetch: loadSubscription,
  }
}
