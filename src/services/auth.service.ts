/**
 * Authentication Service
 * Handles login, registration, password reset, email verification, social auth,
 * OTP/passwordless, 2FA, Apple Sign In, session management, and admin magic links.
 */
import apiClient from "@/lib/api-client";

export interface LoginPayload {
  email: string;
  password?: string;
  token_name?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
}

export interface ResetPasswordPayload {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface Session {
  id: string;
  device?: string;
  browser?: string;
  ip_address?: string;
  last_active_at?: string;
  is_current?: boolean;
}

export interface LoginResponse {
  token: string;
  access_token?: string; // Laravel Passport typically returns access_token
  user: User;
}

export interface RegisterResponse {
  token: string;
  access_token?: string;
  user: User;
}

export const authService = {
  // ─── Standard Auth ─────────────────────────────────────

  /** POST /api/login */
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    return apiClient.post("/login", payload);
  },

  /** POST /api/register */
  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    return apiClient.post("/register", payload);
  },

  /** POST /api/logout */
  logout: async () => {
    return apiClient.post("/logout");
  },

  /** GET /api/myself — validate token, refresh user data */
  getMyself: async () => {
    return apiClient.get("/myself");
  },

  /** POST /api/forgot-password */
  forgotPassword: async (email: string) => {
    return apiClient.post("/forgot-password", { email });
  },

  /** POST /api/reset-password */
  resetPassword: async (payload: ResetPasswordPayload) => {
    return apiClient.post("/reset-password", payload);
  },

  // ─── Email Verification ────────────────────────────────

  /** GET /api/account/verify-email/{email} — verify email by link token */
  verifyEmail: async (email: string, token?: string) => {
    return apiClient.get(
      `/account/verify-email/${encodeURIComponent(email)}`,
      token ? { token } : undefined
    );
  },

  /** POST /api/account/resend-verification-email — resend verification (authenticated, rate: 6/min) */
  resendVerificationEmail: async () => {
    return apiClient.post("/account/resend-verification-email");
  },

  // ─── Social Auth ───────────────────────────────────────

  /** POST /api/auth/google/token-login — Google OAuth token login */
  googleLogin: async (token: string) => {
    return apiClient.post("/auth/google/token-login", { token });
  },

  /** POST /api/auth/google/verify-token — verify Google ID token */
  verifyGoogleToken: async (token: string) => {
    return apiClient.post("/auth/google/verify-token", { token });
  },

  /** POST /api/auth/google/complete-registration — complete Google signup flow */
  completeGoogleRegistration: async (data: { token: string; name?: string }) => {
    return apiClient.post("/auth/google/complete-registration", data);
  },

  /** POST /api/auth/apple/verify-token — Apple Sign In */
  appleLogin: async (identityToken: string, data?: { name?: string }) => {
    return apiClient.post("/auth/apple/verify-token", {
      identity_token: identityToken,
      ...data,
    });
  },

  // ─── OTP / Passwordless Auth ───────────────────────────

  /** POST /api/account/send-otp-code — send OTP code (rate: 3/min) */
  sendOtpCode: async (email: string) => {
    return apiClient.post("/account/send-otp-code", { email });
  },

  /** POST /api/account/verify-otp-code — verify OTP code */
  verifyOtpCode: async (email: string, otp: string) => {
    return apiClient.post("/account/verify-otp-code", { email, otp });
  },

  /** POST /api/account/otp-registration — register new account via OTP (no password) */
  otpRegistration: async (data: { name: string; email: string; otp: string }) => {
    return apiClient.post("/account/otp-registration", data);
  },

  /** POST /api/account/resend-otp-code — resend OTP code */
  resendOtpCode: async (email: string) => {
    return apiClient.post("/account/resend-otp-code", { email });
  },

  /** POST /api/passwordless-auth/check-preference — check if user prefers passwordless */
  checkPasswordlessPreference: async (email: string) => {
    return apiClient.post("/passwordless-auth/check-preference", { email });
  },

  /** POST /api/passwordless-auth/init — initialize passwordless OTP login */
  initPasswordlessAuth: async (email: string) => {
    return apiClient.post("/passwordless-auth/init", { email });
  },

  /** POST /api/passwordless-auth/verify — verify passwordless OTP and get token */
  verifyPasswordlessAuth: async (email: string, otp: string) => {
    return apiClient.post("/passwordless-auth/verify", { email, otp });
  },

  /** POST /api/passwordless-auth/resend — resend passwordless OTP */
  resendPasswordlessOtp: async (email: string) => {
    return apiClient.post("/passwordless-auth/resend", { email });
  },

  // ─── Two-Factor Authentication ─────────────────────────

  /** POST /api/user/2fa/login-verify — verify 2FA code during login */
  verify2faLogin: async (code: string, token?: string) => {
    return apiClient.post("/user/2fa/login-verify", { code, ...(token && { token }) });
  },

  /** GET /api/user/2fa/status — get current 2FA enabled/disabled status */
  get2faStatus: async () => {
    return apiClient.get("/user/2fa/status");
  },

  /** POST /api/user/2fa/setup — initiate 2FA setup, returns QR code URI */
  setup2fa: async () => {
    return apiClient.post("/user/2fa/setup");
  },

  /** POST /api/user/2fa/verify — confirm 2FA setup with authenticator code */
  confirm2fa: async (code: string) => {
    return apiClient.post("/user/2fa/verify", { code });
  },

  /** POST /api/user/2fa/disable — disable 2FA (requires current code) */
  disable2fa: async (code: string) => {
    return apiClient.post("/user/2fa/disable", { code });
  },

  // ─── Session Management ────────────────────────────────

  /** GET /api/user/sessions — list all active sessions for current user */
  getSessions: async (): Promise<{ data: Session[] }> => {
    return apiClient.get("/user/sessions");
  },

  /** POST /api/user/sessions/revoke-all — revoke all sessions except current */
  revokeAllSessions: async () => {
    return apiClient.post("/user/sessions/revoke-all");
  },

  /** DELETE /api/user/sessions/{sessionId} — revoke a specific session */
  revokeSession: async (sessionId: string) => {
    return apiClient.delete(`/user/sessions/${sessionId}`);
  },

  // ─── Account Utilities ────────────────────────────────

  /** POST /api/account/is-email-found — check if email is registered */
  checkEmail: async (email: string) => {
    return apiClient.post("/account/is-email-found", { email });
  },

  /** POST /api/account/delete — permanently delete current user account */
  deleteAccount: async (data?: { password?: string }) => {
    return apiClient.post("/account/delete", data);
  },

  // ─── Admin Auth Tools ─────────────────────────────────

  /** POST /api/account/generate-magic-login-url/{user} — admin: one-time login link */
  generateMagicLoginUrl: async (userId: string | number) => {
    return apiClient.post(`/account/generate-magic-login-url/${userId}`);
  },

  /** POST /api/account/act-as/{user} — admin: impersonate another user */
  actAs: async (userId: string | number): Promise<{ token: string; user: User }> => {
    return apiClient.post(`/account/act-as/${userId}`);
  },
};

export default authService;
