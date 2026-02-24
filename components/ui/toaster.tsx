'use client'

import { ToastContextProvider } from './toast'

export function Toaster({ children }: { children: React.ReactNode }) {
  return <ToastContextProvider>{children}</ToastContextProvider>
}

export default Toaster
