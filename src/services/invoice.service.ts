/**
 * Invoice Management Service
 * Handles invoice retrieval, details, downloads, and statistics
 * Fully synced with Laravel backend API.
 */
import apiClient from "@/lib/api-client";

// ─── Types & Interfaces ────────────────────────────────────

export interface Invoice {
  id: string | number;
  invoice_number: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed' | 'void';
  issued_date: string;
  due_date: string;
  paid_date?: string;
  description?: string;
  pdf_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceStats {
  total_invoices: number;
  paid_invoices: number;
  pending_invoices: number;
  failed_invoices: number;
  total_amount: number;
  pending_amount: number;
}

export interface InvoiceListResponse {
  data: Invoice[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// ─── Service ────────────────────────────────────────────────

export const invoiceService = {
  // ─── List & Pagination ────────────────────────────────────

  /** GET /api/invoices — Get paginated invoice list */
  listInvoices: async (page: number = 1, limit: number = 10): Promise<InvoiceListResponse> => {
    return apiClient.get("/invoices", { page, per_page: limit });
  },

  /** GET /api/invoices/search — Search invoices by number or date */
  searchInvoices: async (query: string, page: number = 1): Promise<InvoiceListResponse> => {
    return apiClient.get("/invoices/search", { q: query, page });
  },

  // ─── Invoice Details ───────────────────────────────────────

  /** GET /api/invoices/{id} — Get full invoice details */
  getInvoice: async (invoiceId: string | number): Promise<{ data: Invoice }> => {
    return apiClient.get(`/invoices/${invoiceId}`);
  },

  // ─── Download & Export ─────────────────────────────────────

  /** GET /api/invoices/{id}/download — Download invoice as PDF */
  downloadInvoice: async (invoiceId: string | number): Promise<Blob> => {
    return apiClient.get(`/invoices/${invoiceId}/download`, undefined, {
      responseType: 'blob'
    });
  },

  // ─── Statistics ────────────────────────────────────────────

  /** GET /api/invoices/stats — Get invoice statistics */
  getInvoiceStats: async (): Promise<{ data: InvoiceStats }> => {
    return apiClient.get("/invoices/stats");
  },

  // ─── Export ────────────────────────────────────────────────

  /** GET /api/invoices/export/csv — Export invoices as CSV */
  exportInvoicesCSV: async (filters?: { from_date?: string; to_date?: string }): Promise<Blob> => {
    return apiClient.get("/invoices/export/csv", filters, {
      responseType: 'blob'
    });
  },
};

export default invoiceService;
