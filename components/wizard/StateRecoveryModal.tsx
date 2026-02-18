/**
 * StateRecoveryModal Component
 * 
 * Modal for recovering persisted wizard state.
 * Shows when user returns and has unsaved work.
 */

'use client';

import React, { useEffect, useState } from 'react';
import {
  hasPersistedWizardState,
  getPersistedStateAge,
  isPersistedStateStale,
  useWizardStore,
} from '@/lib/store/wizard-store';

export interface StateRecoveryModalProps {
  onRestore?: () => void;
  onDiscard?: () => void;
}

export function StateRecoveryModal({ onRestore, onDiscard }: StateRecoveryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [stateAge, setStateAge] = useState<number | null>(null);
  const clearPersistedState = useWizardStore((state) => state.clearPersistedState);

  useEffect(() => {
    // Check for persisted state on mount
    if (hasPersistedWizardState()) {
      const age = getPersistedStateAge();
      setStateAge(age);
      setIsOpen(true);
    }
  }, []);

  const handleRestore = () => {
    setIsOpen(false);
    onRestore?.();
  };

  const handleDiscard = () => {
    clearPersistedState();
    setIsOpen(false);
    onDiscard?.();
  };

  if (!isOpen) return null;

  const isStale = isPersistedStateStale();
  const ageInMinutes = stateAge ? Math.floor(stateAge / 1000 / 60) : 0;
  const ageInHours = Math.floor(ageInMinutes / 60);
  const ageDisplay =
    ageInHours > 0
      ? `${ageInHours} hour${ageInHours !== 1 ? 's' : ''} ago`
      : `${ageInMinutes} minute${ageInMinutes !== 1 ? 's' : ''} ago`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-scale-in">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
          {isStale ? 'Old Draft Found' : 'Resume Your Work?'}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-600 text-center mb-6">
          {isStale ? (
            <>
              We found an unfinished QR code from <span className="font-medium">{ageDisplay}</span>.
              This draft might be outdated.
            </>
          ) : (
            <>
              We found an unfinished QR code from <span className="font-medium">{ageDisplay}</span>.
              Would you like to continue where you left off?
            </>
          )}
        </p>

        {/* Warning for stale state */}
        {isStale && (
          <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex gap-2">
              <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <p className="text-xs font-medium text-yellow-900">Old Draft</p>
                <p className="text-xs text-yellow-800 mt-1">
                  This draft is over 24 hours old. Consider starting fresh if it's no longer relevant.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleRestore}
            className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
          >
            {isStale ? 'Restore Old Draft' : 'Continue Editing'}
          </button>
          <button
            type="button"
            onClick={handleDiscard}
            className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Start Fresh
          </button>
        </div>

        {/* Info */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Your draft is automatically saved as you work
        </p>
      </div>
    </div>
  );
}

/**
 * Compact recovery banner (less intrusive)
 */
export interface StateRecoveryBannerProps {
  onRestore?: () => void;
  onDismiss?: () => void;
}

export function StateRecoveryBanner({ onRestore, onDismiss }: StateRecoveryBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const clearPersistedState = useWizardStore((state) => state.clearPersistedState);

  useEffect(() => {
    if (hasPersistedWizardState()) {
      setIsVisible(true);
    }
  }, []);

  const handleRestore = () => {
    setIsVisible(false);
    onRestore?.();
  };

  const handleDismiss = () => {
    clearPersistedState();
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const ageInMinutes = Math.floor((getPersistedStateAge() ?? 0) / 1000 / 60);

  return (
    <div className="bg-primary-50 border-l-4 border-primary-600 p-4 mb-6">
      <div className="flex items-start gap-3">
        <svg className="w-6 h-6 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1">
          <p className="text-sm font-medium text-primary-900">Unsaved work found</p>
          <p className="text-sm text-primary-700 mt-1">
            You have an unfinished QR code from {ageInMinutes} minutes ago.
          </p>
          <div className="flex gap-3 mt-3">
            <button
              type="button"
              onClick={handleRestore}
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Resume →
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="text-sm font-medium text-gray-600 hover:text-gray-700"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook for state recovery
 */
export function useStateRecovery() {
  const [shouldShowRecovery, setShouldShowRecovery] = useState(false);

  useEffect(() => {
    setShouldShowRecovery(hasPersistedWizardState());
  }, []);

  return {
    shouldShowRecovery,
    hasPersistedState: hasPersistedWizardState(),
    stateAge: getPersistedStateAge(),
    isStale: isPersistedStateStale(),
  };
}
