export type PlanType = 'free' | 'starter' | 'pro' | 'enterprise';

export type FeatureName =
  | 'bulk_qr'
  | 'analytics'
  | 'custom_branding'
  | 'api_access'
  | 'advanced_templates'
  | 'white_label'
  | 'priority_support'
  | 'custom_domains';

export type LimitType = 'qr_codes' | 'scans' | 'team_members' | 'storage';

export interface PlanFeatures {
  name: string;
  features: FeatureName[];
  limits: {
    qr_codes: number;
    scans: number;
    team_members: number;
    storage: number; // in MB
  };
}

const PLAN_FEATURES: Record<PlanType, PlanFeatures> = {
  free: {
    name: 'Free',
    features: [],
    limits: {
      qr_codes: 10,
      scans: 1000,
      team_members: 1,
      storage: 100,
    },
  },
  starter: {
    name: 'Starter',
    features: ['bulk_qr', 'analytics'],
    limits: {
      qr_codes: 100,
      scans: 10000,
      team_members: 3,
      storage: 1000,
    },
  },
  pro: {
    name: 'Pro',
    features: ['bulk_qr', 'analytics', 'custom_branding', 'api_access', 'advanced_templates'],
    limits: {
      qr_codes: 1000,
      scans: 100000,
      team_members: 10,
      storage: 10000,
    },
  },
  enterprise: {
    name: 'Enterprise',
    features: [
      'bulk_qr',
      'analytics',
      'custom_branding',
      'api_access',
      'advanced_templates',
      'white_label',
      'priority_support',
      'custom_domains',
    ],
    limits: {
      qr_codes: -1, // unlimited
      scans: -1,
      team_members: -1,
      storage: -1,
    },
  },
};

export function featureAllowed(featureName: FeatureName, plan: PlanType): boolean {
  const planFeatures = PLAN_FEATURES[plan];
  return planFeatures.features.includes(featureName);
}

export function checkPlanLimit(
  limitType: LimitType,
  current: number,
  plan: PlanType
): { allowed: boolean; limit: number; percentage: number } {
  const planFeatures = PLAN_FEATURES[plan];
  const limit = planFeatures.limits[limitType];

  if (limit === -1) {
    return { allowed: true, limit: -1, percentage: 0 };
  }

  const allowed = current < limit;
  const percentage = (current / limit) * 100;

  return { allowed, limit, percentage };
}

export function getPlanFeatures(plan: PlanType): PlanFeatures {
  return PLAN_FEATURES[plan];
}

export function getNextPlan(currentPlan: PlanType): PlanType | null {
  const planOrder: PlanType[] = ['free', 'starter', 'pro', 'enterprise'];
  const currentIndex = planOrder.indexOf(currentPlan);

  if (currentIndex === -1 || currentIndex === planOrder.length - 1) {
    return null;
  }

  return planOrder[currentIndex + 1] ?? null;
}

export function getPlanName(plan: PlanType): string {
  return PLAN_FEATURES[plan].name;
}
