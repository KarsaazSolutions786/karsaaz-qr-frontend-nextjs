import { QueryClient, DefaultOptions } from '@tanstack/react-query'

const queryConfig: DefaultOptions = {
  queries: {
    // Never retry on 429 — it amplifies rate-limit cascades badly.
    // For all other errors retry up to 2 times with exponential back-off.
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 429) return false
      return failureCount < 2
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 30 * 1000, // 30 seconds (lists)
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  },
  mutations: {
    retry: 0, // mutations should not auto-retry
  },
}

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
})
