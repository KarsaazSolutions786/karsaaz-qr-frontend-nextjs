import apiClient from '@/lib/api/client'

export interface Folder {
  id: number
  name: string
  user_id: number
  qrcode_count: number
  created_at?: string
  updated_at?: string
}

export interface CreateFolderData {
  folder_name: string
}

export interface UpdateFolderData {
  folder_name: string
}


export const foldersAPI = {
  listByUser: async (userId: number | string): Promise<Folder[]> => {
    const response = await apiClient.get<Folder[]>(`/folders/${userId}`)
    return response.data
  },
  get: async (userId: number | string, folderId: number | string): Promise<Folder> => {
    const response = await apiClient.get<Folder>(`/folders/${userId}/${folderId}`)
    return response.data
  },

  create: async (userId: number | string, data: CreateFolderData): Promise<Folder> => {
    const response = await apiClient.post<Folder>(`/folders/${userId}`, data)
    return response.data
  },
  update: async (
    userId: number | string,
    folderId: number | string,
    data: UpdateFolderData
  ): Promise<Folder> => {
    const response = await apiClient.put<Folder>(`/folders/${userId}/${folderId}`, data)
    return response.data
  },

  delete: async (
    userId: number | string,
    folderId: number | string,
    options?: { contentAction?: FolderContentAction; targetFolderId?: number | string }
  ): Promise<void> => {
    await apiClient.delete(`/folders/${userId}/${folderId}`, {
      data: {
        content_action: options?.contentAction ?? 'unassign',
        ...(options?.targetFolderId ? { target_folder_id: options.targetFolderId } : {}),
      },
    })
  },
}

export type FolderContentAction = 'delete_all' | 'move' | 'unassign'
