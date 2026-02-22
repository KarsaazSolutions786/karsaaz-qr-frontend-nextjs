// Subscription Service - Zustand Store (T009)
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
          const activeSub = subscriptions.find(
            (s: any) => s.statuses?.[0]?.status === 'active'
          ) || subscriptions[0] || null;

          const plan = activeSub?.subscription_plan || null;
          const isOnTrial = !!activeSub?.on_trial || !!plan?.isTrial;

          // Calculate remaining days
          let remainingDays = 0;
          if (activeSub) {
            const endDate = new Date(activeSub.end_date || activeSub.currentPeriodEnd || '');
            remainingDays = Math.max(0, Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
          }

          // Derive status
          let status: SubscriptionStatus = 'active';
          if (!activeSub) {
            status = 'expired';
          } else if (isOnTrial && remainingDays <= 0) {
            status = 'trial_expired';
          } else if (isOnTrial && remainingDays <= 3) {
            status = 'trial_expiring_soon';
          } else if (isOnTrial) {
            status = 'trial';
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
