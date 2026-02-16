/**
 * Account Service
 * Account-level operations: subscription, OTP, verification, impersonation,
 * magic login, resend verification, account credit, and cancel.
 */
import apiClient from "@/lib/api-client";

export const accountService = {
  // ─── Subscription ──────────────────────────────────────

  /** POST /api/account/cancel-subscription — Cancel current user subscription */
  cancelSubscription: async () => {
    return apiClient.post("/account/cancel-subscription");
  },

  // ─── Impersonation (Admin) ─────────────────────────────

  /** POST /api/account/act-as/{userId} — Admin: impersonate a user */
  actAs: async (userId: string | number) => {
    return apiClient.post(`/account/act-as/${userId}`);
  },

  /** POST /api/account/generate-magic-login-url/{user} — Admin: one-time login link */
  generateMagicLoginUrl: async (userId: string | number) => {
    return apiClient.post(`/account/generate-magic-login-url/${userId}`);
  },

  // ─── Email Verification ────────────────────────────────

  /** GET /api/account/verify-email/{email} — Verify email address via link */
  verifyEmail: async (email: string, token?: string) => {
    return apiClient.get(
      `/account/verify-email/${encodeURIComponent(email)}`,
      token ? { token } : undefined
    );
  },

  /** POST /api/account/resend-verification-email — Resend verification email (rate: 6/min) */
  resendVerificationEmail: async () => {
    return apiClient.post("/account/resend-verification-email");
  },

  // ─── OTP / Customer Authentication ─────────────────────

  /** POST /api/account/is-email-found — Check if email is registered */
  isEmailFound: async (email: string) => {
    return apiClient.post("/account/is-email-found", { email });
  },

  /** POST /api/account/send-otp-code — Send OTP code (rate: 3/min) */
  sendOtpCode: async (email: string) => {
    return apiClient.post("/account/send-otp-code", { email });
  },

  /** POST /api/account/resend-otp-code — Resend OTP code */
  resendOtpCode: async (email: string) => {
    return apiClient.post("/account/resend-otp-code", { email });
  },

  /** POST /api/account/verify-otp-code — Verify OTP code */
  verifyOtpCode: async (data: { email: string; otp?: string; code?: string }) => {
    return apiClient.post("/account/verify-otp-code", data);
  },

  /** POST /api/account/otp-registration — Register new account via OTP */
  otpRegistration: async (data: { email: string; name?: string; otp?: string; password?: string }) => {
    return apiClient.post("/account/otp-registration", data);
  },

  // ─── Account Management ────────────────────────────────

  /** POST /api/account/delete — Permanently delete current account */
  deleteAccount: async (data?: { password?: string }) => {
    return apiClient.post("/account/delete", data);
  },
};

export default accountService;
