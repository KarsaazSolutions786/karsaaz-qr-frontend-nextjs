// useNetworkStatus Hook (T015)
// Exposes network status from NetworkManager

'use client';

import { useState, useEffect } from 'react';
import { networkManager } from '@/lib/services/network-manager';

interface NetworkStatus {
  isOnline: boolean;
  connectionType: string;
  isSlow: boolean;
}

/**
 * Purpose: Executes useNetworkStatus functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(() => networkManager.getStatus());

  useEffect(() => {
    networkManager.init();
    const unsubscribe = networkManager.subscribe(setStatus);
    return () => {
      unsubscribe();
    };
  }, []);

  return status;
}
