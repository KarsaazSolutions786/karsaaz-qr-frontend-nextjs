/**
 * useBrowserBackButton Hook
 * 
 * Handles browser back button for wizard navigation.
 * Syncs browser history with wizard steps.
 */

'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useWizardStore, WizardStep } from '@/lib/store/wizard-store';

const STEP_ORDER: WizardStep[] = ['type', 'content', 'design', 'sticker', 'preview', 'download'];

export interface UseBrowserBackButtonOptions {
  basePath?: string;
  onNavigate?: (step: WizardStep) => void;
  enabled?: boolean;
}

/**
 * Hook to handle browser back/forward buttons
 */
export function useBrowserBackButton(options: UseBrowserBackButtonOptions = {}) {
  const { basePath = '/dashboard/qr-codes/create', onNavigate, enabled = true } = options;
  
  const router = useRouter();
  const currentStep = useWizardStore((state) => state.currentStep);
  const setCurrentStep = useWizardStore((state) => state.setCurrentStep);
  const canGoToStep = useWizardStore((state) => state.canGoToStep);

  // Update URL when step changes
  useEffect(() => {
    if (!enabled) return;

    const stepPath = currentStep === 'type' ? '' : `/${currentStep}`;
    const newPath = `${basePath}${stepPath}`;
    
    // Only push if different from current path
    if (window.location.pathname !== newPath) {
      window.history.pushState({ step: currentStep }, '', newPath);
    }
  }, [currentStep, basePath, enabled]);

  // Handle popstate (back/forward button)
  useEffect(() => {
    if (!enabled) return;

    const handlePopState = (event: PopStateEvent) => {
      const step = event.state?.step as WizardStep | undefined;
      
      if (step && STEP_ORDER.includes(step)) {
        // Check if user can navigate to this step
        if (canGoToStep(step)) {
          setCurrentStep(step);
          onNavigate?.(step);
        } else {
          // Can't go to that step, go back to current
          window.history.pushState({ step: currentStep }, '', `${basePath}/${currentStep}`);
        }
      } else {
        // No step in state, go to first step
        setCurrentStep('type');
        onNavigate?.('type');
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentStep, basePath, enabled, canGoToStep, setCurrentStep, onNavigate]);

  // Replace current history entry on mount
  useEffect(() => {
    if (!enabled) return;

    window.history.replaceState({ step: currentStep }, '', `${basePath}${currentStep === 'type' ? '' : `/${currentStep}`}`);
  }, []); // Only on mount

  return {
    goBack: useCallback(() => {
      router.back();
    }, [router]),
    
    goForward: useCallback(() => {
      router.forward();
    }, [router]),
  };
}

/**
 * Hook to prevent accidental navigation away
 */
export function usePreventAccidentalExit(shouldPrevent: boolean = true) {
  const isDirty = useWizardStore((state) => state.isDirty);

  useEffect(() => {
    if (!shouldPrevent || !isDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ''; // Chrome requires returnValue to be set
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [shouldPrevent, isDirty]);
}

/**
 * Wizard navigation breadcrumb component
 */
export interface WizardBreadcrumbProps {
  onStepClick?: (step: WizardStep) => void;
  className?: string;
}

export function WizardBreadcrumb({ onStepClick, className = '' }: WizardBreadcrumbProps) {
  const currentStep = useWizardStore((state) => state.currentStep);
  const completedSteps = useWizardStore((state) => state.completedSteps);
  const canGoToStep = useWizardStore((state) => state.canGoToStep);
  const setCurrentStep = useWizardStore((state) => state.setCurrentStep);

  const stepLabels: Record<WizardStep, string> = {
    type: 'Type',
    content: 'Content',
    design: 'Design',
    sticker: 'Sticker',
    preview: 'Preview',
    download: 'Download',
  };

  const handleStepClick = (step: WizardStep) => {
    if (canGoToStep(step)) {
      setCurrentStep(step);
      onStepClick?.(step);
    }
  };

  return (
    <nav className={`wizard-breadcrumb ${className}`}>
      <ol className="flex items-center space-x-2 text-sm">
        {STEP_ORDER.map((step, index) => {
          const isActive = currentStep === step;
          const isCompleted = completedSteps.includes(step);
          const canNavigate = canGoToStep(step);

          return (
            <li key={step} className="flex items-center">
              {index > 0 && (
                <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              
              <button
                type="button"
                onClick={() => handleStepClick(step)}
                disabled={!canNavigate}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : isCompleted
                    ? 'text-green-600 hover:bg-green-50'
                    : canNavigate
                    ? 'text-gray-600 hover:bg-gray-100'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                {isCompleted && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <span>{stepLabels[step]}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Wizard progress bar component
 */
export interface WizardProgressBarProps {
  className?: string;
}

export function WizardProgressBar({ className = '' }: WizardProgressBarProps) {
  const completedSteps = useWizardStore((state) => state.completedSteps);
  const currentStep = useWizardStore((state) => state.currentStep);

  const totalSteps = STEP_ORDER.length;
  const currentIndex = STEP_ORDER.indexOf(currentStep);
  const progress = Math.round(((currentIndex + 1) / totalSteps) * 100);

  return (
    <div className={`wizard-progress-bar ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Step {currentIndex + 1} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-gray-700">{progress}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Wizard step indicator (circles)
 */
export interface WizardStepIndicatorProps {
  onStepClick?: (step: WizardStep) => void;
  className?: string;
}

export function WizardStepIndicator({ onStepClick, className = '' }: WizardStepIndicatorProps) {
  const currentStep = useWizardStore((state) => state.currentStep);
  const completedSteps = useWizardStore((state) => state.completedSteps);
  const canGoToStep = useWizardStore((state) => state.canGoToStep);
  const setCurrentStep = useWizardStore((state) => state.setCurrentStep);

  const handleStepClick = (step: WizardStep) => {
    if (canGoToStep(step)) {
      setCurrentStep(step);
      onStepClick?.(step);
    }
  };

  return (
    <div className={`wizard-step-indicator ${className}`}>
      <div className="flex items-center justify-between">
        {STEP_ORDER.map((step, index) => {
          const isActive = currentStep === step;
          const isCompleted = completedSteps.includes(step);
          const canNavigate = canGoToStep(step);

          return (
            <React.Fragment key={step}>
              <button
                type="button"
                onClick={() => handleStepClick(step)}
                disabled={!canNavigate}
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-medium transition ${
                  isActive
                    ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                    : isCompleted
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : canNavigate
                    ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </button>
              
              {index < STEP_ORDER.length - 1 && (
                <div className="flex-1 h-1 mx-2 bg-gray-200 rounded">
                  <div
                    className={`h-full rounded transition-all ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                    style={{ width: isCompleted ? '100%' : '0%' }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
