'use client'

import React, { useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/query/client'
import { AuthProvider } from '@/lib/context/AuthContext'
import { TranslationProvider } from '@/lib/i18n'
import { PluginProvider } from '@/lib/plugins'
import { ThemeProvider } from '@/lib/providers/theme-provider'
import { devToolsProtection } from '@/lib/services/devtools-protection'
import { iframeDetector } from '@/lib/services/iframe-detector'

/** Initialize client-side protection services (T021) */
function ProtectionInitializer() {
  useEffect(() => {
    devToolsProtection.init();
    iframeDetector.init();
    return () => {
      devToolsProtection.destroy();
      iframeDetector.destroy();
    };
  }, []);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TranslationProvider>
            <PluginProvider>
              <ProtectionInitializer />
              {children}
            </PluginProvider>
          </TranslationProvider>
          {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
