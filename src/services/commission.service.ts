/**
 * Commission & Withdrawal Service
 * Referral commissions tracking, claiming, and withdrawal management.
 * Uses the Laravel backend commission/withdrawal APIs.
 */
import apiClient from "@/lib/api-client";

export interface Commission {
  id: string | number;
  user_id: string | number;
  referred_user_id: string | number;
  amount: number;
  currency?: string;
  status: 'pending' | 'claimed' | 'paid';
  created_at: string;
}

export interface Withdrawal {
  id: string | number;
  user_id: string | number;
  amount: number;
  currency?: string;
  status: 'pending' | 'approved' | 'rejected' | 'transferred';
  payment_method?: string;
  payment_details?: string;
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
}

export const commissionService = {
  // ─── Commissions ───────────────────────────────────────

  /** GET /api/commissions/dashboard — Commission overview dashboard data */
  getDashboard: async () => {
    return apiClient.get("/commissions/dashboard");
  },

  /** GET /api/commissions/unclaimed — List unclaimed commissions */
  getUnclaimed: async (params?: { page?: number }) => {
    return apiClient.get("/commissions/unclaimed", params);
  },

  /** GET /api/commissions/history — Full commission history */
  getHistory: async (params?: { page?: number; from?: string; to?: string }) => {
    return apiClient.get("/commissions/history", params);
  },

  /** GET /api/commissions/stats — Commission statistics (total, pending, claimed) */
  getStats: async () => {
    return apiClient.get("/commissions/stats");
  },

  /** POST /api/commissions/claim — Claim all pending commissions */
  claimCommissions: async () => {
    return apiClient.post("/commissions/claim");
  },

  // ─── Withdrawals ───────────────────────────────────────

  /** GET /api/withdrawals/summary — Withdrawal balance summary */
  getWithdrawalSummary: async () => {
    return apiClient.get("/withdrawals/summary");
  },

  /** GET /api/withdrawals/history — Withdrawal history */
  getWithdrawalHistory: async (params?: { page?: number }) => {
    return apiClient.get("/withdrawals/history", params);
  },

  /** GET /api/withdrawals/stats — Withdrawal statistics */
  getWithdrawalStats: async () => {
    return apiClient.get("/withdrawals/stats");
  },

  /** POST /api/withdrawals/create — Request a new withdrawal */
  createWithdrawal: async (data: {
    amount: number;
    payment_method: string;
    payment_details?: string;
  }) => {
    return apiClient.post("/withdrawals/create", data);
  },

  /** GET /api/withdrawals/referred-users — List users referred by current user */
  getReferredUsers: async (params?: { page?: number }) => {
    return apiClient.get("/withdrawals/referred-users", params);
  },

  /** GET /api/withdrawals/{id} — Get a single withdrawal */
  getWithdrawal: async (id: string | number) => {
    return apiClient.get(`/withdrawals/${id}`);
  },

  // ─── Admin Actions ─────────────────────────────────────

  /** GET /api/withdrawals/admin/pending — Admin: list all pending withdrawals */
  getAdminPendingWithdrawals: async (params?: { page?: number }) => {
    return apiClient.get("/withdrawals/admin/pending", params);
  },

  /** POST /api/withdrawals/{id}/approve — Admin: approve a withdrawal request */
  approveWithdrawal: async (id: string | number) => {
    return apiClient.post(`/withdrawals/${id}/approve`);
  },

  /** POST /api/withdrawals/{id}/reject — Admin: reject a withdrawal request */
  rejectWithdrawal: async (id: string | number, reason?: string) => {
    return apiClient.post(`/withdrawals/${id}/reject`, { reason });
  },

  /** POST /api/withdrawals/{id}/mark-transferred — Admin: mark as transferred/paid */
  markTransferred: async (id: string | number, notes?: string) => {
    return apiClient.post(`/withdrawals/${id}/mark-transferred`, { notes });
  },
};

export default commissionService;
