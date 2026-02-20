import apiClient from '../client'
import type { User } from '@/types/entities/user'

export interface UserListResponse {
  data: User[]
  pagination: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}

export const usersAPI = {
  // Get all users
  getAll: async (params?: { page?: number; per_page?: number; search?: string; paying?: 'paying' | 'non-paying'; number_of_qrcodes?: string }) => {
    const response = await apiClient.get<UserListResponse>('/users', { params })
    return response.data
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
    const response = await apiClient.post<{ url: string }>(`/account/generate-magic-login-url/${id}`)
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
  inviteSubUser: async (userId: number, data: { name: string; email: string; mobile?: string; folder_id: string }) => {
    const response = await apiClient.post<User>(`/users/${userId}/invite-sub-user`, data)
    return response.data
  },

  /**
   * Update which folders a sub-user can access.
   * Endpoint: POST /users/:parentId/sub-users/:subUserId/update-folders
   */
  updateSubUserFolders: async (parentId: number, subUserId: number, folderIds: string[]) => {
    const response = await apiClient.post(`/users/${parentId}/sub-users/${subUserId}/update-folders`, {
      folder_ids: folderIds,
    })
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
