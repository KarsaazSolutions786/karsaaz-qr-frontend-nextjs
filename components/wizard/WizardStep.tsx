import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WizardStepProps {
  stepNumber: number;
  title: string;
  description?: string;
  isActive: boolean;
  isCompleted: boolean;
  isDisabled?: boolean;
  isLast?: boolean;
  onClick?: () => void;
  className?: string;
}

export function WizardStep({
  stepNumber,
  title,
  description,
  isActive,
  isCompleted,
  isDisabled = false,
  isLast = false,
  onClick,
  className,
}: WizardStepProps) {
  const handleClick = () => {
    if (!isDisabled && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !isDisabled && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div className={cn('flex items-center', className)}>
      <div className="flex flex-col items-center">
        {/* Step Circle */}
        <button
          type="button"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
          aria-current={isActive ? 'step' : undefined}
          aria-label={`Step ${stepNumber}: ${title}`}
          className={cn(
            'relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            isActive && 'border-blue-600 bg-blue-600 text-white shadow-lg',
            isCompleted && !isActive && 'border-green-600 bg-green-600 text-white',
            !isActive && !isCompleted && !isDisabled && 'border-gray-300 bg-white text-gray-500 hover:border-gray-400',
            !isActive && !isCompleted && isDisabled && 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed',
            !isDisabled && onClick && 'cursor-pointer'
          )}
        >
          {isCompleted && !isActive ? (
            <Check className="h-5 w-5" aria-hidden="true" />
          ) : (
            <span className="text-sm font-semibold">{stepNumber}</span>
          )}
        </button>

        {/* Connection Line */}
        {!isLast && (
          <div
            className={cn(
              'mt-2 h-12 w-0.5 transition-colors duration-200',
              isCompleted ? 'bg-green-600' : 'bg-gray-300'
            )}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Step Content */}
      <div className="ml-4 flex-1">
        <h3
          className={cn(
            'text-sm font-medium transition-colors duration-200',
            isActive && 'text-blue-900',
            isCompleted && !isActive && 'text-green-900',
            !isActive && !isCompleted && !isDisabled && 'text-gray-700',
            !isActive && !isCompleted && isDisabled && 'text-gray-400'
          )}
        >
          {title}
        </h3>
        {description && (
          <p
            className={cn(
              'mt-0.5 text-xs transition-colors duration-200',
              isActive && 'text-blue-700',
              isCompleted && !isActive && 'text-green-700',
              !isActive && !isCompleted && !isDisabled && 'text-gray-500',
              !isActive && !isCompleted && isDisabled && 'text-gray-300'
            )}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
