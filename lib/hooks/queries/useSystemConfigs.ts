import { useQuery } from '@tanstack/react-query'
import { systemConfigsAPI } from '@/lib/api/endpoints/system-configs'
import { queryKeys } from '@/lib/query/keys'

/**
 * Purpose: Fetch system configs by keys array. Returns a map: { [key]: value }
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function useSystemConfigs(keys: string[]) {
  return useQuery({
    queryKey: queryKeys.systemConfigs.byKeys(keys),
    queryFn: async () => {
      const configs = await systemConfigsAPI.get(keys)
      const map: Record<string, string> = {}
      for (const cfg of configs) {
        map[cfg.key] = cfg.value ?? ''
      }
      return map
    },
    enabled: keys.length > 0,
    staleTime: 60000,
  })
}
