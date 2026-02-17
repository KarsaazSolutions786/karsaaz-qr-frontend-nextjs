import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export type QRType = 'url' | 'vcard' | 'text' | 'email' | 'sms' | 'wifi' | 'bitcoin' | 'pdf' | 'app' | 'image' | 'video' | 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'whatsapp' | 'telegram' | 'tiktok';

export interface QRDesignConfig {
  background: {
    color: string;
    type: 'solid' | 'gradient' | 'image';
    gradientType?: 'linear' | 'radial';
    gradientColor1?: string;
    gradientColor2?: string;
    image?: string;
  };
  dots: {
    color: string;
    type: string;
  };
  corners: {
    squareColor: string;
    dotColor: string;
    type: string;
  };
  frame: {
    color: string;
    type: string; // 'none' or frame id
  };
  logo: {
    url?: string;
    scale: number;
    margin: number;
  };
}

export interface StickerConfig {
  id: string;
  text: string;
  shadow: boolean;
  color?: string;
}

export interface QRWizardState {
  currentStep: number;
  qrType: QRType | null;
  qrData: Record<string, any>;
  design: QRDesignConfig;
  sticker: StickerConfig;
  
  // Actions
  setStep: (step: number) => void;
  setQRType: (type: QRType) => void;
  setQRData: (data: Record<string, any>) => void;
  updateDesign: (updates: Partial<QRDesignConfig>) => void;
  updateSticker: (updates: Partial<StickerConfig>) => void;
  resetWizard: () => void;
}

const initialDesign: QRDesignConfig = {
  background: { color: '#ffffff', type: 'solid' },
  dots: { color: '#000000', type: 'square' },
  corners: { squareColor: '#000000', dotColor: '#000000', type: 'square' },
  frame: { color: '#000000', type: 'none' },
  logo: { scale: 1, margin: 5 }
};

export const useQRWizard = create<QRWizardState>()(
  persist(
    immer((set) => ({
      currentStep: 0,
      qrType: null,
      qrData: {},
      design: initialDesign,
      sticker: { id: 'none', text: 'Scan me', shadow: false },

      setStep: (step) => set((state) => { state.currentStep = step; }),
      setQRType: (type) => set((state) => { state.qrType = type; }),
      setQRData: (data) => set((state) => { state.qrData = data; }),
      
      updateDesign: (updates) => set((state) => {
        // Deep merge logic simplified for immer
        if (updates.background) Object.assign(state.design.background, updates.background);
        if (updates.dots) Object.assign(state.design.dots, updates.dots);
        if (updates.corners) Object.assign(state.design.corners, updates.corners);
        if (updates.frame) Object.assign(state.design.frame, updates.frame);
        if (updates.logo) Object.assign(state.design.logo, updates.logo);
      }),

      updateSticker: (updates) => set((state) => {
        Object.assign(state.sticker, updates);
      }),

      resetWizard: () => set((state) => {
        state.currentStep = 0;
        state.qrType = null;
        state.qrData = {};
        state.design = initialDesign;
      })
    })),
    {
      name: 'qr-wizard-storage',
      partialize: (state) => ({ 
        qrType: state.qrType, 
        qrData: state.qrData,
        design: state.design,
        sticker: state.sticker
      }), // Don't persist currentStep to avoid getting stuck
    }
  )
);
