'use client';

import { AlertCircle } from 'lucide-react';

interface UsageProgressProps {
  used: number;
  total: number;
  type: string;
  label?: string;
  showWarning?: boolean;
  warningThreshold?: number;
}

export default function UsageProgress({
  used,
  total,
  type,
  label,
  showWarning = true,
  warningThreshold = 80,
}: UsageProgressProps) {
  const isUnlimited = total === -1;
  const percentage = isUnlimited ? 0 : (used / total) * 100;
  const isNearLimit = percentage >= warningThreshold;
  const isAtLimit = percentage >= 100;

  const getProgressColor = () => {
    if (isAtLimit) return 'bg-red-600';
    if (isNearLimit) return 'bg-yellow-500';
    return 'bg-blue-600';
  };

  const getBackgroundColor = () => {
    if (isAtLimit) return 'bg-red-100';
    if (isNearLimit) return 'bg-yellow-100';
    return 'bg-gray-200';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          {label || type}
        </span>
        <span className="text-sm text-gray-600">
          {isUnlimited ? (
            <span className="text-green-600 font-semibold">Unlimited</span>
          ) : (
            <>
              {used.toLocaleString()} / {total.toLocaleString()}
            </>
          )}
        </span>
      </div>

      {!isUnlimited && (
        <>
          <div className={`relative h-2 rounded-full overflow-hidden ${getBackgroundColor()}`}>
            <div
              className={`absolute left-0 top-0 h-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>

          {showWarning && isNearLimit && (
            <div
              className={`flex items-center gap-2 text-sm ${
                isAtLimit ? 'text-red-600' : 'text-yellow-600'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span>
                {isAtLimit
                  ? `You've reached your ${type} limit`
                  : `You're using ${percentage.toFixed(0)}% of your ${type} quota`}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
