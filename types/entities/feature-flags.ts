// Feature Flags & Subscription State Types (T008)

export interface FeatureFlags {
  qr_code_types: string[];
  max_dynamic_qrcodes: number;
  max_scans_per_month: number;
  max_bulk_operations: number;
  max_invited_users: number;
  allow_custom_domain: boolean;
  allow_api_access: boolean;
  allow_white_label: boolean;
  allow_advanced_analytics: boolean;
  allow_bulk_operations: boolean;
  allow_templates: boolean;
  allow_ai_design: boolean;
}

export type SubscriptionStatus =
  | 'active'
  | 'expired'
  | 'expiring_soon'
  | 'trial'
  | 'trial_expired'
  | 'trial_expiring_soon'
  | 'pending_payment';

export interface SubscriptionState {
  status: SubscriptionStatus;
  plan: import('./plan').SubscriptionPlan | null;
  remaining_days: number;
  is_on_trial: boolean;
  features: FeatureFlags;
  usage: {
    dynamic_qrcodes: number;
    scans_this_month: number;
    invited_users: number;
  };
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
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
