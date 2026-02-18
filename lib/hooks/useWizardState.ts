import { useState, useCallback, useEffect } from 'react';

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  isOptional?: boolean;
}

export interface UseWizardStateOptions {
  steps: WizardStep[];
  initialStep?: number;
  onStepChange?: (step: number) => void;
  validateStep?: (step: number, data: any) => boolean | Promise<boolean>;
  persistKey?: string;
}

export interface WizardData {
  [key: string]: any;
}

export function useWizardState({
  steps,
  initialStep = 0,
  onStepChange,
  validateStep,
  persistKey,
}: UseWizardStateOptions) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([initialStep]));
  const [wizardData, setWizardData] = useState<WizardData>(() => {
    if (persistKey && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(persistKey);
        return saved ? JSON.parse(saved) : {};
      } catch {
        return {};
      }
    }
    return {};
  });
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (persistKey && typeof window !== 'undefined') {
      try {
        localStorage.setItem(persistKey, JSON.stringify(wizardData));
      } catch (error) {
        console.error('Failed to persist wizard data:', error);
      }
    }
  }, [wizardData, persistKey]);

  const updateData = useCallback((stepId: string, data: any) => {
    setWizardData((prev) => ({
      ...prev,
      [stepId]: { ...prev[stepId], ...data },
    }));
  }, []);

  const goToStep = useCallback(
    async (stepIndex: number) => {
      if (stepIndex < 0 || stepIndex >= steps.length) return false;

      if (validateStep && stepIndex > currentStep) {
        setIsValidating(true);
        try {
          const isValid = await validateStep(currentStep, wizardData);
          if (!isValid) {
            setIsValidating(false);
            return false;
          }
        } catch (error) {
          console.error('Step validation error:', error);
          setIsValidating(false);
          return false;
        }
        setIsValidating(false);
      }

      setCurrentStep(stepIndex);
      setVisitedSteps((prev) => new Set([...prev, stepIndex]));
      onStepChange?.(stepIndex);
      return true;
    },
    [currentStep, steps.length, validateStep, wizardData, onStepChange]
  );

  const nextStep = useCallback(async () => {
    if (currentStep < steps.length - 1) {
      return await goToStep(currentStep + 1);
    }
    return false;
  }, [currentStep, steps.length, goToStep]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      onStepChange?.(currentStep - 1);
      return true;
    }
    return false;
  }, [currentStep, onStepChange]);

  const reset = useCallback(() => {
    setCurrentStep(initialStep);
    setVisitedSteps(new Set([initialStep]));
    setWizardData({});
    if (persistKey && typeof window !== 'undefined') {
      try {
        localStorage.removeItem(persistKey);
      } catch (error) {
        console.error('Failed to clear persisted data:', error);
      }
    }
  }, [initialStep, persistKey]);

  const isStepVisited = useCallback(
    (stepIndex: number) => visitedSteps.has(stepIndex),
    [visitedSteps]
  );

  const isStepComplete = useCallback(
    (stepIndex: number) => {
      return stepIndex < currentStep || visitedSteps.has(stepIndex);
    },
    [currentStep, visitedSteps]
  );

  const canGoBack = currentStep > 0;
  const canGoNext = currentStep < steps.length - 1;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return {
    currentStep,
    currentStepData: steps[currentStep],
    wizardData,
    visitedSteps,
    isValidating,
    canGoBack,
    canGoNext,
    isFirstStep,
    isLastStep,
    goToStep,
    nextStep,
    previousStep,
    updateData,
    reset,
    isStepVisited,
    isStepComplete,
    setWizardData,
  };
}
