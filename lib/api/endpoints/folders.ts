import apiClient from '@/lib/api/client'
import { Folder, CreateFolderData, UpdateFolderData } from '@/types/entities/folder'

// Folder API Endpoints

export interface ListFoldersParams {
  parentId?: string | null // Filter by parent folder
  includeChildren?: boolean // Include nested folders
}

export interface MoveFolderRequest {
  parentId: string | null // New parent folder ID (null for root)
}

export interface MoveQRCodesRequest {
  qrcodeIds: string[] // QR code IDs to move
  folderId: string | null // Target folder ID (null for root)
}

// Folder API functions
export const foldersAPI = {
  // List all folders
  list: async (params: ListFoldersParams = {}) => {
    const response = await apiClient.get<Folder[]>('/folders', { 
      params: {
        parent_id: params.parentId,
        include_children: params.includeChildren,
      }
    })
    return response.data
  },

  // Get single folder
  get: async (id: string) => {
    const response = await apiClient.get<Folder>(`/folders/${id}`)
    return response.data
  },

  // Create folder
  create: async (data: CreateFolderData) => {
    const response = await apiClient.post<Folder>('/folders', {
      name: data.name,
      color: data.color,
      parent_id: data.parentId,
    })
    return response.data
  },

  // Update folder
  update: async (id: string, data: UpdateFolderData) => {
    const response = await apiClient.put<Folder>(`/folders/${id}`, {
      name: data.name,
      color: data.color,
      parent_id: data.parentId,
    })
    return response.data
  },

  // Delete folder
  delete: async (id: string, deleteQRCodes: boolean = false) => {
    await apiClient.delete(`/folders/${id}`, {
      params: {
        delete_qrcodes: deleteQRCodes,
      }
    })
  },

  // Move folder to new parent
  move: async (id: string, data: MoveFolderRequest) => {
    const response = await apiClient.post<Folder>(`/folders/${id}/move`, {
      parent_id: data.parentId,
    })
    return response.data
  },

  // Move QR codes to folder
  moveQRCodes: async (data: MoveQRCodesRequest) => {
    const response = await apiClient.post<{ success: boolean; moved: number }>('/folders/move-qrcodes', {
      qrcode_ids: data.qrcodeIds,
      folder_id: data.folderId,
    })
    return response.data
  },

  // Get folder statistics
  getStats: async (id: string) => {
    const response = await apiClient.get<{
      totalQRCodes: number
      directQRCodes: number
      childFolders: number
      totalChildFolders: number
    }>(`/folders/${id}/stats`)
    return response.data
  },

  // Get folder tree (hierarchical structure)
  getTree: async () => {
    const response = await apiClient.get<Folder[]>('/folders/tree')
    return response.data
  },

  // Get breadcrumb path for folder
  getBreadcrumbs: async (id: string) => {
    const response = await apiClient.get<Folder[]>(`/folders/${id}/breadcrumbs`)
    return response.data
  },
}
