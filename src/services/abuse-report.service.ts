/**
 * Abuse Report Service
 * Public abuse report submission and admin management.
 * NOTE: The backend uses /api/abuse-reports (not /api/admin/abuse-reports).
 * Admin management endpoints use the same base path with QR code feedback endpoints.
 */
import apiClient from "@/lib/api-client";

export interface AbuseReport {
  id: string | number;
  qrcode_id: number;
  qrcode?: { id: number; url: string };
  reported_by_email: string;
  reason?: string;
  description?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
}

export const abuseReportService = {
  // ─── Public ────────────────────────────────────────────

  /** POST /api/abuse-reports — Submit an abuse report (rate: 5/min, no auth) */
  submit: async (data: {
    qrcode_id: string | number;
    reported_by_email: string;
    reason: string;
    description?: string;
  }) => {
    return apiClient.post("/abuse-reports", data);
  },

  // ─── Admin ─────────────────────────────────────────────
  // These endpoints may require backend implementation if not already present.
  // Verify in routes/api.php that these routes exist.

  /** GET /api/abuse-reports — Admin: list all abuse reports */
  getAll: async (params?: { page?: number; status?: string }) => {
    return apiClient.get("/abuse-reports", params as any);
  },

  /** GET /api/abuse-reports/{id} — Admin: get a single abuse report */
  getOne: async (id: string | number) => {
    return apiClient.get(`/abuse-reports/${id}`);
  },

  /** PUT /api/abuse-reports/{id}/status — Admin: update report status */
  updateStatus: async (
    id: string | number,
    data: { status: 'pending' | 'resolved' | 'dismissed'; admin_notes?: string }
  ) => {
    return apiClient.put(`/abuse-reports/${id}/status`, data);
  },
};

export default abuseReportService;
