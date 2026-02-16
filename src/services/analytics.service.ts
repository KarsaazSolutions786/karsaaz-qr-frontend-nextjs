/**
 * Analytics Service
 * QR code scan analytics, stats, device/OS/country breakdowns.
 */
import apiClient from "@/lib/api-client";

export interface ScanStats {
  date: string;
  scans: number;
}

export interface QRAnalytics {
  total_scans: number;
  unique_scans: number;
  scans_by_date: ScanStats[];
  scans_by_device: { device: string; count: number }[];
  scans_by_os: { os: string; count: number }[];
  scans_by_country: { country: string; count: number }[];
}

export const analyticsService = {
  /** GET /api/qrcodes/count/scans — Total scan count */
  getGlobalScanCount: async (params?: { type?: string }) => {
    return apiClient.get("/qrcodes/count/scans", params);
  },

  /** GET /api/qrcodes/{id}/stats?start=&end= — Per-QR analytics */
  getQRCodeStats: async (id: string | number, params?: { start?: string; end?: string }) => {
    return apiClient.get(`/qrcodes/${id}/stats`, params);
  },

  /** GET /api/qrcodes/count — Count QR codes by type */
  getQRCodeCount: async (params?: { qrcode_type?: string }) => {
    return apiClient.get("/qrcodes/count", params);
  },
};

export default analyticsService;
