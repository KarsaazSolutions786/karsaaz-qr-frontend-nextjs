/**
 * Utility Service
 * Captcha, markdown, translations, security monitoring, calling codes, health check.
 * Fully synced with Laravel backend API.
 */
import apiClient from "@/lib/api-client";

export const utilityService = {
  // ─── General Utilities ─────────────────────────────────

  /** GET /api/health — Health check (no auth) */
  healthCheck: async () => {
    return apiClient.get("/health");
  },

  /** GET /api/captcha — Generate a captcha image */
  getCaptcha: async () => {
    return apiClient.get("/captcha");
  },

  /** POST /api/markdown — Preview markdown as HTML */
  previewMarkdown: async (markdown: string) => {
    return apiClient.post("/markdown", { markdown });
  },

  // ─── Translations ──────────────────────────────────────

  /** GET /api/translations/active — Get active/enabled translation locales (no auth) */
  getActiveTranslations: async () => {
    return apiClient.get("/translations/active");
  },

  /** GET /api/translations/can-auto-translate — Check if auto-translate is configured */
  canAutoTranslate: async () => {
    return apiClient.get("/translations/can-auto-translate");
  },

  /** POST /api/translations/auto-translate — Auto-translate a language */
  autoTranslate: async (data: { language: string; source_language?: string }) => {
    return apiClient.post("/translations/auto-translate", data);
  },

  /** POST /api/translations/export — Export a translation as a file */
  exportTranslations: async (data: { language: string }) => {
    return apiClient.post("/translations/export", data);
  },

  /** POST /api/translations/import — Import translations from a file */
  importTranslations: async (file: File, language: string) => {
    return apiClient.upload("/translations/import", {
      file,
      language: language as any,
    });
  },

  // ─── Calling Codes ─────────────────────────────────────

  /** GET /api/utils/list-calling-codes — List all country calling codes (no auth) */
  getCallingCodes: async () => {
    return apiClient.get("/utils/list-calling-codes");
  },

  /** GET /api/utils/my-calling-code — Detect user's calling code by IP */
  getMyCallingCode: async () => {
    return apiClient.get("/utils/my-calling-code");
  },

  // ─── Fonts ─────────────────────────────────────────────

  /** GET /api/fonts — List Google Fonts (no auth) */
  getFonts: async () => {
    return apiClient.get("/fonts");
  },

  // ─── Security Monitoring ───────────────────────────────

  /** POST /api/security/devtools-attempt — Log a DevTools open attempt (rate: 10/min) */
  reportDevToolsAttempt: async (data?: { url?: string }) => {
    return apiClient.post("/security/devtools-attempt", data);
  },

  /** POST /api/security/devtools-detected — Log a confirmed DevTools detection (rate: 10/min) */
  reportDevToolsDetected: async (data?: { url?: string }) => {
    return apiClient.post("/security/devtools-detected", data);
  },
};

export default utilityService;
