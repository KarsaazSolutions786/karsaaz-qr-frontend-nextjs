/**
 * Folder Service
 * CRUD for QR code folders.
 */
import apiClient from "@/lib/api-client";

export interface Folder {
  id: string | number;
  name: string;
  qrcodes_count?: number;
  created_at?: string;
}

export const folderService = {
  /** GET /api/folders/{userId} — Get folders for a specific user */
  getFolders: async (userId: string | number) => {
    return apiClient.get(`/folders/${userId}`);
  },

  /** POST /api/folders/{userId} — Create folder */
  createFolder: async (userId: string | number, name: string) => {
    return apiClient.post(`/folders/${userId}`, { name });
  },

  /** PUT /api/folders/{userId}/{id} — Update folder */
  updateFolder: async (userId: string | number, id: string | number, name: string) => {
    return apiClient.put(`/folders/${userId}/${id}`, { name });
  },

  /** DELETE /api/folders/{userId}/{id} — Delete folder */
  deleteFolder: async (userId: string | number, id: string | number) => {
    return apiClient.delete(`/folders/${userId}/${id}`);
  },
};

export default folderService;
