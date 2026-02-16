/**
 * Stripe Service
 * Checkout sessions, customer portal, subscription management,
 * invoices, payment methods, and webhook management.
 * Fully synced with Laravel backend API.
 */
import apiClient from "@/lib/api-client";

export const stripeService = {
  // ─── Checkout ──────────────────────────────────────────

  /** POST /api/stripe/checkout-session — Create Stripe Checkout session */
  createCheckoutSession: async (data: { plan_id: string | number; promo_code?: string }) => {
    return apiClient.post("/stripe/checkout-session", data);
  },

  /** POST /api/checkout/stripe/verify-checkout-session/{sessionId} — Verify after redirect */
  verifySession: async (sessionId: string) => {
    return apiClient.post(`/checkout/stripe/verify-checkout-session/${sessionId}`);
  },

  // ─── Customer ──────────────────────────────────────────

  /** GET /api/stripe/customer — Get Stripe customer info */
  getCustomer: async () => {
    return apiClient.get("/stripe/customer");
  },

  /** POST /api/stripe/customer-portal — Get hosted Customer Portal URL */
  createPortalSession: async () => {
    return apiClient.post("/stripe/customer-portal");
  },

  // ─── Payment Methods ───────────────────────────────────

  /** GET /api/stripe/payment-methods — List saved payment methods */
  getPaymentMethods: async () => {
    return apiClient.get("/stripe/payment-methods");
  },

  /** POST /api/stripe/payment-methods/store — Save a new payment method */
  storePaymentMethod: async (paymentMethodId: string) => {
    return apiClient.post("/stripe/payment-methods/store", {
      payment_method_id: paymentMethodId,
    });
  },

  /** POST /api/stripe/payment-methods/default — Set a payment method as default */
  setDefaultPaymentMethod: async (paymentMethodId: string) => {
    return apiClient.post("/stripe/payment-methods/default", {
      payment_method_id: paymentMethodId,
    });
  },

  /** DELETE /api/stripe/payment-methods/{id} — Remove a payment method */
  deletePaymentMethod: async (paymentMethodId: string) => {
    return apiClient.delete(`/stripe/payment-methods/${paymentMethodId}`);
  },

  // ─── Subscription ──────────────────────────────────────

  /** GET /api/stripe/subscription — Get current Stripe subscription */
  getSubscription: async () => {
    return apiClient.get("/stripe/subscription");
  },

  /** POST /api/stripe/subscription/update — Change plan or apply coupon */
  updateSubscription: async (options: { plan_id?: string; promo_code?: string }) => {
    return apiClient.post("/stripe/subscription/update", options);
  },

  /** POST /api/stripe/subscription/cancel — Cancel Stripe subscription */
  cancelSubscription: async () => {
    return apiClient.post("/stripe/subscription/cancel");
  },

  /** POST /api/stripe/subscription/resume — Resume a canceled subscription */
  resumeSubscription: async () => {
    return apiClient.post("/stripe/subscription/resume");
  },

  /** POST /api/stripe/subscription/pause — Pause a subscription */
  pauseSubscription: async (options?: { resumes_at?: string }) => {
    return apiClient.post("/stripe/subscription/pause", options);
  },

  // ─── Invoices ──────────────────────────────────────────

  /** GET /api/stripe/invoices — Get recent invoices */
  getInvoices: async () => {
    return apiClient.get("/stripe/invoices");
  },

  /** GET /api/stripe/invoices/all — Get all invoices (full history) */
  getAllInvoices: async () => {
    return apiClient.get("/stripe/invoices/all");
  },

  /** POST /api/stripe/invoices/sync — Admin: sync invoices from Stripe */
  syncInvoices: async () => {
    return apiClient.post("/stripe/invoices/sync");
  },

  // ─── Products ──────────────────────────────────────────

  /** GET /api/stripe/products — Products synced from Stripe */
  getProducts: async () => {
    return apiClient.get("/stripe/products");
  },

  // ─── Webhooks (Admin) ──────────────────────────────────

  /** GET /api/stripe/webhooks — List configured Stripe webhooks */
  getWebhooks: async () => {
    return apiClient.get("/stripe/webhooks");
  },

  /** POST /api/stripe/webhooks — Register a new Stripe webhook */
  createWebhook: async (data: { url?: string; events?: string[] }) => {
    return apiClient.post("/stripe/webhooks", data);
  },

  // ─── Subscription Intent ───────────────────────────────

  /** POST /api/stripe/create-subscription-intent — Create a subscription payment intent */
  createSubscriptionIntent: async (data: {
    plan_id: string | number;
    promo_code?: string;
    payment_method_id?: string;
  }) => {
    return apiClient.post("/stripe/create-subscription-intent", data);
  },
};

export default stripeService;
