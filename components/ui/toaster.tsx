'use client'

import { ToastContextProvider } from './toast'

/**
 * Purpose: Executes Toaster functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function Toaster({ children }: { children: React.ReactNode }) {
  return <ToastContextProvider>{children}</ToastContextProvider>
}

export default Toaster
