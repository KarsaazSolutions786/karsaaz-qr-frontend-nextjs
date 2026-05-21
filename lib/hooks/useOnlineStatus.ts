'use client'

import { useSyncExternalStore } from 'react'

/**
 * Purpose: Executes subscribe functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
function subscribe(callback: () => void) {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

/**
 * Purpose: Retrieves snapshot.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
function getSnapshot() {
  return navigator.onLine
}

/**
 * Purpose: Retrieves serversnapshot.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
function getServerSnapshot() {
  return true
}

/**
 * Purpose: Hook that reactively tracks online/offline status. Uses useSyncExternalStore for tear-free reads.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function useOnlineStatus(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export default useOnlineStatus
