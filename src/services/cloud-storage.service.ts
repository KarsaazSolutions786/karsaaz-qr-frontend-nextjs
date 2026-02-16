/**
 * Cloud Storage Service
 * OAuth connections for Google Drive, Dropbox, OneDrive, MEGA.
 * Backup job management. All endpoints match Laravel backend exactly.
 */
import apiClient from "@/lib/api-client";

export type CloudProvider = 'google_drive' | 'dropbox' | 'onedrive' | 'mega';

export interface CloudConnection {
  id: string | number;
  provider: CloudProvider;
  label?: string;
  account_email?: string;
  is_active: boolean;
  last_used_at?: string;
  token_expires_at?: string;
}

export interface BackupJob {
  id: string | number;
  connection_id: string | number;
  backup_type: string;
  file_path?: string;
  remote_path?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  error_message?: string;
  started_at?: string;
  completed_at?: string;
}

export const cloudStorageService = {
  // ─── Connections ───────────────────────────────────────

  /** GET /api/cloud-storage/connections — list all connected accounts */
  getConnections: async (): Promise<{ data: CloudConnection[] }> => {
    return apiClient.get("/cloud-storage/connections");
  },

  /** GET /api/cloud-storage/connections/{id} — get single connection */
  getConnection: async (id: string | number): Promise<{ data: CloudConnection }> => {
    return apiClient.get(`/cloud-storage/connections/${id}`);
  },

  /** DELETE /api/cloud-storage/connections/{id} — remove a connection */
  deleteConnection: async (id: string | number) => {
    return apiClient.delete(`/cloud-storage/connections/${id}`);
  },

  /** POST /api/cloud-storage/connections/{id}/test — test connection health */
  testConnection: async (id: string | number) => {
    return apiClient.post(`/cloud-storage/connections/${id}/test`);
  },

  // ─── Google Drive OAuth ────────────────────────────────

  /** POST /api/cloud-storage/google_drive/auth-url — get OAuth redirect URL */
  getGoogleDriveAuthUrl: async () => {
    return apiClient.post("/cloud-storage/google_drive/auth-url");
  },

  /** POST /api/cloud-storage/google_drive/callback — exchange code for tokens */
  handleGoogleDriveCallback: async (code: string, state?: string) => {
    return apiClient.post("/cloud-storage/google_drive/callback", { code, state });
  },

  /** POST /api/cloud-storage/google_drive/refresh — refresh access token */
  refreshGoogleDriveToken: async (connectionId: string | number) => {
    return apiClient.post("/cloud-storage/google_drive/refresh", { connection_id: connectionId });
  },

  // ─── Dropbox OAuth ─────────────────────────────────────

  /** POST /api/cloud-storage/dropbox/auth-url — get OAuth redirect URL */
  getDropboxAuthUrl: async () => {
    return apiClient.post("/cloud-storage/dropbox/auth-url");
  },

  /** POST /api/cloud-storage/dropbox/callback — exchange code for tokens */
  handleDropboxCallback: async (code: string, state?: string) => {
    return apiClient.post("/cloud-storage/dropbox/callback", { code, state });
  },

  /** POST /api/cloud-storage/dropbox/refresh — refresh access token */
  refreshDropboxToken: async (connectionId: string | number) => {
    return apiClient.post("/cloud-storage/dropbox/refresh", { connection_id: connectionId });
  },

  // ─── OneDrive OAuth ────────────────────────────────────

  /** POST /api/cloud-storage/onedrive/auth-url — get OAuth redirect URL */
  getOneDriveAuthUrl: async () => {
    return apiClient.post("/cloud-storage/onedrive/auth-url");
  },

  /** POST /api/cloud-storage/onedrive/callback — exchange code for tokens */
  handleOneDriveCallback: async (code: string, state?: string) => {
    return apiClient.post("/cloud-storage/onedrive/callback", { code, state });
  },

  /** POST /api/cloud-storage/onedrive/refresh — refresh access token */
  refreshOneDriveToken: async (connectionId: string | number) => {
    return apiClient.post("/cloud-storage/onedrive/refresh", { connection_id: connectionId });
  },

  // ─── MEGA (credential-based) ───────────────────────────

  /** POST /api/cloud-storage/mega/connect — connect MEGA with email/password */
  connectMega: async (credentials: { email: string; password: string; label?: string }) => {
    return apiClient.post("/cloud-storage/mega/connect", credentials);
  },

  /** POST /api/cloud-storage/mega/test — test MEGA credentials */
  testMega: async (credentials: { email: string; password: string }) => {
    return apiClient.post("/cloud-storage/mega/test", credentials);
  },

  // ─── Helper: get auth URL by provider ─────────────────

  /** Get OAuth auth URL for any OAuth provider (google_drive, dropbox, onedrive) */
  getAuthUrl: async (provider: Exclude<CloudProvider, 'mega'>) => {
    const map = {
      google_drive: () => cloudStorageService.getGoogleDriveAuthUrl(),
      dropbox: () => cloudStorageService.getDropboxAuthUrl(),
      onedrive: () => cloudStorageService.getOneDriveAuthUrl(),
    };
    return map[provider]();
  },

  /** Handle OAuth callback for any OAuth provider */
  handleCallback: async (provider: Exclude<CloudProvider, 'mega'>, code: string, state?: string) => {
    const map = {
      google_drive: () => cloudStorageService.handleGoogleDriveCallback(code, state),
      dropbox: () => cloudStorageService.handleDropboxCallback(code, state),
      onedrive: () => cloudStorageService.handleOneDriveCallback(code, state),
    };
    return map[provider]();
  },

  // ─── Backup Jobs ───────────────────────────────────────

  /** POST /api/cloud-storage/backup — create a new backup job */
  createBackup: async (data: { connection_id: string | number; backup_type?: string }) => {
    return apiClient.post("/cloud-storage/backup", data);
  },

  /** GET /api/cloud-storage/backup-jobs — list all backup jobs */
  getBackupJobs: async (params?: { page?: number }): Promise<{ data: BackupJob[] }> => {
    return apiClient.get("/cloud-storage/backup-jobs", params);
  },

  /** GET /api/cloud-storage/backup-jobs/{id} — get single backup job */
  getBackupJob: async (id: string | number): Promise<{ data: BackupJob }> => {
    return apiClient.get(`/cloud-storage/backup-jobs/${id}`);
  },

  /** DELETE /api/cloud-storage/backup-jobs/{id} — delete a backup job record */
  deleteBackupJob: async (id: string | number) => {
    return apiClient.delete(`/cloud-storage/backup-jobs/${id}`);
  },
};

export default cloudStorageService;
