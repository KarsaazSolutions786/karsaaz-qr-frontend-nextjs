/**
 * useWizard Hook
 * 
 * Convenience hooks for using wizard store in components.
 */

'use client';

import { useEffect } from 'react';
import { useWizardStore, WizardStep, WizardState } from '@/lib/store/wizard-store';

/**
 * Purpose: Hook for accessing wizard state and actions
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function useWizard() {
  return useWizardStore();
}

/**
 * Purpose: Hook for current step only
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function useWizardStep() {
  return useWizardStore((state) => state.currentStep);
}

/**
 * Purpose: Hook for navigation actions
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
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
 * Purpose: Hook for QR configuration
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
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
 * Purpose: Hook for designer configuration
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function useWizardDesignerConfig() {
  return useWizardStore((state) => ({
    designerConfig: state.designerConfig,
    setDesignerConfig: state.setDesignerConfig,
    updateDesignerConfig: state.updateDesignerConfig,
  }));
}

/**
 * Purpose: Hook for sticker configuration
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function useWizardStickerConfig() {
  return useWizardStore((state) => ({
    stickerConfig: state.stickerConfig,
    setStickerConfig: state.setStickerConfig,
  }));
}

/**
 * Purpose: Hook for metadata
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
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
 * Purpose: Hook for state management
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
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
 * Purpose: Hook for step completion status
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function useStepComplete(step: WizardStep) {
  return useWizardStore((state) => state.completedSteps.includes(step));
}

/**
 * Purpose: Hook to check if can navigate to step
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function useCanGoToStep(step: WizardStep) {
  return useWizardStore((state) => state.canGoToStep(step));
}

/**
 * Purpose: Hook to auto-save on changes
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
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
 * Purpose: Hook for step progress
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
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
 * Purpose: Hook to get step label
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
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
 * Purpose: Hook to get step icon
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
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
 * Purpose: Hook for complete wizard data
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
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
 * Purpose: Hook to validate wizard state
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
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
 * Purpose: Selector hook for performance
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function useWizardSelector<T>(selector: (state: WizardState) => T): T {
  return useWizardStore(selector);
}
