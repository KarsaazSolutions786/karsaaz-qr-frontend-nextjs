import { useQuery } from '@tanstack/react-query'
import { organizationAPI } from '@/lib/api/endpoints/organization'

export const useOrganizations = () => {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const response = await organizationAPI.list()
      return response.data.data ?? []
    },
  })
}
