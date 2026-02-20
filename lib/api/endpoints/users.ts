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
  getAll: async (params?: { page?: number; search?: string; paying?: 'paying' | 'non-paying' }) => {
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

  // Get sub-users for a user
  getSubUsers: async (userId: number) => {
    const response = await apiClient.get<User[]>(`/users/${userId}/sub-users`)
    return response.data
  },

  // Invite a sub-user
  inviteSubUser: async (userId: number, data: { name: string; email: string; mobile?: string; folder_id: string }) => {
    const response = await apiClient.post<User>(`/users/${userId}/invite-sub-user`, data)
    return response.data
  },

  // Update sub-user folder access
  updateSubUserFolders: async (userId: number, subUserId: number, folderIds: string[]) => {
    const response = await apiClient.post(`/users/${userId}/sub-users/${subUserId}/update-folders`, {
      folder_ids: folderIds,
    })
    return response.data
  },

  // Delete sub-user
  deleteSubUser: async (userId: number, subUserId: number) => {
    await apiClient.delete(`/users/${userId}/sub-users/${subUserId}`)
  },
}
