import React, { ReactNode } from 'react'
import { WizardNavigation } from './WizardNavigation'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

export interface Step {
  id: string
  title: string
  description?: string
  isOptional?: boolean
}

export interface StepperWizardProps {
  steps: Step[]
  currentStep: number
  onStepChange?: (stepIndex: number) => void
  onBack?: () => void
  onNext?: () => void
  onSubmit?: () => void
  children: ReactNode
  canGoBack?: boolean
  canGoNext?: boolean
  isSubmitting?: boolean
  isValidating?: boolean
  showProgress?: boolean
  allowStepClick?: boolean
  className?: string
  headerClassName?: string
  contentClassName?: string
  footerClassName?: string
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
  allowStepClick = true,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
}: StepperWizardProps) {
  const isLastStep = currentStep === steps.length - 1

  const handleStepClick = (stepIndex: number) => {
    if (allowStepClick && stepIndex <= currentStep && onStepChange) {
      onStepChange(stepIndex)
    }
  }

  return (
    <div
      className={cn('flex w-full flex-col min-h-screen', className)}
      role="region"
      aria-label="Multi-step form wizard"
    >
      {/* ── Horizontal Step Bar ── */}
      <div
        className={cn(
          'sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4 shadow-sm',
          headerClassName
        )}
      >
        <div className="mx-auto max-w-4xl">
          <nav aria-label="Form steps">
            <ol className="flex items-center justify-between gap-2">
              {steps.map((step, index) => {
                const isCompleted = index < currentStep
                const isActive = index === currentStep
                const isClickable = allowStepClick && index <= currentStep

                return (
                  <React.Fragment key={step.id}>
                    {/* Step node */}
                    <li
                      className={cn(
                        'flex flex-1 flex-col items-center gap-1.5',
                        isClickable ? 'cursor-pointer' : 'cursor-default'
                      )}
                      onClick={() => isClickable && handleStepClick(index)}
                      aria-current={isActive ? 'step' : undefined}
                    >
                      {/* Circle */}
                      <div
                        className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-200',
                          isCompleted
                            ? 'border-purple-600 bg-purple-600 text-white'
                            : isActive
                            ? 'border-purple-600 bg-white text-purple-600 shadow-md shadow-purple-100'
                            : 'border-gray-200 bg-gray-50 text-gray-400'
                        )}
                      >
                        {isCompleted ? (
                          <Check className="h-4 w-4 stroke-[2.5]" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>

                      {/* Label */}
                      <div className="text-center hidden sm:block">
                        <p
                          className={cn(
                            'text-xs font-semibold',
                            isActive ? 'text-purple-700' : isCompleted ? 'text-gray-600' : 'text-gray-400'
                          )}
                        >
                          {step.title}
                        </p>
                        {step.description && (
                          <p className="text-[11px] text-gray-400 leading-tight max-w-[90px] truncate">
                            {step.description}
                          </p>
                        )}
                      </div>
                    </li>

                    {/* Connector line between steps */}
                    {index < steps.length - 1 && (
                      <div
                        className={cn(
                          'h-0.5 flex-1 rounded-full transition-all duration-300',
                          index < currentStep ? 'bg-purple-600' : 'bg-gray-200'
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </React.Fragment>
                )
              })}
            </ol>
          </nav>
        </div>
      </div>

      {/* ── Content ── */}
      <div
        className={cn('flex-1 bg-gray-50 px-4 py-8 sm:px-6', contentClassName)}
        role="main"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="mx-auto max-w-4xl">
          {/* Step heading */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {steps[currentStep]?.title}
            </h2>
            {steps[currentStep]?.description && (
              <p className="mt-1 text-sm text-gray-500">
                {steps[currentStep].description}
              </p>
            )}
          </div>

          {/* Content card */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            {children}
          </div>
        </div>
      </div>

      {/* ── Footer Navigation ── */}
      <div
        className={cn(
          'sticky bottom-0 border-t border-gray-200 bg-white px-6 py-4 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]',
          footerClassName
        )}
      >
        <div className="mx-auto max-w-4xl">
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
  )
}
