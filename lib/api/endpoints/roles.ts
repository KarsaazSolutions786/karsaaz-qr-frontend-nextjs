import apiClient from '../client'

/**
 * Role entity — matches backend snake_case convention.
 * super_admin: truthy means this role bypasses all permission checks.
 * read_only: system roles that cannot be modified/deleted.
 */
export interface RoleEntity {
  id: number
  name: string
  /** Default landing page after login for users with this role */
  home_page?: string
  /** Whether this role bypasses all RBAC permission checks */
  super_admin?: boolean | number
  /** Array of permission IDs assigned to this role */
  permission_ids: number[]
  /** Number of permissions (computed field) */
  permission_count?: number
  /** Number of users with this role (computed field) */
  user_count?: number
  /** System role — cannot be edited or deleted */
  read_only?: boolean
  created_at: string
  updated_at: string
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
