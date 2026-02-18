/**
 * useWizard Hook
 * 
 * Convenience hooks for using wizard store in components.
 */

'use client';

import { useEffect } from 'react';
import { useWizardStore, WizardStep, WizardState } from '@/lib/store/wizard-store';

/**
 * Hook for accessing wizard state and actions
 */
export function useWizard() {
  return useWizardStore();
}

/**
 * Hook for current step only
 */
export function useWizardStep() {
  return useWizardStore((state) => state.currentStep);
}

/**
 * Hook for navigation actions
 */
export function useWizardNavigation() {
  return useWizardStore((state) => ({
    currentStep: state.currentStep,
    completedSteps: state.completedSteps,
    goToNextStep: state.goToNextStep,
    goToPreviousStep: state.goToPreviousStep,
    setCurrentStep: state.setCurrentStep,
    canGoToStep: state.canGoToStep,
    completeStep: state.completeStep,
  }));
}

/**
 * Hook for QR configuration
 */
export function useWizardQRConfig() {
  return useWizardStore((state) => ({
    qrType: state.qrType,
    qrData: state.qrData,
    qrSize: state.qrSize,
    errorCorrectionLevel: state.errorCorrectionLevel,
    setQRType: state.setQRType,
    setQRData: state.setQRData,
    setQRSize: state.setQRSize,
    setErrorCorrectionLevel: state.setErrorCorrectionLevel,
  }));
}

/**
 * Hook for designer configuration
 */
export function useWizardDesignerConfig() {
  return useWizardStore((state) => ({
    designerConfig: state.designerConfig,
    setDesignerConfig: state.setDesignerConfig,
    updateDesignerConfig: state.updateDesignerConfig,
  }));
}

/**
 * Hook for sticker configuration
 */
export function useWizardStickerConfig() {
  return useWizardStore((state) => ({
    stickerConfig: state.stickerConfig,
    setStickerConfig: state.setStickerConfig,
  }));
}

/**
 * Hook for metadata
 */
export function useWizardMetadata() {
  return useWizardStore((state) => ({
    name: state.name,
    folderId: state.folderId,
    categoryId: state.categoryId,
    setMetadata: state.setMetadata,
  }));
}

/**
 * Hook for state management
 */
export function useWizardState() {
  return useWizardStore((state) => ({
    isDirty: state.isDirty,
    lastModified: state.lastModified,
    sessionId: state.sessionId,
    resetWizard: state.resetWizard,
    clearPersistedState: state.clearPersistedState,
    markClean: state.markClean,
  }));
}

/**
 * Hook for step completion status
 */
export function useStepComplete(step: WizardStep) {
  return useWizardStore((state) => state.completedSteps.includes(step));
}

/**
 * Hook to check if can navigate to step
 */
export function useCanGoToStep(step: WizardStep) {
  return useWizardStore((state) => state.canGoToStep(step));
}

/**
 * Hook to auto-save on changes
 */
export function useWizardAutoSave(onSave?: () => void) {
  const isDirty = useWizardStore((state) => state.isDirty);
  const markClean = useWizardStore((state) => state.markClean);

  useEffect(() => {
    if (isDirty) {
      // Auto-save happens via zustand persist middleware
      // This hook is for triggering additional side effects
      onSave?.();
      
      // Mark as clean after a delay
      const timer = setTimeout(() => {
        markClean();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isDirty, onSave, markClean]);
}

/**
 * Hook for step progress
 */
export function useWizardProgress() {
  return useWizardStore((state) => {
    const totalSteps = 6; // type, content, design, sticker, preview, download
    const completedCount = state.completedSteps.length;
    const percentage = Math.round((completedCount / totalSteps) * 100);
    
    return {
      totalSteps,
      completedCount,
      percentage,
      isComplete: completedCount === totalSteps,
    };
  });
}

/**
 * Hook to get step label
 */
export function useStepLabel(step: WizardStep): string {
  const labels: Record<WizardStep, string> = {
    type: 'QR Type',
    content: 'Content',
    design: 'Design',
    sticker: 'Sticker',
    preview: 'Preview',
    download: 'Download',
  };
  return labels[step];
}

/**
 * Hook to get step icon
 */
export function useStepIcon(step: WizardStep): string {
  const icons: Record<WizardStep, string> = {
    type: '📋',
    content: '✏️',
    design: '🎨',
    sticker: '📌',
    preview: '👁️',
    download: '⬇️',
  };
  return icons[step];
}

/**
 * Hook for complete wizard data
 */
export function useWizardCompleteData() {
  return useWizardStore((state) => ({
    qrType: state.qrType,
    qrData: state.qrData,
    qrSize: state.qrSize,
    errorCorrectionLevel: state.errorCorrectionLevel,
    designerConfig: state.designerConfig,
    stickerConfig: state.stickerConfig,
    name: state.name,
    folderId: state.folderId,
    categoryId: state.categoryId,
  }));
}

/**
 * Hook to validate wizard state
 */
export function useWizardValidation() {
  return useWizardStore((state) => {
    const errors: string[] = [];

    // Type validation
    if (!state.qrType) {
      errors.push('Please select a QR code type');
    }

    // Content validation
    if (!state.qrData || state.qrData.trim() === '') {
      errors.push('Please enter QR code content');
    }

    // Size validation
    if (state.qrSize < 100 || state.qrSize > 5000) {
      errors.push('QR code size must be between 100 and 5000 pixels');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  });
}

/**
 * Selector hook for performance
 */
export function useWizardSelector<T>(selector: (state: WizardState) => T): T {
  return useWizardStore(selector);
}
