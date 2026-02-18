import React, { ReactNode } from 'react';
import { WizardStep } from './WizardStep';
import { WizardProgress } from './WizardProgress';
import { WizardNavigation } from './WizardNavigation';
import { cn } from '@/lib/utils';

export interface Step {
  id: string;
  title: string;
  description?: string;
  isOptional?: boolean;
}

export interface StepperWizardProps {
  steps: Step[];
  currentStep: number;
  onStepChange?: (stepIndex: number) => void;
  onBack?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  children: ReactNode;
  canGoBack?: boolean;
  canGoNext?: boolean;
  isSubmitting?: boolean;
  isValidating?: boolean;
  showProgress?: boolean;
  allowStepClick?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
}

export function StepperWizard({
  steps,
  currentStep,
  onStepChange,
  onBack,
  onNext,
  onSubmit,
  children,
  canGoBack = true,
  canGoNext = true,
  isSubmitting = false,
  isValidating = false,
  showProgress = true,
  allowStepClick = true,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
}: StepperWizardProps) {
  const isLastStep = currentStep === steps.length - 1;

  const handleStepClick = (stepIndex: number) => {
    if (allowStepClick && stepIndex <= currentStep && onStepChange) {
      onStepChange(stepIndex);
    }
  };

  return (
    <div
      className={cn('flex h-full w-full flex-col', className)}
      role="region"
      aria-label="Multi-step form wizard"
    >
      {/* Header: Progress and Steps */}
      <div className={cn('border-b border-gray-200 bg-white p-6', headerClassName)}>
        {/* Progress Bar */}
        {showProgress && (
          <WizardProgress
            totalSteps={steps.length}
            currentStep={currentStep}
            className="mb-6"
          />
        )}

        {/* Step Indicators */}
        <div className="space-y-4" role="list" aria-label="Form steps">
          {steps.map((step, index) => (
            <div key={step.id} role="listitem">
              <WizardStep
                stepNumber={index + 1}
                title={step.title}
                description={step.description}
                isActive={index === currentStep}
                isCompleted={index < currentStep}
                isDisabled={index > currentStep}
                isLast={index === steps.length - 1}
                onClick={
                  allowStepClick && index <= currentStep
                    ? () => handleStepClick(index)
                    : undefined
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div
        className={cn(
          'flex-1 overflow-y-auto bg-gray-50 p-6',
          contentClassName
        )}
        role="main"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="mx-auto max-w-3xl">
          {/* Step Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {steps[currentStep]?.title}
            </h2>
            {steps[currentStep]?.description && (
              <p className="mt-2 text-sm text-gray-600">
                {steps[currentStep].description}
              </p>
            )}
            {steps[currentStep]?.isOptional && (
              <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                Optional
              </span>
            )}
          </div>

          {/* Step Content */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            {children}
          </div>
        </div>
      </div>

      {/* Footer: Navigation */}
      <div
        className={cn(
          'border-t border-gray-200 bg-white p-6',
          footerClassName
        )}
      >
        <div className="mx-auto max-w-3xl">
          <WizardNavigation
            onBack={onBack}
            onNext={onNext}
            onSubmit={onSubmit}
            canGoBack={canGoBack}
            canGoNext={canGoNext}
            isLastStep={isLastStep}
            isSubmitting={isSubmitting}
            isValidating={isValidating}
          />
        </div>
      </div>
    </div>
  );
}
