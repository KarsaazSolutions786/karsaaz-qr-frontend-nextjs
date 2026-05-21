'use client'

import { useContext } from 'react'
import { GuestContext, type GuestContextType } from '@/lib/context/GuestContext'

/**
 * Purpose: Executes useGuest functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function useGuest(): GuestContextType {
  const context = useContext(GuestContext)
  if (context === undefined) {
    throw new Error('useGuest must be used within GuestProvider')
  }
  return context
}
