'use client'

import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { WifiOff } from 'lucide-react'

/**
 * Banner displayed when the user goes offline.
 * Automatically hides when connectivity is restored.
 */
export function OfflineNotification() {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div
      role="alert"
      className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800 shadow-lg"
    >
      <WifiOff className="h-4 w-4 flex-shrink-0" />
      <span>You are offline. Some features may be unavailable.</span>
    </div>
  )
}

export default OfflineNotification
