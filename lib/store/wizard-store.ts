/**
 * Wizard State Store
 * 
 * Zustand store for QR code creation wizard state with localStorage persistence.
 * Manages multi-step wizard flow, configuration, and state recovery.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DesignerConfig } from '@/types/entities/designer';
import { StickerConfig } from '@/types/entities/sticker';

// Wizard step types
export type WizardStep = 
  | 'type'           // QR code type selection
  | 'content'        // Content/data input
  | 'design'         // Designer configuration
  | 'sticker'        // Sticker configuration
  | 'preview'        // Preview and finalize
  | 'download';      // Download options

// QR code types
export type QRCodeType = 
  | 'url'
  | 'text'
  | 'email'
  | 'phone'
  | 'sms'
  | 'wifi'
  | 'vcard'
  | 'location';

// Wizard state interface
export interface WizardState {
  // Current step
  currentStep: WizardStep;
  completedSteps: WizardStep[];
  
  // QR code configuration
  qrType: QRCodeType | null;
  qrData: string;
  qrSize: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  
  // Designer configuration
  designerConfig: DesignerConfig | null;
  
  // Sticker configuration
  stickerConfig: StickerConfig | null;
  
  // Metadata
  name?: string;
  folderId?: string;
  categoryId?: string;
  
  // State tracking
  isDirty: boolean;
  lastModified: number;
  sessionId: string;
  
  // Actions
  setCurrentStep: (step: WizardStep) => void;
  completeStep: (step: WizardStep) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  canGoToStep: (step: WizardStep) => boolean;
  
  setQRType: (type: QRCodeType) => void;
  setQRData: (data: string) => void;
  setQRSize: (size: number) => void;
  setErrorCorrectionLevel: (level: 'L' | 'M' | 'Q' | 'H') => void;
  
  setDesignerConfig: (config: DesignerConfig) => void;
  updateDesignerConfig: (config: Partial<DesignerConfig>) => void;
  
  setStickerConfig: (config: StickerConfig | null) => void;
  
  setMetadata: (metadata: { name?: string; folderId?: string; categoryId?: string }) => void;
  
  resetWizard: () => void;
  clearPersistedState: () => void;
  markClean: () => void;
}

// Step order for navigation
const STEP_ORDER: WizardStep[] = ['type', 'content', 'design', 'sticker', 'preview', 'download'];

// Default designer config
const DEFAULT_DESIGNER_CONFIG: DesignerConfig = {
  moduleShape: 'square',
  cornerFrameStyle: 'square',
  cornerDotStyle: 'square',
  foregroundFill: {
    type: 'solid',
    color: '#000000',
  },
  background: {
    type: 'transparent',
  },
  size: 600,
  margin: 4,
  errorCorrectionLevel: 'M',
  logo: undefined,
  outline: undefined,
  aiDesign: undefined,
};

// Generate session ID
function generateSessionId(): string {
  return `wizard_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create wizard store with persistence
 */
export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStep: 'type',
      completedSteps: [],
      
      qrType: null,
      qrData: '',
      qrSize: 300,
      errorCorrectionLevel: 'M',
      
      designerConfig: null,
      stickerConfig: null,
      
      name: undefined,
      folderId: undefined,
      categoryId: undefined,
      
      isDirty: false,
      lastModified: Date.now(),
      sessionId: generateSessionId(),
      
      // Navigation actions
      setCurrentStep: (step) => {
        set({ currentStep: step, isDirty: true, lastModified: Date.now() });
      },
      
      completeStep: (step) => {
        const { completedSteps } = get();
        if (!completedSteps.includes(step)) {
          set({
            completedSteps: [...completedSteps, step],
            isDirty: true,
            lastModified: Date.now(),
          });
        }
      },
      
      goToNextStep: () => {
        const { currentStep, completedSteps } = get();
        const currentIndex = STEP_ORDER.indexOf(currentStep);
        
        if (currentIndex < STEP_ORDER.length - 1) {
          const nextStep = STEP_ORDER[currentIndex + 1];
          
          // Mark current step as completed
          if (!completedSteps.includes(currentStep)) {
            set({
              currentStep: nextStep,
              completedSteps: [...completedSteps, currentStep],
              isDirty: true,
              lastModified: Date.now(),
            });
          } else {
            set({
              currentStep: nextStep,
              isDirty: true,
              lastModified: Date.now(),
            });
          }
        }
      },
      
      goToPreviousStep: () => {
        const { currentStep } = get();
        const currentIndex = STEP_ORDER.indexOf(currentStep);
        
        if (currentIndex > 0) {
          const previousStep = STEP_ORDER[currentIndex - 1];
          set({
            currentStep: previousStep,
            isDirty: true,
            lastModified: Date.now(),
          });
        }
      },
      
      canGoToStep: (step) => {
        const { completedSteps, currentStep } = get();
        const stepIndex = STEP_ORDER.indexOf(step);
        const currentIndex = STEP_ORDER.indexOf(currentStep);
        
        // Can always go to current or previous steps
        if (stepIndex <= currentIndex) return true;
        
        // Can go to next step if current is completed
        if (stepIndex === currentIndex + 1 && completedSteps.includes(currentStep)) {
          return true;
        }
        
        // Can go to any completed step
        return completedSteps.includes(step);
      },
      
      // QR configuration actions
      setQRType: (type) => {
        set({ qrType: type, isDirty: true, lastModified: Date.now() });
      },
      
      setQRData: (data) => {
        set({ qrData: data, isDirty: true, lastModified: Date.now() });
      },
      
      setQRSize: (size) => {
        set({ qrSize: size, isDirty: true, lastModified: Date.now() });
      },
      
      setErrorCorrectionLevel: (level) => {
        set({ errorCorrectionLevel: level, isDirty: true, lastModified: Date.now() });
      },
      
      // Designer configuration actions
      setDesignerConfig: (config) => {
        set({ designerConfig: config, isDirty: true, lastModified: Date.now() });
      },
      
      updateDesignerConfig: (config) => {
        const { designerConfig } = get();
        const currentConfig = designerConfig || DEFAULT_DESIGNER_CONFIG;
        set({
          designerConfig: { ...currentConfig, ...config },
          isDirty: true,
          lastModified: Date.now(),
        });
      },
      
      // Sticker configuration actions
      setStickerConfig: (config) => {
        set({ stickerConfig: config, isDirty: true, lastModified: Date.now() });
      },
      
      // Metadata actions
      setMetadata: (metadata) => {
        set({ ...metadata, isDirty: true, lastModified: Date.now() });
      },
      
      // Reset actions
      resetWizard: () => {
        set({
          currentStep: 'type',
          completedSteps: [],
          qrType: null,
          qrData: '',
          qrSize: 300,
          errorCorrectionLevel: 'M',
          designerConfig: null,
          stickerConfig: null,
          name: undefined,
          folderId: undefined,
          categoryId: undefined,
          isDirty: false,
          lastModified: Date.now(),
          sessionId: generateSessionId(),
        });
      },
      
      clearPersistedState: () => {
        localStorage.removeItem('qr-wizard-storage');
        get().resetWizard();
      },
      
      markClean: () => {
        set({ isDirty: false });
      },
    }),
    {
      name: 'qr-wizard-storage',
      storage: createJSONStorage(() => localStorage),
      
      // Partial persist - don't persist temporary UI state
      partialize: (state) => ({
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        qrType: state.qrType,
        qrData: state.qrData,
        qrSize: state.qrSize,
        errorCorrectionLevel: state.errorCorrectionLevel,
        designerConfig: state.designerConfig,
        stickerConfig: state.stickerConfig,
        name: state.name,
        folderId: state.folderId,
        categoryId: state.categoryId,
        lastModified: state.lastModified,
        sessionId: state.sessionId,
      }),
      
      // Version for migrations
      version: 1,
    }
  )
);

/**
 * Check if there's persisted wizard state
 */
export function hasPersistedWizardState(): boolean {
  try {
    const stored = localStorage.getItem('qr-wizard-storage');
    if (!stored) return false;
    
    const parsed = JSON.parse(stored);
    return !!parsed.state?.qrType || !!parsed.state?.qrData;
  } catch {
    return false;
  }
}

/**
 * Get last modification time of persisted state
 */
export function getPersistedStateAge(): number | null {
  try {
    const stored = localStorage.getItem('qr-wizard-storage');
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    const lastModified = parsed.state?.lastModified;
    
    if (!lastModified) return null;
    
    return Date.now() - lastModified;
  } catch {
    return null;
  }
}

/**
 * Check if persisted state is stale (older than 24 hours)
 */
export function isPersistedStateStale(): boolean {
  const age = getPersistedStateAge();
  if (age === null) return false;
  
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  return age > TWENTY_FOUR_HOURS;
}
