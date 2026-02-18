'use client';

import { ReactNode } from 'react';
import { featureAllowed, type FeatureName, type PlanType } from '@/lib/utils/feature-gate';
import UpgradePrompt from './UpgradePrompt';

interface FeatureGateProps {
  feature: FeatureName;
  plan: PlanType;
  fallback?: ReactNode;
  children: ReactNode;
  showUpgradePrompt?: boolean;
}

export default function FeatureGate({
  feature,
  plan,
  fallback,
  children,
  showUpgradePrompt = true,
}: FeatureGateProps) {
  const hasAccess = featureAllowed(feature, plan);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showUpgradePrompt) {
    return <UpgradePrompt feature={feature} currentPlan={plan} />;
  }

  return null;
}
