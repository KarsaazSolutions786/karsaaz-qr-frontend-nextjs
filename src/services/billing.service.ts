/**
 * Billing & Subscription Service
 * Plans, subscriptions, promo codes, sync from Stripe.
 * Fully synced with Laravel backend API.
 */
import apiClient from "@/lib/api-client";

export interface SubscriptionPlan {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  currency: string;
  frequency: 'monthly' | 'yearly' | 'ONE_TIME';
  is_trial: boolean;
  trial_days: number;
  features: string[];
  qr_types: string[];
  number_of_users: number;
}

export interface UserSubscription {
  id: string | number;
  plan_id: string | number;
  status: 'active' | 'expired' | 'pending_payment' | 'canceled';
  expires_at: string;
  created_at: string;
  updated_at: string;
  trial_ends_at?: string;
  subscription_plan: SubscriptionPlan;
  statuses?: { status: string }[];
}

export const billingService = {
  // ─── Plans ─────────────────────────────────────────────

  /** GET /api/subscription-plans — List all plans (public pricing page) */
  getPlans: async () => {
    return apiClient.get("/subscription-plans");
  },

  /** POST /api/subscription-plans — Admin: create a new plan */
  createPlan: async (data: Partial<SubscriptionPlan>) => {
    return apiClient.post("/subscription-plans", data);
  },

  /** GET /api/subscription-plans/{id} — Get a single plan */
  getPlan: async (id: string | number) => {
    return apiClient.get(`/subscription-plans/${id}`);
  },

  /** PUT /api/subscription-plans/{id} — Admin: update a plan */
  updatePlan: async (id: string | number, data: Partial<SubscriptionPlan>) => {
    return apiClient.put(`/subscription-plans/${id}`, data);
  },

  /** DELETE /api/subscription-plans/{id} — Admin: delete a plan */
  deletePlan: async (id: string | number) => {
    return apiClient.delete(`/subscription-plans/${id}`);
  },

  /** POST /api/subscription-plans/{id}/duplicate — Admin: duplicate a plan */
  duplicatePlan: async (id: string | number) => {
    return apiClient.post(`/subscription-plans/${id}/duplicate`);
  },

  // ─── Subscriptions (Admin) ─────────────────────────────

  /** GET /api/subscriptions — Admin: list all subscriptions */
  getSubscriptions: async (params?: { page?: number; search?: string }) => {
    return apiClient.get("/subscriptions", params);
  },

  /** POST /api/subscriptions — Admin: manually create a subscription */
  createSubscription: async (data: Record<string, unknown>) => {
    return apiClient.post("/subscriptions", data);
  },

  /** GET /api/subscriptions/{id} — Get a single subscription */
  getSubscription: async (id: string | number) => {
    return apiClient.get(`/subscriptions/${id}`);
  },

  /** PUT /api/subscriptions/{id} — Update a subscription */
  updateSubscription: async (id: string | number, data: Record<string, unknown>) => {
    return apiClient.put(`/subscriptions/${id}`, data);
  },

  /** DELETE /api/subscriptions/{id} — Delete a subscription */
  deleteSubscription: async (id: string | number) => {
    return apiClient.delete(`/subscriptions/${id}`);
  },

  /** GET /api/subscriptions/statuses — List all subscription statuses */
  getSubscriptionStatuses: async () => {
    return apiClient.get("/subscriptions/statuses");
  },

  /** POST /api/subscriptions/sync — Admin: sync all subscriptions from Stripe */
  syncSubscriptions: async () => {
    return apiClient.post("/subscriptions/sync");
  },

  /** POST /api/subscriptions/delete-pending — Admin: delete all pending subscriptions */
  deletePendingSubscriptions: async () => {
    return apiClient.post("/subscriptions/delete-pending");
  },

  // ─── User Subscriptions ────────────────────────────────

  /** GET /api/subscriptions/user — Current user's subscriptions */
  getUserSubscriptions: async () => {
    return apiClient.get("/subscriptions/user");
  },

  /** POST /api/subscriptions/create-subscription-intent — Start a subscription */
  createSubscriptionIntent: async (planId: string | number) => {
    return apiClient.post("/subscriptions/create-subscription-intent", { plan_id: planId });
  },

  /** POST /api/subscriptions/{id}/cancel — Cancel a subscription */
  cancelSubscription: async (id: string | number) => {
    return apiClient.post(`/subscriptions/${id}/cancel`);
  },

  // ─── Promo Codes ───────────────────────────────────────

  /** GET /api/promo-codes/validate/{code} — Validate a promo code (no auth) */
  validatePromoCode: async (code: string) => {
    return apiClient.get(`/promo-codes/validate/${encodeURIComponent(code)}`);
  },

  /** POST /api/promo-codes/validate — Validate promo code with plan price */
  validatePromoCodeWithPrice: async (data: { code: string; plan_id?: string | number }) => {
    return apiClient.post("/promo-codes/validate", data);
  },

  /** POST /api/promo-codes/check-usage — Check if user has exceeded usage limit */
  checkPromoCodeUsage: async (code: string) => {
    return apiClient.post("/promo-codes/check-usage", { code });
  },

  /** POST /api/promo-codes/apply — Apply a promo code to current account */
  applyPromoCode: async (code: string) => {
    return apiClient.post("/promo-codes/apply", { code });
  },

  /** GET /api/promo-codes/applied — List promo codes applied by current user */
  getAppliedPromoCodes: async () => {
    return apiClient.get("/promo-codes/applied");
  },

  /** GET /api/promo-codes/my-promo-code — Get the user's own referral promo code */
  getMyPromoCode: async () => {
    return apiClient.get("/promo-codes/my-promo-code");
  },

  // ─── Account Credits ───────────────────────────────────

  /** GET /api/subscription-plans/credit-pricing — Get prices for buying credits */
  getAccountCreditPrices: async () => {
    return apiClient.get("/subscription-plans/credit-pricing");
  },

  /** POST /api/subscription-plans/credit-pricing — Update credit pricing */
  updateAccountCreditPrices: async (data: { dynamic_qr_price: number; static_qr_price: number }) => {
    return apiClient.post("/subscription-plans/credit-pricing", data);
  },

  /** POST /api/payment-processors/{slug}/create-charge-link/{amount} — Purchase credits */
  createCreditCheckoutSession: async (amount: number, slug: string = 'paypal') => {
    return apiClient.post(`/payment-processors/${slug}/create-charge-link/${amount}`);
  },
};

export default billingService;
