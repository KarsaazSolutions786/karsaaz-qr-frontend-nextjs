/**
 * Transaction Service
 * List transactions, offline payment creation, proof of payment upload,
 * and admin approve/reject for manual transactions.
 */
import apiClient from "@/lib/api-client";

export interface Transaction {
  id: string | number;
  user_id: number;
  subscription_id?: number;
  amount: number;
  currency: string;
  type: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  description: string;
  payment_processor?: string;
  external_id?: string;
  proof_of_payment?: string;
  created_at: string;
  updated_at?: string;
}

export const transactionService = {
  // ─── Read ──────────────────────────────────────────────

  /** GET /api/transactions — list transactions (admin sees all, user sees own) */
  getAll: async (params?: { page?: number; search?: string; status?: string }) => {
    return apiClient.get("/transactions", params as any);
  },

  /** GET /api/transactions/{id} — get single transaction */
  getOne: async (id: string | number) => {
    return apiClient.get(`/transactions/${id}`);
  },

  // ─── Offline / Manual Payments ─────────────────────────

  /** POST /api/transactions/offline-transaction — submit an offline/manual payment */
  createOfflineTransaction: async (data: {
    subscription_id?: string | number;
    amount: number;
    currency?: string;
    notes?: string;
  }) => {
    return apiClient.post("/transactions/offline-transaction", data);
  },

  /** POST /api/transactions/upload-proof-of-payment — upload payment receipt/screenshot */
  uploadProofOfPayment: async (transactionId: string | number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("transaction_id", String(transactionId));
    return apiClient.upload("/transactions/upload-proof-of-payment", formData);
  },

  // ─── Admin Actions ─────────────────────────────────────

  /** POST /api/transactions/{id}/approve — admin: approve a pending offline transaction */
  approve: async (id: string | number) => {
    return apiClient.post(`/transactions/${id}/approve`);
  },

  /** POST /api/transactions/{id}/reject — admin: reject a pending offline transaction */
  reject: async (id: string | number, reason?: string) => {
    return apiClient.post(`/transactions/${id}/reject`, { reason });
  },
};

export default transactionService;
