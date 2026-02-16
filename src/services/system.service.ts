/**
 * System Service
 * System health, settings, logs, cache, DB migrations, notifications,
 * SMS portals, auth workflow, and config file upload.
 * Fully synced with Laravel backend API.
 */
import apiClient from "@/lib/api-client";

export const systemService = {
  // ─── Status ────────────────────────────────────────────

  /** GET /api/system/status — System health, version, disk & queue info */
  getStatus: async () => {
    return apiClient.get("/system/status");
  },

  // ─── Settings / Configs ────────────────────────────────

  /** GET /api/system/configs — All application settings */
  getSettings: async () => {
    return apiClient.get("/system/configs");
  },

  /** POST /api/system/configs — Update application settings */
  updateSettings: async (settings: Record<string, any>) => {
    return apiClient.post("/system/configs", settings);
  },

  /** POST /api/system/configs/upload — Upload a config/settings file */
  uploadConfigFile: async (file: File) => {
    return apiClient.upload("/system/configs/upload", { file });
  },

  // ─── Database Migrations ───────────────────────────────

  /** GET /api/system/check_database_update — Check if DB migrations are pending */
  checkDatabaseUpdate: async () => {
    return apiClient.get("/system/check_database_update");
  },

  /** POST /api/system/update_database — Run pending DB migrations */
  updateDatabase: async () => {
    return apiClient.post("/system/update_database");
  },

  // ─── Logs ──────────────────────────────────────────────

  /** GET /api/system/logs — Application log entries */
  getLogs: async (params?: { page?: number }) => {
    return apiClient.get("/system/logs", params as any);
  },

  /** POST /api/system/log-file — Generate and get log file download URL */
  downloadLogFile: async () => {
    return apiClient.post("/system/log-file");
  },

  /** DELETE /api/system/log-file — Clear the log file */
  deleteLogFile: async () => {
    return apiClient.delete("/system/log-file");
  },

  // ─── Cache ─────────────────────────────────────────────

  /** POST /api/system/clear-cache/{type} — Clear a cache type */
  clearCache: async (type: 'config' | 'route' | 'view' | 'event' | 'all' | string) => {
    return apiClient.post(`/system/clear-cache/${type}`);
  },

  /** POST /api/system/rebuild-cache/{type} — Rebuild a cache type */
  rebuildCache: async (type: 'config' | 'route' | 'view' | 'event' | 'all' | string) => {
    return apiClient.post(`/system/rebuild-cache/${type}`);
  },

  // ─── Notifications ─────────────────────────────────────

  /** GET /api/system/notifications — Get notification settings */
  getNotificationSettings: async () => {
    return apiClient.get("/system/notifications");
  },

  /** POST /api/system/notifications — Update notification settings */
  updateNotificationSettings: async (data: Record<string, any>) => {
    return apiClient.post("/system/notifications", data);
  },

  // ─── SMS Portals ───────────────────────────────────────

  /** GET /api/system/sms-portals — Get SMS gateway configs */
  getSmsPortals: async () => {
    return apiClient.get("/system/sms-portals");
  },

  /** POST /api/system/sms-portals — Update SMS gateway configs */
  updateSmsPortals: async (data: Record<string, any>) => {
    return apiClient.post("/system/sms-portals", data);
  },

  // ─── Auth Workflow ─────────────────────────────────────

  /** GET /api/system/auth-workflow — Get auth workflow config (OTP, social, 2FA settings) */
  getAuthWorkflow: async () => {
    return apiClient.get("/system/auth-workflow");
  },

  /** POST /api/system/auth-workflow — Update auth workflow config */
  updateAuthWorkflow: async (data: Record<string, any>) => {
    return apiClient.post("/system/auth-workflow", data);
  },

  // ─── SMTP & Storage Testing ────────────────────────────

  /** POST /api/system/test-smtp — Send test email to verify SMTP config */
  testSmtp: async (payload?: { email?: string }) => {
    return apiClient.post("/system/test-smtp", payload);
  },

  /** POST /api/system/test-storage — Test file storage configuration */
  testStorage: async (payload?: any) => {
    return apiClient.post("/system/test-storage", payload);
  },

  // ─── Misc ──────────────────────────────────────────────

  /** GET /api/system/timezones — List all available timezones */
  getTimezones: async () => {
    return apiClient.get("/system/timezones");
  },
};

export default systemService;
