import apiClient from '../client'
import { normalizePagination, type PaginatedResponse } from '../pagination'
import type { User } from '@/types/entities/user'

// Normalized pagination for frontend consumption
export type UserListResponse = PaginatedResponse<User>

export const usersAPI = {
  // Get all users with proper backend param mapping
  getAll: async (params?: {
    page?: number
    per_page?: number
    search?: string
    paying?: 'paying' | 'non-paying'
    number_of_qrcodes?: string
    role_id?: string
    status?: string
    plan_id?: string
    date_from?: string
    date_to?: string
  }) => {
    // Map frontend params to backend expected format
    const apiParams: Record<string, any> = { page: params?.page || 1 }

    // Backend uses 'keyword' not 'search'
    if (params?.search) apiParams.keyword = params.search

    // Backend expects paying as boolean: true = paying, false = non-paying
    if (params?.paying === 'paying') apiParams.paying = true
    else if (params?.paying === 'non-paying') apiParams.paying = false

    // Pass through other filters
    if (params?.number_of_qrcodes) apiParams.number_of_qrcodes = params.number_of_qrcodes
    if (params?.role_id) apiParams.role_id = params.role_id
    if (params?.status) apiParams.status = params.status
    if (params?.plan_id) apiParams.plan_id = params.plan_id
    if (params?.date_from) apiParams.date_from = params.date_from
    if (params?.date_to) apiParams.date_to = params.date_to

    const response = await apiClient.get('/users', { params: apiParams })
    return normalizePagination<User>(response.data)
  },

  // Get single user
  getById: async (id: number) => {
    const response = await apiClient.get<User>(`/users/${id}`)
    return response.data
  },

  // Create new user
  create: async (data: Partial<User>) => {
    const response = await apiClient.post<User>('/users', data)
    return response.data
  },

  // Update user
  update: async (id: number, data: Partial<User>) => {
    const response = await apiClient.put<User>(`/users/${id}`, data)
    return response.data
  },

  // Delete user
  delete: async (id: number) => {
    await apiClient.delete(`/users/${id}`)
  },

  // Act as user (admin impersonation)
  actAs: async (id: number) => {
    const response = await apiClient.post(`/account/act-as/${id}`)
    return response.data
  },

  // Reset user role
  resetRole: async (id: number) => {
    const response = await apiClient.post(`/users/${id}/reset-role`)
    return response.data
  },

  // Generate magic login URL
  generateMagicUrl: async (id: number) => {
    const response = await apiClient.post<{ url: string }>(
      `/account/generate-magic-login-url/${id}`
    )
    return response.data
  },

  // Reset user scans limit
  resetScansLimit: async (id: number) => {
    const response = await apiClient.post(`/users/${id}/reset-scans-limit`)
    return response.data
  },

  // Verify user email
  verifyEmail: async (id: number) => {
    const response = await apiClient.post(`/users/verify-email/${id}`)
    return response.data
  },

  // ── Sub-User Management ──
  // Backend endpoints: /users/{user}/sub-users, /users/{user}/invite-sub-user

  /**
   * Get all sub-users for a specific parent user.
   * Endpoint: GET /users/:userId/sub-users
   */
  getSubUsers: async (userId: number) => {
    const response = await apiClient.get<User[]>(`/users/${userId}/sub-users`)
    return response.data
  },

  /**
   * Invite a new sub-user under the specified parent user.
   * Endpoint: POST /users/:userId/invite-sub-user
   */
  inviteSubUser: async (
    userId: number,
    data: { name: string; email: string; mobile?: string; folder_id: string }
  ) => {
    const response = await apiClient.post<User>(`/users/${userId}/invite-sub-user`, data)
    return response.data
  },

  /**
   * Update which folders a sub-user can access.
   * Endpoint: POST /users/:parentId/sub-users/:subUserId/update-folders
   */
  updateSubUserFolders: async (parentId: number, subUserId: number, folderIds: string[]) => {
    const response = await apiClient.post(
      `/users/${parentId}/sub-users/${subUserId}/update-folders`,
      {
        folder_ids: folderIds,
      }
    )
    return response.data
  },

  /**
   * Delete a sub-user.
   * Endpoint: DELETE /users/:parentId/sub-users/:subUserId
   */
  deleteSubUser: async (parentId: number, subUserId: number) => {
    await apiClient.delete(`/users/${parentId}/sub-users/${subUserId}`)
  },
}
