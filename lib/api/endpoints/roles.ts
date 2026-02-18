import apiClient from '../client'

export interface RoleEntity {
  id: number
  name: string
  homePage?: string
  permissionIds: number[]
  permissionCount?: number
  userCount?: number
  readOnly?: boolean
  createdAt: string
  updatedAt: string
}

export interface PermissionGroup {
  name: string
  permissions: {
    id: number
    name: string
    description?: string
  }[]
}

export interface RoleListResponse {
  data: RoleEntity[]
  pagination: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}

export const rolesAPI = {
  // Get all roles
  getAll: async (params?: { page?: number; search?: string }) => {
    const response = await apiClient.get<RoleListResponse>('/roles', { params })
    return response.data
  },

  // Get single role
  getById: async (id: number) => {
    const response = await apiClient.get<RoleEntity>(`/roles/${id}`)
    return response.data
  },

  // Create new role
  create: async (data: Partial<RoleEntity>) => {
    const response = await apiClient.post<RoleEntity>('/roles', data)
    return response.data
  },

  // Update role
  update: async (id: number, data: Partial<RoleEntity>) => {
    const response = await apiClient.put<RoleEntity>(`/roles/${id}`, data)
    return response.data
  },

  // Delete role
  delete: async (id: number) => {
    await apiClient.delete(`/roles/${id}`)
  },

  // Get all permissions grouped
  getPermissions: async () => {
    const response = await apiClient.get<PermissionGroup[]>('/permissions')
    return response.data
  },
}
