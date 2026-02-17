"use client";

import { createContext, useContext, ReactNode } from 'react';
import { useQRWizard, QRWizardState } from '@/store/use-qr-wizard';

const WizardContext = createContext<QRWizardState | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  // We can use the global store directly, but this context pattern allows for
  // isolated wizard instances if needed in the future (e.g. modals).
  // For now, we'll just proxy the global store to stick to the pattern.
  const state = useQRWizard();
  
  return (
    <WizardContext.Provider value={state}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  // Fallback to global store if not wrapped, or enforce wrapping.
  // Since we are using zustand, we can just use the hook directly.
  return useQRWizard();
}
