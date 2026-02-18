/**
 * QRCodeQuotaDisplay Component
 * 
 * Displays QR code usage quota with progress bar.
 */

'use client';

import React from 'react';
import { AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';

export interface QRCodeQuotaDisplayProps {
  used: number;
  total: number;
  plan: string;
  onUpgrade?: () => void;
}

export function QRCodeQuotaDisplay({
  used,
  total,
  plan,
  onUpgrade,
}: QRCodeQuotaDisplayProps) {
  const percentage = total > 0 ? (used / total) * 100 : 0;
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  const getProgressColor = () => {
    if (isAtLimit) return 'bg-red-600';
    if (isNearLimit) return 'bg-orange-500';
    return 'bg-blue-600';
  };

  const getBackgroundColor = () => {
    if (isAtLimit) return 'bg-red-100';
    if (isNearLimit) return 'bg-orange-100';
    return 'bg-blue-100';
  };

  const getTextColor = () => {
    if (isAtLimit) return 'text-red-700';
    if (isNearLimit) return 'text-orange-700';
    return 'text-blue-700';
  };

  const getIcon = () => {
    if (isAtLimit) return <AlertTriangle className="w-5 h-5 text-red-600" />;
    if (isNearLimit) return <TrendingUp className="w-5 h-5 text-orange-600" />;
    return <CheckCircle className="w-5 h-5 text-blue-600" />;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getIcon()}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              QR Code Usage
            </h3>
            <p className="text-xs text-gray-500 capitalize">{plan} Plan</p>
          </div>
        </div>
        <div className={`text-sm font-bold ${getTextColor()}`}>
          {used} / {total}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className={`h-2 ${getBackgroundColor()} rounded-full overflow-hidden`}>
          <div
            className={`h-full ${getProgressColor()} transition-all duration-500 ease-out`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-gray-600">
            {Math.round(percentage)}% used
          </span>
          {total > 0 && (
            <span className="text-gray-600">
              {total - used} remaining
            </span>
          )}
        </div>
      </div>

      {/* Warning/Upgrade Message */}
      {isAtLimit && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-red-800">
                You've reached your QR code limit
              </p>
              <p className="text-xs text-red-700 mt-1">
                Upgrade your plan to create more QR codes
              </p>
            </div>
          </div>
          {onUpgrade && (
            <button
              onClick={onUpgrade}
              className="mt-2 w-full px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md transition-colors"
            >
              Upgrade Plan
            </button>
          )}
        </div>
      )}

      {isNearLimit && !isAtLimit && (
        <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-orange-800">
                Approaching limit
              </p>
              <p className="text-xs text-orange-700 mt-1">
                Consider upgrading to avoid running out of QR codes
              </p>
            </div>
          </div>
          {onUpgrade && (
            <button
              onClick={onUpgrade}
              className="mt-2 w-full px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium rounded-md transition-colors"
            >
              Upgrade Plan
            </button>
          )}
        </div>
      )}
    </div>
  );
}
