/**
 * Checkout Service
 * Multi-gateway checkout flow, payment processor discovery, and verification.
 */
import apiClient from "@/lib/api-client";

export const checkoutService = {
    /** GET /api/payment-processors — Get available payment processors for checkout */
    getPaymentProcessors: async () => {
        return apiClient.get("/payment-processors");
    },

    /** POST /api/checkout/{gateway}/create-session — Create a checkout session for a gateway */
    createSession: async (gateway: string, data: { plan_id: string | number; frequency?: string }) => {
        return apiClient.post(`/checkout/${gateway}/create-session`, data);
    },

    /** POST /api/checkout/{gateway}/verify-payment — Verify a payment */
    verifyPayment: async (gateway: string, data: any) => {
        return apiClient.post(`/checkout/${gateway}/verify-payment`, data);
    },

    /** POST /api/checkout/account-credit — Pay using account credit/wallet */
    payWithAccountCredit: async (data: { plan_id: string | number }) => {
        return apiClient.post("/checkout/account-credit", data);
    },

    /** POST /api/payment-processors/paypal/create-charge-link/{amount} — Buy account credits via PayPal */
    buyCredits: async (amount: number) => {
        return apiClient.post(`/payment-processors/paypal/create-charge-link/${amount}`);
    },

    /** POST /api/checkout/free-plan — Activate free plan */
    activateFreePlan: async (data: { plan_id: string | number }) => {
        return apiClient.post("/checkout/free-plan", data);
    },

    /** GET /api/promo-codes/validate/{code} — Validate promo/coupon code */
    validatePromoCode: async (code: string) => {
        return apiClient.get(`/promo-codes/validate/${code}`);
    },

    /** POST /api/promo-codes/validate — Validate and apply promo code with price */
    validatePromo: async (data: { code: string; price?: number; plan_id?: string | number }) => {
        return apiClient.post("/promo-codes/validate", data);
    },

    /** POST /api/checkout/stripe/{subscription} — Stripe Checkout Session */
    stripeCheckout: async (subscriptionId: string | number) => {
        return apiClient.post(`/checkout/stripe/${subscriptionId}`);
    },

    /** POST /api/promo-codes/check-usage — Check promo code usage */
    checkPromoUsage: async (data: { code: string }) => {
        return apiClient.post("/promo-codes/check-usage", data);
    },

    /** GET /api/promo-codes/my-promo-code — Get user's own promo/referral code */
    getMyPromoCode: async () => {
        return apiClient.get("/promo-codes/my-promo-code");
    },
};

export default checkoutService;
