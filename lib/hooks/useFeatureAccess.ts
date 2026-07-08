import { useState, useCallback } from 'react';
import { featureAllowed, checkPlanLimit, type FeatureName, type LimitType, type PlanType } from '@/lib/utils/feature-gate';

interface UseFeatureAccessReturn {
  hasAccess: (feature: FeatureName) => boolean;
  checkLimit: (limitType: LimitType, current: number) => {
    allowed: boolean;
    limit: number;
    percentage: number;
  };
  showUpgrade: () => void;
  upgradeFeature: FeatureName | null;
}

export function useFeatureAccess(userPlan: PlanType = 'free'): UseFeatureAccessReturn {
  const [upgradeFeature, setUpgradeFeature] = useState<FeatureName | null>(null);

  const hasAccess = useCallback(
    (feature: FeatureName): boolean => {
      return featureAllowed(feature, userPlan);
    },
    [userPlan]
  );

  const checkLimit = useCallback(
    (limitType: LimitType, current: number) => {
      return checkPlanLimit(limitType, current, userPlan);
    },
    [userPlan]
  );

  const showUpgrade = useCallback(() => {
    setUpgradeFeature(null);
  }, []);

  return {
    hasAccess,
    checkLimit,
    showUpgrade,
    upgradeFeature,
  };
}
