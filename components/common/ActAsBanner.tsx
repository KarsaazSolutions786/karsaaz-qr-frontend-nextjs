'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

/**
 * Banner shown when admin is impersonating another user.
 * Displays warning with user email and "Stop Impersonating" button.
 */
export function ActAsBanner() {
  const { isActingAs, actingAsUser, removeActAs } = useAuth()
  const router = useRouter()

  if (!isActingAs) return null

  function handleStop() {
    removeActAs()
    router.push('/users')
    setTimeout(() => window.location.reload(), 100)
  }

  return (
    <div className="bg-yellow-500 text-yellow-900 px-4 py-2 flex items-center justify-between text-sm z-50">
      <div className="flex items-center gap-2">
        <ExclamationTriangleIcon className="h-5 w-5" />
        <span className="font-medium">
          Impersonating: {actingAsUser?.email || 'Unknown user'}
        </span>
      </div>
      <button
        onClick={handleStop}
        className="rounded-md bg-yellow-600 px-3 py-1 text-xs font-semibold text-white hover:bg-yellow-700 transition-colors"
      >
        Stop Impersonating
      </button>
    </div>
  )
}
