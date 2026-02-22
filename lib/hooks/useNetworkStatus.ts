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
