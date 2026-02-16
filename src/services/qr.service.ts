/**
 * QR Code Service
 * CRUD, analytics, download, bulk operations, folder management, and design.
 * Fully synced with Laravel backend API.
 */
import apiClient from "@/lib/api-client";

export interface QRDesign {
  fillType: 'solid' | 'gradient' | 'foregroundImage';
  foregroundColor: string;
  eyeInternalColor: string;
  eyeExternalColor: string;
  gradientFill?: {
    type: 'linear' | 'radial';
    startColor: string;
    endColor: string;
    rotation: number;
  };
  module: string;
  shape: string;
  frameColor: string;
  finder: string;
  finderDot: string;
  logoScale: number;
  logoPositionX: number;
  logoPositionY: number;
  logoRotate: number;
  logoBackground: boolean;
  logoBackgroundFill: string;
  logoUrl?: string | null;
  logoType: 'none' | 'preset' | 'custom';
  logoBackgroundScale: number;
  logoBackgroundShape: 'circle' | 'square';
  backgroundEnabled: boolean;
  backgroundColor: string;
  advancedShape: string;
  advancedShapeDropShadow: boolean;
  advancedShapeFrameColor: string;
  advancedShapeTextColor?: string;
  advancedShapeFontFamily?: string;
  stickerText?: string;
  is_ai: boolean;
  ai_prompt?: string;
  ai_strength: number;
  ai_steps: number;
  ai_model: string;
  healthcareFrameColor?: string;
  healthcareHeartColor?: string;
  couponLeftColor?: string;
  couponRightColor?: string;
  couponText1?: string;
  couponText2?: string;
  couponText3?: string;
  reviewCollectorLogoSrc?: string;
  reviewCollectorStarsColor?: string;
  reviewCollectorCircleColor?: string;
}

export interface QRCode {
  id: string | number;
  name: string;
  type: string;
  data: Record<string, unknown>;
  design: QRDesign;
  svg_url?: string;
  simple_png_url?: string;
  short_url?: string;
  scans_count?: number;
  folder_id?: string | number;
  created_at?: string;
  updated_at?: string;
  redirect?: { route: string };
  route: string;
  status: 'enabled' | 'disabled';
  archived: boolean;
  pincode?: string;
  is_template: boolean;
  tags?: string;
}

export interface CreateQRCodePayload {
  name: string;
  type: string;
  data: Record<string, unknown>;
  design?: Partial<QRDesign>;
  folder_id?: string | number;
}

export const qrCodeService = {
  // ─── CRUD ──────────────────────────────────────────────

  /** GET /api/qrcodes — Paginated list with search, folder, type filters */
  getAll: async (params?: {
    page?: number;
    keyword?: string;
    qrcode_type?: string;
    folder_id?: string | number;
    search_archived?: boolean;
    sort?: string;
    page_size?: number;
  }) => {
    return apiClient.get("/qrcodes", params as Record<string, string | number | boolean>);
  },

  /** GET /api/qrcodes/{id} */
  getOne: async (id: string | number): Promise<QRCode> => {
    return apiClient.get(`/qrcodes/${id}`);
  },

  /** POST /api/qrcodes — Create new dynamic QR code */
  create: async (data: CreateQRCodePayload): Promise<QRCode> => {
    return apiClient.post("/qrcodes", data);
  },

  /** POST /api/qrcodes/create-static — Create static (non-dynamic) QR code */
  createStatic: async (data: Record<string, unknown>): Promise<QRCode> => {
    return apiClient.post("/qrcodes/create-static", data);
  },

  /** PUT /api/qrcodes/{id} — Update QR code data or design */
  update: async (id: string | number, data: Partial<CreateQRCodePayload>) => {
    return apiClient.put(`/qrcodes/${id}`, data);
  },

  /** DELETE /api/qrcodes/{id} */
  delete: async (id: string | number) => {
    return apiClient.delete(`/qrcodes/${id}`);
  },

  /** GET /api/qrcodes/preview — Build live preview SVG (no auth required) */
  preview: async (params: {
    data: string;
    type: string;
    design: string;
    renderText?: boolean;
    id?: string | number;
    h?: string;
  }) => {
    return apiClient.get("/qrcodes/preview", params as Record<string, string | number | boolean | undefined>);
  },

  // ─── Operations ────────────────────────────────────────

  /** POST /api/qrcodes/archive/{id} — Archive or Restore a QR code */
  archive: async (id: string | number, archived: boolean = true) => {
    return apiClient.post(`/qrcodes/archive/${id}`, { archived });
  },

  /** POST /api/qrcodes/{id}/copy — Duplicate a QR code */
  duplicate: async (id: string | number, count: number = 1) => {
    return apiClient.post(`/qrcodes/${id}/copy`, { count });
  },

  /** POST /api/qrcodes/{id}/change-status — Toggle enabled/disabled */
  changeStatus: async (id: string | number, status: 'enabled' | 'disabled') => {
    return apiClient.post(`/qrcodes/${id}/change-status`, { status });
  },

  /** POST /api/qrcodes/{id}/change-user — Admin: transfer QR ownership to another user */
  changeOwner: async (id: string | number, userId: string | number) => {
    return apiClient.post(`/qrcodes/${id}/change-user`, { user_id: userId });
  },

  /** POST /api/qrcodes/{id}/change-type — Change QR code type */
  changeType: async (id: string | number, type: string) => {
    return apiClient.post(`/qrcodes/${id}/change-type`, { type });
  },

  // ─── Media & Design ────────────────────────────────────

  /** POST /api/qrcodes/{id}/logo — Upload logo image (FormData) */
  uploadLogo: async (id: string | number, file: File) => {
    return apiClient.upload(`/qrcodes/${id}/logo`, { logo: file });
  },

  /** POST /api/qrcodes/{id}/background-image — Upload foreground/background image */
  uploadBackgroundImage: async (id: string | number, file: File) => {
    return apiClient.upload(`/qrcodes/${id}/background-image`, { image: file });
  },

  /** POST /api/qrcodes/data-file — Upload a data file (for file-type QR codes) */
  uploadDataFile: async (file: File) => {
    return apiClient.upload("/qrcodes/data-file", { file });
  },

  /** POST /api/qrcodes/{id}/upload-design-file — Upload a design asset file */
  uploadDesignFile: async (id: string | number, file: File, name: string) => {
    return apiClient.upload(`/qrcodes/${id}/upload-design-file`, { file, name });
  },

  // ─── Webpage / Landing Page Design ────────────────────

  /** GET /api/qrcodes/{id}/webpage-design — Fetch existing landing page design */
  getWebpageDesign: async (id: string | number) => {
    return apiClient.get(`/qrcodes/${id}/webpage-design`);
  },

  /** POST /api/qrcodes/{id}/webpage-design — Save landing page design */
  saveWebpageDesign: async (id: string | number, design: Record<string, unknown>) => {
    return apiClient.post(`/qrcodes/${id}/webpage-design`, design);
  },

  /** POST /api/qrcodes/{id}/webpage-design-file — Upload webpage design asset */
  uploadWebpageDesignFile: async (id: string | number, file: File) => {
    return apiClient.upload(`/qrcodes/${id}/webpage-design-file`, { file });
  },

  /** DELETE /api/qrcodes/{id}/webpage-design-file — Delete webpage design asset */
  deleteWebpageDesignFile: async (id: string | number) => {
    return apiClient.delete(`/qrcodes/${id}/webpage-design-file`);
  },

  // ─── Analytics & Reports ───────────────────────────────

  /** GET /api/qrcodes/{id}/reports/{slug} — Specific analytics report by slug */
  getReport: async (
    id: string | number,
    slug: 'scans-per-day' | 'scans-by-device' | 'scans-by-country' | 'scans-by-browser' | 'scans-by-os' | string,
    params?: { from?: string; to?: string }
  ) => {
    return apiClient.get(`/qrcodes/${id}/reports/${slug}`, params as Record<string, string | undefined>);
  },

  /** GET /api/qrcodes/count?qrcode_type= — Count QR codes (total or by type) */
  getCount: async (params?: { qrcode_type?: string }) => {
    return apiClient.get("/qrcodes/count", params as Record<string, string | undefined>);
  },

  /** GET /api/qrcodes/count/scans — Total scan count across all QR codes */
  getScanCount: async (params?: { type?: string }) => {
    return apiClient.get("/qrcodes/count/scans", params as Record<string, string | undefined>);
  },

  // ─── Download ──────────────────────────────────────────

  /** GET /api/qrcodes/{id}/compatible-svg — SVG compatible with external renderers */
  getCompatibleSvg: async (id: string | number): Promise<string> => {
    const response = await apiClient.get(`/qrcodes/${id}/compatible-svg`);
    return response.svg ?? response;
  },

  // ─── Business Review Feedbacks ─────────────────────────

  /** GET /api/qrcodes/{id}/business-review-feedbacks — list reviews for review-type QR */
  getBusinessReviewFeedbacks: async (
    id: string | number,
    params?: { page?: number }
  ) => {
    return apiClient.get(`/qrcodes/${id}/business-review-feedbacks`, params as Record<string, number | undefined>);
  },

  /** DELETE /api/qrcodes/{id}/business-review-feedbacks/{feedbackId} — delete a review */
  deleteBusinessReviewFeedback: async (
    id: string | number,
    feedbackId: string | number
  ) => {
    return apiClient.delete(`/qrcodes/${id}/business-review-feedbacks/${feedbackId}`);
  },

  // ─── Pincode Protection ────────────────────────────────

  /** GET /api/qrcodes/{id}/pincode — get current pincode settings */
  getPincode: async (id: string | number) => {
    return apiClient.get(`/qrcodes/${id}/pincode`);
  },

  /** POST /api/qrcodes/{id}/pincode — set or update pincode */
  savePincode: async (id: string | number, data: { pincode?: string; enabled?: boolean }) => {
    return apiClient.post(`/qrcodes/${id}/pincode`, data);
  },

  // ─── Google Authenticator QR ───────────────────────────

  /** POST /api/qrcodes/reset-google-authenticator — reset TOTP secret */
  resetGoogleAuth: async (data: { qrcode_id: string | number }) => {
    return apiClient.post("/qrcodes/reset-google-authenticator", data);
  },

  /** POST /api/qrcodes/generate-google-authenticator — generate new TOTP QR */
  generateGoogleAuth: async (data: { qrcode_id: string | number }) => {
    return apiClient.post("/qrcodes/generate-google-authenticator", data);
  },

  // ─── Bulk Operations ───────────────────────────────────

  /** GET /api/bulk-operations/types — list available bulk operation types */
  getBulkOperationTypes: async () => {
    return apiClient.get("/bulk-operations/types");
  },

  /** POST /api/bulk-operations/{type}/create — create & run a bulk operation */
  runBulkOperation: async (type: string, data: FormData | Record<string, unknown>) => {
    return apiClient.post(`/bulk-operations/${type}/create`, data);
  },

  /** GET /api/bulk-operations/{type}/instances — list historical bulk runs */
  getBulkInstances: async (type: string = 'import-url-qrcodes') => {
    return apiClient.get(`/bulk-operations/${type}/instances`);
  },

  /** GET /api/bulk-operations/instance-results/{id} — get results for a run */
  getBulkInstanceResults: async (id: string | number) => {
    return apiClient.get(`/bulk-operations/instance-results/${id}`);
  },

  /** POST /api/bulk-operations/{instance}/re-run — re-run a failed bulk operation */
  rerunBulkInstance: async (instanceId: string | number) => {
    return apiClient.post(`/bulk-operations/${instanceId}/re-run`);
  },

  /** POST /api/bulk-operations/edit-instance-name/{instance} — rename a bulk instance */
  renameBulkInstance: async (instanceId: string | number, name: string) => {
    return apiClient.post(`/bulk-operations/edit-instance-name/${instanceId}`, { name });
  },

  /** DELETE /api/bulk-operations/{instance} — delete a bulk instance record */
  deleteBulkInstance: async (id: string | number) => {
    return apiClient.delete(`/bulk-operations/${id}`);
  },

  /** DELETE /api/bulk-operations/{instance}/all-qrcodes — delete all QR codes in a bulk instance */
  deleteAllBulkQRCodes: async (instanceId: string | number) => {
    return apiClient.delete(`/bulk-operations/${instanceId}/all-qrcodes`);
  },

  /** GET /api/bulk-operations/export-csv/{instance} — export bulk results as CSV */
  exportBulkCsv: async (instanceId: string | number): Promise<string> => {
    // Returns a download URL or triggers download
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    return `${API_BASE}/bulk-operations/export-csv/${instanceId}`;
  },

  /** GET /api/bulk-operations/{type}/csv-sample — download the CSV template/sample */
  getBulkCsvSample: async (type: string): Promise<string> => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    return `${API_BASE}/bulk-operations/${type}/csv-sample`;
  },
};

export default qrCodeService;
