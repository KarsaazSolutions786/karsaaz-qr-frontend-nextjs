/**
 * Referral Service
 * CRM-integrated referral system: policies, commissions, withdrawals.
 * Uses CRM API at crmapp.karsaazebs.com
 */
import crmClient from "@/lib/crm-client";

const CRM_PRODUCT_ID = process.env.NEXT_PUBLIC_CRM_PRODUCT_ID || '2';

export interface ReferralPolicy {
  id: string | number;
  commission_rate: number;
  commission_type: string;
  min_withdrawal: number;
}

export interface Commission {
  id: string | number;
  user_id: number;
  amount: number;
  status: 'pending' | 'paid' | 'rejected';
  plan_name: string;
  created_at: string;
}

export interface WithdrawalRequest {
  id: string | number;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  method: string;
  payment_details: string;
  created_at: string;
}

export const referralService = {
  /** GET /api/referral-policies/refrelpolicies/{productId} — Get referral policies */
  getPolicies: async () => {
    return crmClient.get(`/referral-policies/refrelpolicies/${CRM_PRODUCT_ID}`);
  },

  /** GET /api/referral-policies/referrals — Get referred users */
  getReferrals: async (params?: { page?: number }) => {
    return crmClient.get("/referral-policies/referrals", params as any);
  },

  /** GET /api/referral-policies/referrals/stats — Referral stats/dashboard */
  getReferralStats: async (email: string) => {
    return crmClient.get("/referral-policies/referrals/stats", { email, productId: CRM_PRODUCT_ID });
  },

  /** GET /api/referral-policies/withdrawals — Withdrawal history */
  getWithdrawals: async (email: string, params?: { page?: number }) => {
    return crmClient.get("/referral-policies/withdrawals", { email, productId: CRM_PRODUCT_ID, ...params });
  },

  /** POST /api/referral-policies/withdrawals — Request withdrawal */
  requestWithdrawal: async (data: { amount: number; method: string; payment_details: string; email: string }) => {
    return crmClient.post("/referral-policies/withdrawals", {
      ...data,
      productId: CRM_PRODUCT_ID,
    });
  },

  /** GET referral link for current user */
  getReferralLink: (userId: string | number) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dashboard.karsaazqr.com';
    return `${baseUrl}/register?ref=${userId}`;
  },
};

export default referralService;
