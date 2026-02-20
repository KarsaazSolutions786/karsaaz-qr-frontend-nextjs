'use client';

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { PluginManager } from './PluginManager';

interface PluginContextValue {
  manager: PluginManager;
  applyFilters: typeof PluginManager.applyFilters;
  doActions: typeof PluginManager.doActions;
  isReady: boolean;
}

const PluginContext = createContext<PluginContextValue | null>(null);

export function PluginProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure singleton is initialised
    PluginManager.instance();
    setIsReady(true);
  }, []);

  return (
    <PluginContext.Provider
      value={{
        manager: PluginManager.instance(),
        applyFilters: PluginManager.applyFilters,
        doActions: PluginManager.doActions,
        isReady,
      }}
    >
      {children}
    </PluginContext.Provider>
  );
}

export function usePlugins() {
  const ctx = useContext(PluginContext);
  if (!ctx) {
    throw new Error('usePlugins must be used inside <PluginProvider>');
  }
  return ctx;
}
