'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSubscription } from '@/lib/hooks/useSubscription'

const SUBSCRIPTION_EXPIRING_DAYS = 7
const TRIAL_EXPIRING_DAYS = 3

const DISMISS_KEY_PREFIX = 'subscription-alert-dismissed:'

type AlertType = 'expiring_soon' | 'trial_expiring_soon' | 'feature_upgrade'

interface FeatureUpgradeContext {
  feature: string
  title: string
  description: string
}

interface SubscriptionAlertsReturn {
  /** Whether the "expiring soon" modal should be shown */
  showExpiringModal: boolean
  /** Whether the "trial expiring" modal should be shown */
  showTrialExpiringModal: boolean
  /** Whether a feature upgrade modal should be shown */
  showFeatureUpgradeModal: boolean
  /** Context for the feature upgrade (which feature triggered it) */
  featureUpgradeContext: FeatureUpgradeContext | null
  /** Days remaining in current subscription/trial */
  daysRemaining: number
  /** Dismiss the expiring subscription modal */
  dismissExpiring: () => void
  /** Dismiss the trial expiring modal */
  dismissTrialExpiring: () => void
  /** Dismiss the feature upgrade modal */
  dismissFeatureUpgrade: () => void
  /** Trigger a feature-specific upgrade prompt */
  promptFeatureUpgrade: (context: FeatureUpgradeContext) => void
  /** Whether subscription is in a warning state (expiring or trial_expiring) */
  hasWarning: boolean
}

function isDismissed(alertType: AlertType): boolean {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem(`${DISMISS_KEY_PREFIX}${alertType}`) === 'true'
}

function setDismissed(alertType: AlertType): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(`${DISMISS_KEY_PREFIX}${alertType}`, 'true')
}

export function useSubscriptionAlerts(): SubscriptionAlertsReturn {
  const { status, remainingDays, isOnTrial, isLoading } = useSubscription()

  const [expiringDismissed, setExpiringDismissed] = useState(() => isDismissed('expiring_soon'))
  const [trialExpiringDismissed, setTrialExpiringDismissed] = useState(() => isDismissed('trial_expiring_soon'))
  const [featureUpgradeDismissed, setFeatureUpgradeDismissed] = useState(false)
  const [featureUpgradeContext, setFeatureUpgradeContext] = useState<FeatureUpgradeContext | null>(null)

  const isExpiringSoon = useMemo(() => {
    if (isLoading) return false
    return (
      status === 'expiring_soon' ||
      (!isOnTrial && remainingDays > 0 && remainingDays <= SUBSCRIPTION_EXPIRING_DAYS)
    )
  }, [status, isOnTrial, remainingDays, isLoading])


  const isTrialExpiringSoon = useMemo(() => {
    if (isLoading) return false
    return (
      status === 'trial_expiring_soon' ||
      (isOnTrial && remainingDays > 0 && remainingDays <= TRIAL_EXPIRING_DAYS)
    )
  }, [status, isOnTrial, remainingDays, isLoading])

  useEffect(() => {
    if (!isExpiringSoon && expiringDismissed) {
      setExpiringDismissed(false)
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(`${DISMISS_KEY_PREFIX}expiring_soon`)
      }
    }
  }, [isExpiringSoon, expiringDismissed])

  useEffect(() => {
    if (!isTrialExpiringSoon && trialExpiringDismissed) {
      setTrialExpiringDismissed(false)
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(`${DISMISS_KEY_PREFIX}trial_expiring_soon`)
      }
    }
  }, [isTrialExpiringSoon, trialExpiringDismissed])

  const dismissExpiring = useCallback(() => {
    setExpiringDismissed(true)
    setDismissed('expiring_soon')
  }, [])

  const dismissTrialExpiring = useCallback(() => {
    setTrialExpiringDismissed(true)
    setDismissed('trial_expiring_soon')
  }, [])

  const dismissFeatureUpgrade = useCallback(() => {
    setFeatureUpgradeDismissed(true)
    setFeatureUpgradeContext(null)
  }, [])

  const promptFeatureUpgrade = useCallback((context: FeatureUpgradeContext) => {
    setFeatureUpgradeContext(context)
    setFeatureUpgradeDismissed(false)
  }, [])

  const showExpiringModal = isExpiringSoon && !expiringDismissed
  const showTrialExpiringModal = isTrialExpiringSoon && !trialExpiringDismissed
  const showFeatureUpgradeModal = !!featureUpgradeContext && !featureUpgradeDismissed

  return {
    showExpiringModal,
    showTrialExpiringModal,
    showFeatureUpgradeModal,
    featureUpgradeContext,
    daysRemaining: remainingDays,
    dismissExpiring,
    dismissTrialExpiring,
    dismissFeatureUpgrade,
    promptFeatureUpgrade,
    hasWarning: isExpiringSoon || isTrialExpiringSoon,
  }
}
