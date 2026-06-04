'use client'

import React, { useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/query/client'
import { AuthProvider } from '@/lib/context/AuthContext'
import { GuestProvider } from '@/lib/context/GuestContext'
import { TranslationProvider } from '@/lib/i18n'
import { PluginProvider } from '@/lib/plugins'
import { ThemeProvider } from '@/lib/providers/theme-provider'
import { devToolsProtection } from '@/lib/services/devtools-protection'
import { iframeDetector } from '@/lib/services/iframe-detector'
import { WebVitalsReporter } from '@/components/common/WebVitalsReporter'
import { OfflineIndicator } from '@/components/common/OfflineIndicator'
import { Toaster } from 'sonner'

/**
 * Purpose: * Initialize client-side protection services (T021)
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

function ProtectionInitializer() {
  useEffect(() => {
    devToolsProtection.init()
    iframeDetector.init()
    return () => {
      devToolsProtection.destroy()
      iframeDetector.destroy()
    }
  }, [])
  return null
}

/**
 * Purpose: Executes Providers functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function Providers({ children }: { children: React.ReactNode }) {
  // BUG-18: ThemeProvider must sit INSIDE the auth/query providers, not above
  // them. next-themes re-renders its subtree when the theme changes; keeping it
  // below AuthProvider guarantees a theme toggle can never re-render/remount the
  // auth tree and drop the session.
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GuestProvider>
          <TranslationProvider>
            <PluginProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
              >
                <ProtectionInitializer />
                <WebVitalsReporter />
                <OfflineIndicator />
                <Toaster position="top-right" richColors closeButton duration={4000} />
                {children}
              </ThemeProvider>
            </PluginProvider>
          </TranslationProvider>
        </GuestProvider>
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
      </AuthProvider>
    </QueryClientProvider>
  )
}
