import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WizardNavigationProps {
  onBack?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  canGoBack?: boolean;
  canGoNext?: boolean;
  isLastStep?: boolean;
  isSubmitting?: boolean;
  isValidating?: boolean;
  backLabel?: string;
  nextLabel?: string;
  submitLabel?: string;
  className?: string;
  enableKeyboardShortcuts?: boolean;
}

export function WizardNavigation({
  onBack,
  onNext,
  onSubmit,
  canGoBack = true,
  canGoNext = true,
  isLastStep = false,
  isSubmitting = false,
  isValidating = false,
  backLabel = 'Back',
  nextLabel = 'Next',
  submitLabel = 'Submit',
  className,
  enableKeyboardShortcuts = true,
}: WizardNavigationProps) {
  const isLoading = isSubmitting || isValidating;

  useEffect(() => {
    if (!enableKeyboardShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'Enter' && !isLoading) {
        e.preventDefault();
        if (isLastStep && onSubmit) {
          onSubmit();
        } else if (canGoNext && onNext) {
          onNext();
        }
      }

      if (e.key === 'Escape' && canGoBack && onBack && !isLoading) {
        e.preventDefault();
        onBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canGoBack, canGoNext, isLastStep, isLoading, onBack, onNext, onSubmit, enableKeyboardShortcuts]);

  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        disabled={!canGoBack || isLoading}
        className={cn(
          'inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          canGoBack && !isLoading
            ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
            : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed',
          !canGoBack && 'invisible'
        )}
        aria-label="Go to previous step"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        {backLabel}
      </button>

      {/* Next/Submit Button */}
      {isLastStep ? (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading || !canGoNext}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-medium text-white transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            !isLoading && canGoNext
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg'
              : 'bg-gray-300 cursor-not-allowed'
          )}
          aria-label="Submit form"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Submitting...
            </>
          ) : (
            submitLabel
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={isLoading || !canGoNext}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-medium text-white transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            !isLoading && canGoNext
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg'
              : 'bg-gray-300 cursor-not-allowed'
          )}
          aria-label="Go to next step"
        >
          {isValidating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Validating...
            </>
          ) : (
            <>
              {nextLabel}
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
