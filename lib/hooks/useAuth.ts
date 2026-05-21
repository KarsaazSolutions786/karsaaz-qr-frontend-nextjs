'use client'

import { useContext } from 'react'
import { AuthContext, AuthContextType } from '@/lib/context/AuthContext'

/**
 * Purpose: Executes useAuth functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
