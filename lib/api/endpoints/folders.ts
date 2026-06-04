import apiClient from '@/lib/api/client'

// Backend Folder shape: { id, name, user_id, qrcode_count }
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

// Folder API functions — matches backend routes in api.php
export const foldersAPI = {
  // List folders for a user — GET /folders/{userId}
  listByUser: async (userId: number | string): Promise<Folder[]> => {
    const response = await apiClient.get<Folder[]>(`/folders/${userId}`)
    return response.data
  },

  // Get single folder — GET /folders/{userId}/{folderId}
  get: async (userId: number | string, folderId: number | string): Promise<Folder> => {
    const response = await apiClient.get<Folder>(`/folders/${userId}/${folderId}`)
    return response.data
  },

  // Create folder — POST /folders/{userId}
  create: async (userId: number | string, data: CreateFolderData): Promise<Folder> => {
    const response = await apiClient.post<Folder>(`/folders/${userId}`, data)
    return response.data
  },

  // Update folder — PUT /folders/{userId}/{folderId}
  update: async (
    userId: number | string,
    folderId: number | string,
    data: UpdateFolderData
  ): Promise<Folder> => {
    const response = await apiClient.put<Folder>(`/folders/${userId}/${folderId}`, data)
    return response.data
  },

  // Delete folder — DELETE /folders/{userId}/{folderId}
  // content_action decides what happens to the QR codes inside:
  //   'delete_all' → soft-delete them too (recoverable from trash)
  //   'move'       → reassign them to targetFolderId
  //   'unassign'   → detach them, keeping the QR codes (default, safest)
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
