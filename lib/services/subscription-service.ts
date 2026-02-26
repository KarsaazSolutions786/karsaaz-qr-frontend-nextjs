/**
 * @deprecated This Zustand store is deprecated. Use useSubscription hook from '@/lib/hooks/useSubscription' instead.
 * The subscription state is now managed by TanStack Query for better cache management and data synchronization.
 *
 * Migration guide:
 * - Replace `useSubscriptionStore()` with `useSubscription()`
 * - Replace `useSubscriptionStore.getState().loadSubscription()` with `invalidateSubscription()` from the hook
 *
 * This file is kept for backwards compatibility and will be removed in a future version.
 */

// Subscription Service - Zustand Store (T009) [DEPRECATED]
// Per contracts/subscription-service.yaml and research.md R1

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { FeatureFlags, SubscriptionStatus } from '@/types/entities/feature-flags';

interface SubscriptionStore {
  // State
  status: SubscriptionStatus;
  subscription: any | null;
  plan: any | null;
  remainingDays: number;
  isOnTrial: boolean;
  features: FeatureFlags;
  usage: {
    dynamicQrcodes: number;
    scansThisMonth: number;
    invitedUsers: number;
  };
  showUpgradeModal: boolean;
  upgradeReason: string;
  loaded: boolean;

  // Actions
  loadSubscription: () => Promise<void>;
  isUserSubscribed: () => boolean;
  currentSubscription: () => any | null;
  currentPlan: () => any | null;
  onTrial: () => boolean;
  getPlanRemainingDays: () => number;
  featureAllowed: (feature: string) => boolean;
  currentPlanHasQrCodeType: (type: string) => boolean;
  userInvitedUsersLimitReached: () => boolean;
  canCreateQRCode: () => { allowed: boolean; reason?: string };
  canEditQRCode: () => { allowed: boolean; reason?: string };
  openUpgradeModal: (reason: string) => void;
  closeUpgradeModal: () => void;
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
};

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set, get) => ({
      // Initial state
      status: 'active' as SubscriptionStatus,
      subscription: null,
      plan: null,
      remainingDays: 0,
      isOnTrial: false,
      features: defaultFeatures,
      usage: { dynamicQrcodes: 0, scansThisMonth: 0, invitedUsers: 0 },
      showUpgradeModal: false,
      upgradeReason: '',
      loaded: false,

      // Load subscription data from user object (already fetched via /myself)
      loadSubscription: async () => {
        try {
          const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
          if (!userStr) return;
          const user = JSON.parse(userStr);

          const subscriptions = user.subscriptions || [];

          // Sort subscriptions by created_at descending (newest first)
          const sortedSubs = [...subscriptions].sort((a: any, b: any) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return dateB - dateA; // Newest first
          });

          // Get the latest status for each subscription
          const getLatestStatus = (sub: any) => {
            const statuses = sub.statuses || [];
            if (statuses.length === 0) return null;
            // Sort statuses by created_at descending and get the first one
            const sortedStatuses = [...statuses].sort((a: any, b: any) => {
              const dateA = new Date(a.created_at).getTime();
              const dateB = new Date(b.created_at).getTime();
              return dateB - dateA;
            });
            return sortedStatuses[0]?.status;
          };

          // Check if subscription is a trial plan
          const isTrial = (sub: any) => sub.subscription_plan?.is_trial === true;

          // Priority for displaying subscription:
          // 1. Most recent "active" non-trial subscription
          // 2. Most recent "active" trial subscription (if no paid active)
          // 3. Most recent subscription regardless of status (user is trying to subscribe)
          let activeSub = null;

          // First, try to find the most recent "active" non-trial subscription
          activeSub = sortedSubs.find((s: any) =>
            getLatestStatus(s) === 'active' && !isTrial(s)
          );

          // If no active non-trial, check if there's a more recent subscription attempt
          // This handles the case where user has trial active but is trying to upgrade
          if (!activeSub) {
            // Get the most recent subscription (regardless of status)
            const mostRecent = sortedSubs[0];
            // Get the active trial (if any)
            const activeTrial = sortedSubs.find((s: any) =>
              getLatestStatus(s) === 'active' && isTrial(s)
            );

            // If the most recent is newer than the active trial, show the most recent
            // This shows the plan user is trying to subscribe to
            if (mostRecent && activeTrial) {
              const mostRecentDate = new Date(mostRecent.created_at).getTime();
              const trialDate = new Date(activeTrial.created_at).getTime();
              activeSub = mostRecentDate > trialDate ? mostRecent : activeTrial;
            } else {
              activeSub = mostRecent || activeTrial || null;
            }
          }

          const plan = activeSub?.subscription_plan || null;
          const isOnTrial = !!activeSub?.on_trial || !!plan?.is_trial || !!plan?.isTrial;

          // Get the actual status from the subscription's statuses array
          const subscriptionStatus = getLatestStatus(activeSub);

          // Calculate remaining days
          let remainingDays = 0;
          if (activeSub) {
            // Use expires_at field from the subscription
            const expiresAt = activeSub.expires_at || activeSub.end_date || activeSub.currentPeriodEnd;
            if (expiresAt) {
              const endDate = new Date(expiresAt);
              remainingDays = Math.max(0, Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
            }
          }

          // Derive display status
          let status: SubscriptionStatus = 'active';
          if (!activeSub) {
            status = 'expired';
          } else if (subscriptionStatus === 'pending_payment') {
            // User has a pending subscription - show as pending
            status = 'active'; // Show as active so UI doesn't block, but plan details show
          } else if (isOnTrial && remainingDays <= 0) {
            status = 'trial_expired';
          } else if (isOnTrial && remainingDays <= 3) {
            status = 'trial_expiring_soon';
          } else if (isOnTrial) {
            status = 'trial';
          } else if (subscriptionStatus === 'active') {
            if (remainingDays <= 0) {
              status = 'expired';
            } else if (remainingDays <= 7) {
              status = 'expiring_soon';
            } else {
              status = 'active';
            }
          } else if (remainingDays <= 0) {
            status = 'expired';
          } else if (remainingDays <= 7) {
            status = 'expiring_soon';
          }

          // Extract features from plan
          const features: FeatureFlags = {
            qr_code_types: plan?.qrTypes || plan?.qr_types || [],
            max_dynamic_qrcodes: plan?.numberOfDynamicQrcodes || plan?.number_of_dynamic_qrcodes || 0,
            max_scans_per_month: plan?.numberOfScans || plan?.number_of_scans || 0,
            max_bulk_operations: plan?.max_bulk_operations || 10,
            max_invited_users: plan?.numberOfUsers || plan?.number_of_users || 0,
            allow_custom_domain: (plan?.numberOfCustomDomains || plan?.number_of_custom_domains || 0) > 0,
            allow_api_access: plan?.features?.includes('api_access') || false,
            allow_white_label: plan?.features?.includes('white_label') || false,
            allow_advanced_analytics: plan?.features?.includes('advanced_analytics') || false,
            allow_bulk_operations: plan?.features?.includes('bulk_operations') || false,
            allow_templates: plan?.features?.includes('templates') || false,
            allow_ai_design: plan?.features?.includes('ai_design') || false,
          };

          set({
            status,
            subscription: activeSub,
            plan,
            remainingDays,
            isOnTrial,
            features,
            loaded: true,
          });
        } catch (e) {
          console.error('[SubscriptionService] Failed to load subscription:', e);
        }
      },

      isUserSubscribed: () => {
        const { status } = get();
        return status === 'active' || status === 'trial' || status === 'expiring_soon' || status === 'trial_expiring_soon';
      },

      currentSubscription: () => get().subscription,
      currentPlan: () => get().plan,
      onTrial: () => get().isOnTrial,
      getPlanRemainingDays: () => get().remainingDays,

      featureAllowed: (feature: string) => {
        const { features } = get();
        const key = `allow_${feature}` as keyof FeatureFlags;
        return !!features[key];
      },

      currentPlanHasQrCodeType: (type: string) => {
        const { features } = get();
        if (features.qr_code_types.length === 0) return true; // No restriction
        return features.qr_code_types.includes(type);
      },

      userInvitedUsersLimitReached: () => {
        const { features, usage } = get();
        if (features.max_invited_users <= 0) return false; // Unlimited
        return usage.invitedUsers >= features.max_invited_users;
      },

      canCreateQRCode: () => {
        const state = get();
        if (!state.isUserSubscribed()) {
          return { allowed: false, reason: 'Subscription expired. Please renew to create QR codes.' };
        }
        if (state.features.max_dynamic_qrcodes > 0 && state.usage.dynamicQrcodes >= state.features.max_dynamic_qrcodes) {
          return { allowed: false, reason: 'Dynamic QR code limit reached. Upgrade your plan.' };
        }
        return { allowed: true };
      },

      canEditQRCode: () => {
        const state = get();
        if (!state.isUserSubscribed()) {
          return { allowed: false, reason: 'Subscription expired. Please renew to edit QR codes.' };
        }
        return { allowed: true };
      },

      openUpgradeModal: (reason: string) => set({ showUpgradeModal: true, upgradeReason: reason }),
      closeUpgradeModal: () => set({ showUpgradeModal: false, upgradeReason: '' }),
    }),
    {
      name: 'subscription-store',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? sessionStorage : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      ),
      partialize: (state) => ({
        status: state.status,
        plan: state.plan,
        remainingDays: state.remainingDays,
        isOnTrial: state.isOnTrial,
        features: state.features,
      }),
    }
  )
);
