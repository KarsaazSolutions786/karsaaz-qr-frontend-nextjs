'use client'

import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/lib/context/AuthContext'

const TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes
const WARNING_MS = 5 * 60 * 1000 // 5 minutes before timeout

export function SessionTimeout() {
  const { user, logout } = useAuth()
  const [showWarning, setShowWarning] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const warningRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    if (!user) return

    const resetTimers = () => {
      clearTimeout(timeoutRef.current)
      clearTimeout(warningRef.current)
      setShowWarning(false)
      warningRef.current = setTimeout(() => setShowWarning(true), TIMEOUT_MS - WARNING_MS)
      timeoutRef.current = setTimeout(() => {
        logout()
      }, TIMEOUT_MS)
    }

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    events.forEach((e) => document.addEventListener(e, resetTimers))
    resetTimers()

    return () => {
      events.forEach((e) => document.removeEventListener(e, resetTimers))
      clearTimeout(timeoutRef.current)
      clearTimeout(warningRef.current)
    }
  }, [user, logout])

  if (!showWarning) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4 shadow-xl">
        <h3 className="text-lg font-semibold dark:text-white">Session Expiring</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Your session will expire in 5 minutes due to inactivity. Move your mouse or press any key to stay logged in.
        </p>
        <button
          onClick={() => setShowWarning(false)}
          className="mt-4 w-full rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
        >
          Stay Logged In
        </button>
      </div>
    </div>
  )
}
