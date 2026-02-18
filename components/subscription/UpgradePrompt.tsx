'use client';

import { useState } from 'react';
import { X, ArrowRight, Check } from 'lucide-react';
import { getNextPlan, getPlanFeatures, getPlanName, type FeatureName, type PlanType } from '@/lib/utils/feature-gate';

interface UpgradePromptProps {
  feature: FeatureName;
  currentPlan: PlanType;
  onClose?: () => void;
  onUpgrade?: () => void;
  inline?: boolean;
}

const FEATURE_LABELS: Record<FeatureName, string> = {
  bulk_qr: 'Bulk QR Code Generation',
  analytics: 'Advanced Analytics',
  custom_branding: 'Custom Branding',
  api_access: 'API Access',
  advanced_templates: 'Advanced Templates',
  white_label: 'White Label Solution',
  priority_support: 'Priority Support',
  custom_domains: 'Custom Domains',
};

export default function UpgradePrompt({
  feature,
  currentPlan,
  onClose,
  onUpgrade,
  inline = false,
}: UpgradePromptProps) {
  const [isOpen, setIsOpen] = useState(true);
  const nextPlan = getNextPlan(currentPlan);

  if (!nextPlan || !isOpen) {
    return null;
  }

  const nextPlanFeatures = getPlanFeatures(nextPlan);
  const featureLabel = FEATURE_LABELS[feature] || feature;

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const handleUpgrade = () => {
    onUpgrade?.();
  };

  if (inline) {
    return (
      <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 mb-1">
              Unlock {featureLabel}
            </h4>
            <p className="text-sm text-blue-700 mb-3">
              Upgrade to {getPlanName(nextPlan)} to access this feature
            </p>
            <button
              onClick={handleUpgrade}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Upgrade Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {onClose && (
            <button
              onClick={handleClose}
              className="text-blue-400 hover:text-blue-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Upgrade Required
          </h3>
          {onClose && (
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <p className="text-gray-600 mb-4">
          <strong>{featureLabel}</strong> is available in the{' '}
          <strong>{getPlanName(nextPlan)}</strong> plan.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">
            What you'll get with {getPlanName(nextPlan)}:
          </h4>
          <ul className="space-y-2">
            {nextPlanFeatures.features.slice(0, 5).map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>{FEATURE_LABELS[f] || f}</span>
              </li>
            ))}
            {nextPlanFeatures.features.length > 5 && (
              <li className="text-sm text-gray-500 pl-6">
                +{nextPlanFeatures.features.length - 5} more features
              </li>
            )}
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleUpgrade}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Upgrade to {getPlanName(nextPlan)}
            <ArrowRight className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Maybe Later
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
