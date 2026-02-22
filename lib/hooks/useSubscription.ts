// useSubscription Hook (T010)
// Wraps subscription store for component access

'use client';

import { useSubscriptionStore } from '@/lib/services/subscription-service';

export function useSubscription() {
  const store = useSubscriptionStore();

  return {
    // State
    status: store.status,
    plan: store.plan,
    subscription: store.subscription,
    remainingDays: store.remainingDays,
    isOnTrial: store.isOnTrial,
    features: store.features,
    usage: store.usage,
    loaded: store.loaded,
    showUpgradeModal: store.showUpgradeModal,
    upgradeReason: store.upgradeReason,

    // Status checks
    isUserSubscribed: store.isUserSubscribed,
    onTrial: store.onTrial,
    getPlanRemainingDays: store.getPlanRemainingDays,

    // Feature gates
    featureAllowed: store.featureAllowed,
    currentPlanHasQrCodeType: store.currentPlanHasQrCodeType,
    userInvitedUsersLimitReached: store.userInvitedUsersLimitReached,

    // Enforcement
    canCreateQRCode: store.canCreateQRCode,
    canEditQRCode: store.canEditQRCode,

    // Actions
    loadSubscription: store.loadSubscription,
    openUpgradeModal: store.openUpgradeModal,
    closeUpgradeModal: store.closeUpgradeModal,
  };
}
