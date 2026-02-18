/**
 * TrialMessage Component
 * 
 * Trial period warning banner with countdown and upgrade CTA.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Clock, X, Zap, AlertCircle } from 'lucide-react';
import { differenceInDays, differenceInHours, formatDistanceToNow } from 'date-fns';

export interface TrialMessageProps {
  trialEndsAt: Date | string;
  onUpgrade: () => void;
  onDismiss?: () => void;
}

export function TrialMessage({ trialEndsAt, onUpgrade, onDismiss }: TrialMessageProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  const endDate = typeof trialEndsAt === 'string' ? new Date(trialEndsAt) : trialEndsAt;
  const now = new Date();
  const daysLeft = differenceInDays(endDate, now);
  const hoursLeft = differenceInHours(endDate, now);
  const isExpiringSoon = daysLeft <= 3;
  const isExpired = endDate < now;

  useEffect(() => {
    const updateTimeLeft = () => {
      if (isExpired) {
        setTimeLeft('Trial expired');
      } else {
        setTimeLeft(formatDistanceToNow(endDate, { addSuffix: false }));
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [endDate, isExpired]);

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  if (isDismissed) return null;

  const getBannerColor = () => {
    if (isExpired) return 'bg-red-600';
    if (isExpiringSoon) return 'bg-orange-600';
    return 'bg-blue-600';
  };

  const getIcon = () => {
    if (isExpired) return <AlertCircle className="w-5 h-5" />;
    if (isExpiringSoon) return <Clock className="w-5 h-5 animate-pulse" />;
    return <Clock className="w-5 h-5" />;
  };

  const getMessage = () => {
    if (isExpired) {
      return 'Your trial has ended. Upgrade to continue using all features.';
    }
    if (daysLeft === 0) {
      return `Trial ending in ${hoursLeft} hour${hoursLeft !== 1 ? 's' : ''}!`;
    }
    return `Your trial ends in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`;
  };

  return (
    <div
      className={`
        ${getBannerColor()} text-white shadow-lg
        animate-in slide-in-from-top duration-300
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {getIcon()}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">
                {getMessage()}
              </p>
              {!isExpired && (
                <p className="text-xs opacity-90 mt-0.5">
                  {timeLeft} remaining
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onUpgrade}
              className={`
                inline-flex items-center gap-1.5 px-4 py-2 
                bg-white text-gray-900 font-semibold text-sm rounded-lg
                hover:bg-gray-100 active:bg-gray-200
                transition-colors
                focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2
                ${getBannerColor().replace('bg-', 'focus:ring-offset-')}
              `}
            >
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Upgrade Now</span>
              <span className="sm:hidden">Upgrade</span>
            </button>

            {onDismiss && !isExpired && (
              <button
                onClick={handleDismiss}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
