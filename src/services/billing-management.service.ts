/**
 * Billing Management Service (Enhanced)
 * Handles plans, usage metrics, addresses, and billing operations
 * Fully synced with Laravel backend API.
 */
import apiClient from "@/lib/api-client";

// ─── Types & Interfaces ────────────────────────────────────

export interface BillingAddress {
  id?: string | number;
  full_name: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  created_at?: string;
  updated_at?: string;
}

export interface UsageMetrics {
  qr_codes_created: number;
  qr_codes_limit: number;
  api_calls_made: number;
  api_calls_limit: number;
  storage_used: number;
  storage_limit: number;
  team_members: number;
  team_members_limit: number;
}

export interface BillingPlan {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  currency: string;
  frequency: 'monthly' | 'yearly';
  features: string[];
  limits: {
    qr_codes: number;
    api_calls: number;
    storage_gb: number;
    team_members: number;
  };
  is_trial: boolean;
  trial_days?: number;
}

export interface CurrentPlan extends BillingPlan {
  status: 'active' | 'expired' | 'pending_payment' | 'canceled';
  expires_at: string;
  started_at: string;
}

// ─── Service ────────────────────────────────────────────────

export const billingManagementService = {
  // ─── Plans ─────────────────────────────────────────────────

  /** GET /api/billing/plans — Get all available subscription plans */
  listPlans: async () => {
    return apiClient.get("/billing/plans");
  },

  /** GET /api/billing/current-plan — Get current user's active plan */
  getCurrentPlan: async () => {
    return apiClient.get("/billing/current-plan");
  },

  // ─── Usage Metrics ─────────────────────────────────────────

  /** GET /api/billing/usage — Get current usage metrics */
  getUsageMetrics: async (): Promise<{ data: UsageMetrics }> => {
    return apiClient.get("/billing/usage");
  },

  // ─── Billing Address ───────────────────────────────────────

  /** GET /api/billing/address — Get current billing address */
  getBillingAddress: async (): Promise<{ data: BillingAddress | null }> => {
    return apiClient.get("/billing/address");
  },

  /** POST /api/billing/address — Save or update billing address */
  updateBillingAddress: async (data: BillingAddress): Promise<{ data: BillingAddress }> => {
    return apiClient.post("/billing/address", data);
  },

  /** PUT /api/billing/address — Update existing billing address */
  putBillingAddress: async (data: BillingAddress): Promise<{ data: BillingAddress }> => {
    return apiClient.put("/billing/address", data);
  },

  // ─── Plan Upgrade/Downgrade ───────────────────────────────

  /** POST /api/billing/upgrade-plan — Upgrade to a new plan */
  upgradePlan: async (planId: string | number): Promise<{ data: any }> => {
    return apiClient.post("/billing/upgrade-plan", { plan_id: planId });
  },

  /** POST /api/billing/downgrade-plan — Downgrade to a new plan */
  downgradePlan: async (planId: string | number): Promise<{ data: any }> => {
    return apiClient.post("/billing/downgrade-plan", { plan_id: planId });
  },
};

export default billingManagementService;
