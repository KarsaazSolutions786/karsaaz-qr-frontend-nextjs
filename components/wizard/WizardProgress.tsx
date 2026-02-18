import React from 'react';
import { cn } from '@/lib/utils';

export interface WizardProgressProps {
  totalSteps: number;
  currentStep: number;
  showPercentage?: boolean;
  showStepCount?: boolean;
  className?: string;
}

export function WizardProgress({
  totalSteps,
  currentStep,
  showPercentage = true,
  showStepCount = true,
  className,
}: WizardProgressProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const percentage = Math.round(progress);

  return (
    <div className={cn('w-full', className)} role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={totalSteps}>
      {/* Header with Step Count and Percentage */}
      {(showStepCount || showPercentage) && (
        <div className="mb-2 flex items-center justify-between text-sm">
          {showStepCount && (
            <span className="font-medium text-gray-700">
              Step {currentStep + 1} of {totalSteps}
            </span>
          )}
          {showPercentage && (
            <span className="text-gray-500">{percentage}% Complete</span>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
          aria-hidden="true"
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      </div>

      {/* Step Markers */}
      <div className="relative mt-1 flex justify-between">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 w-1 rounded-full transition-colors duration-200',
              i <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
            )}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
