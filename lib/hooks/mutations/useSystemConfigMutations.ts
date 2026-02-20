import { useMutation, useQueryClient } from '@tanstack/react-query'
import { systemConfigsAPI, SystemConfig } from '@/lib/api/endpoints/system-configs'
import { queryKeys } from '@/lib/query/keys'

export function useSaveSystemConfigs(keys?: string[]) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (configs: SystemConfig[]) => systemConfigsAPI.save(configs),
    onSuccess: () => {
      if (keys && keys.length > 0) {
        queryClient.invalidateQueries({ queryKey: queryKeys.systemConfigs.byKeys(keys) })
      } else {
        queryClient.invalidateQueries({ queryKey: ['system-configs'] })
      }
    },
  })
}
