/**
 * Payment Methods Service
 * Manages saved payment methods and payment preferences
 * Fully synced with Laravel backend API.
 */
import apiClient from "@/lib/api-client";

// ─── Types & Interfaces ────────────────────────────────────

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  cardholder_name: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AddPaymentMethodRequest {
  token: string; // Stripe token
  cardholder_name: string;
}

export interface PaymentMethodListResponse {
  data: PaymentMethod[];
}

// ─── Service ────────────────────────────────────────────────

export const paymentMethodService = {
  // ─── List Payment Methods ──────────────────────────────────

  /** GET /api/payment-methods — Get all saved payment methods */
  listPaymentMethods: async (): Promise<PaymentMethodListResponse> => {
    return apiClient.get("/payment-methods");
  },

  // ─── Add Payment Method ────────────────────────────────────

  /** POST /api/payment-methods — Add a new payment method */
  addPaymentMethod: async (data: AddPaymentMethodRequest): Promise<{ data: PaymentMethod }> => {
    return apiClient.post("/payment-methods", data);
  },

  // ─── Delete Payment Method ─────────────────────────────────

  /** DELETE /api/payment-methods/{id} — Delete a payment method */
  deletePaymentMethod: async (id: string): Promise<{ data: null }> => {
    return apiClient.delete(`/payment-methods/${id}`);
  },

  // ─── Set Default ───────────────────────────────────────────

  /** POST /api/payment-methods/{id}/set-default — Set as default payment method */
  setDefaultPaymentMethod: async (id: string): Promise<{ data: PaymentMethod }> => {
    return apiClient.post(`/payment-methods/${id}/set-default`);
  },

  // ─── Validation ────────────────────────────────────────────

  /** POST /api/payment-methods/validate — Validate payment method */
  validatePaymentMethod: async (token: string): Promise<{ data: { valid: boolean } }> => {
    return apiClient.post("/payment-methods/validate", { token });
  },
};

export default paymentMethodService;
