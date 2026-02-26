'use client'

import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api/client'

interface AppConfig {
  auth0_enabled?: boolean
  config?: Record<string, string>
}

/**
 * Hook to fetch general app configuration
 */
export function useAppConfig() {
  return useQuery({
    queryKey: ['app-config'],
    queryFn: async () => {
      const response = await apiClient.get<AppConfig>('/config')
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - config rarely changes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 1,
  })
}

/**
 * Hook to check if Auth0 is enabled
 */
export function useAuth0Enabled() {
  const { data, isLoading, error } = useAppConfig()

  const enabled = data
    ? data.auth0_enabled === true || data.config?.['auth0.enabled'] === 'enabled'
    : false

  return {
    enabled,
    isLoading,
    error,
  }
}
