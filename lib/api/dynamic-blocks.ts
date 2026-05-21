/**
 * Dynamic Biolink Blocks API Client
 * Fetches block definitions from the backend API
 */

import apiClient from './client'
import { DynamicBlockDefinition } from '@/types/entities/dynamic-blocks'

// Fetch all active dynamic block definitions
/**
 * Purpose: Executes fetchDynamicBlockDefinitions functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export async function fetchDynamicBlockDefinitions(): Promise<DynamicBlockDefinition[]> {
  try {
    const response = await apiClient.get<DynamicBlockDefinition[]>(
      '/dynamic-biolink-blocks?list_all=true'
    )
    return response.data || []
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Failed to fetch dynamic block definitions:', error)
    return []
  }
}

// Fetch a single dynamic block definition by ID
/**
 * Purpose: Executes fetchDynamicBlockDefinition functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export async function fetchDynamicBlockDefinition(
  id: string
): Promise<DynamicBlockDefinition | null> {
  try {
    const response = await apiClient.get<DynamicBlockDefinition>(`/dynamic-biolink-blocks/${id}`)
    return response.data
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error(`Failed to fetch dynamic block definition ${id}:`, error)
    return null
  }
}

// React Query hook for dynamic block definitions
import { useQuery } from '@tanstack/react-query'

/**
 * Purpose: Executes useDynamicBlockDefinitions functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useDynamicBlockDefinitions() {
  return useQuery({
    queryKey: ['dynamic-block-definitions'],
    queryFn: fetchDynamicBlockDefinitions,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

/**
 * Purpose: Executes useDynamicBlockDefinition functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useDynamicBlockDefinition(id: string | null) {
  return useQuery({
    queryKey: ['dynamic-block-definition', id],
    queryFn: () => (id ? fetchDynamicBlockDefinition(id) : null),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}
