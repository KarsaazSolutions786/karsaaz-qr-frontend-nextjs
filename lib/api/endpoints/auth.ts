import apiClient from '@/lib/api/client'
import { User } from '@/types/entities/user'

// Auth API Endpoints — matching original Laravel backend

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  password_confirmation: string
  terms_consent: boolean
  referral_code?: string
}

export interface RegisterResponse {
  user: User
  token: string
}

export interface VerifyOTPRequest {
  otp: string
  email: string
}

export interface VerifyOTPResponse {
  user: User
  token?: string
  message: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
}

export interface ResetPasswordRequest {
  email: string
  password: string
  password_confirmation: string
  token: string
}

export interface ResetPasswordResponse {
  message: string
}

// Passwordless Auth — check if feature is enabled
export interface PasswordlessStatusResponse {
  success: boolean
  enabled: boolean
  feature: string
}

// Passwordless Auth — check per-user login preference
export interface PasswordlessCheckPreferenceRequest {
  email: string
}

export interface PasswordlessCheckPreferenceResponse {
  login_method: 'passwordless' | 'traditional'
}

// Passwordless Auth — initialize OTP flow
export interface PasswordlessInitRequest {
  email: string
}

export interface PasswordlessInitResponse {
  success: boolean
  otp_sent: boolean
  is_new_user: boolean
  email: string
  message?: string
}

// Passwordless Auth — verify OTP and authenticate
export interface PasswordlessVerifyRequest {
  email: string
  otp: string
}

export interface PasswordlessVerifyResponse {
  success: boolean
  token: string
  user: User
  is_new_user: boolean
}

// Passwordless Auth — resend OTP
export interface PasswordlessResendRequest {
  email: string
}

export interface PasswordlessResendResponse {
  success: boolean
  message?: string
}

// Passwordless Auth — per-user preference (authenticated)
export interface PasswordlessPreferenceResponse {
  preference: 'passwordless' | 'traditional'
}

export interface PasswordlessSetPreferenceRequest {
  preference: 'enabled' | 'disabled'
  password?: string
  password_confirmation?: string
}

export interface PasswordlessSetPreferenceResponse {
  success: boolean
  message?: string
}

export interface UpdateProfileRequest {
  name?: string
  email?: string
  currentPassword?: string
  newPassword?: string
}

export interface UpdateProfileResponse {
  user: User
  message: string
}

// Auth API functions

export const authAPI = {
  // Login with email + password
  login: async (data: LoginRequest) => {
    const response = await apiClient.post<LoginResponse>('/login', data)
    return response.data
  },

  // Register new user
  register: async (data: RegisterRequest) => {
    const response = await apiClient.post<RegisterResponse>('/register', data)
    return response.data
  },

  // Logout — revoke token on backend
  logout: async () => {
    try {
      await apiClient.post('/logout')
    } catch {
      // Ignore errors — we'll clear local state anyway
    }
    return { success: true }
  },

  // Get current user — validate token on app load
  getCurrentUser: async () => {
    const response = await apiClient.get<User>('/myself')
    return response.data
  },

  // Verify OTP code (email verification after registration)
  verifyOTP: async (data: VerifyOTPRequest) => {
    const response = await apiClient.post<VerifyOTPResponse>('/account/verify-otp-code', data)
    return response.data
  },

  // Resend OTP code
  resendOTP: async (email: string) => {
    const response = await apiClient.post('/account/resend-otp-code', { email })
    return response.data
  },

  // Forgot password — send reset email
  forgotPassword: async (data: ForgotPasswordRequest) => {
    const response = await apiClient.post<ForgotPasswordResponse>('/forgot-password', data)
    return response.data
  },

  // Reset password with token from email
  resetPassword: async (data: ResetPasswordRequest) => {
    const response = await apiClient.post<ResetPasswordResponse>('/reset-password', data)
    return response.data
  },

  // Passwordless auth — check if feature is enabled globally
  passwordlessStatus: async () => {
    const response = await apiClient.get<PasswordlessStatusResponse>('/passwordless-auth/status')
    return response.data
  },

  // Passwordless auth — check per-user login preference
  passwordlessCheckPreference: async (data: PasswordlessCheckPreferenceRequest) => {
    const response = await apiClient.post<PasswordlessCheckPreferenceResponse>(
      '/passwordless-auth/check-preference',
      data
    )
    return response.data
  },

  // Passwordless auth — initialize OTP flow (sends email with 5-digit code)
  passwordlessInit: async (data: PasswordlessInitRequest) => {
    const response = await apiClient.post<PasswordlessInitResponse>('/passwordless-auth/init', data)
    return response.data
  },

  // Passwordless auth — verify 5-digit OTP code and authenticate
  passwordlessVerify: async (data: PasswordlessVerifyRequest) => {
    const response = await apiClient.post<PasswordlessVerifyResponse>(
      '/passwordless-auth/verify',
      data
    )
    return response.data
  },

  // Passwordless auth — resend OTP code
  passwordlessResend: async (data: PasswordlessResendRequest) => {
    const response = await apiClient.post<PasswordlessResendResponse>(
      '/passwordless-auth/resend',
      data
    )
    return response.data
  },

  // Passwordless auth — get current user's login preference (requires auth)
  passwordlessGetPreference: async () => {
    const response = await apiClient.get<PasswordlessPreferenceResponse>(
      '/passwordless-auth/preference'
    )
    return response.data
  },

  // Passwordless auth — set user's login preference (requires auth)
  // preference='disabled' + password to switch to traditional
  // preference='enabled' to switch to passwordless
  passwordlessSetPreference: async (data: PasswordlessSetPreferenceRequest) => {
    const response = await apiClient.put<PasswordlessSetPreferenceResponse>(
      '/passwordless-auth/preference',
      data
    )
    return response.data
  },

  // Google OAuth — returns the redirect URL for server-side flow
  getGoogleRedirectUrl: () => {
    const rootUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
    return `${rootUrl}/auth-workflow/google/redirect`
  },

  // Twitter/X OAuth
  getTwitterRedirectUrl: () => {
    const rootUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
    return `${rootUrl}/auth-workflow/twitter/redirect`
  },

  // Facebook OAuth
  getFacebookRedirectUrl: () => {
    const rootUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
    return `${rootUrl}/auth-workflow/facebook/redirect`
  },

  // Update profile
  updateProfile: async (data: UpdateProfileRequest) => {
    const response = await apiClient.put<UpdateProfileResponse>('/account', data)
    return response.data
  },

  // Update user by ID (P1: PUT /users/{id})
  updateUser: async (userId: number | string, data: Record<string, any>) => {
    const response = await apiClient.put(`/users/${userId}`, data)
    return response.data
  },

  // Change password (P1: PUT /users/{id}/password)
  changePassword: async (userId: number | string, data: {
    current_password: string
    password: string
    password_confirmation: string
  }) => {
    const response = await apiClient.put(`/users/${userId}/password`, data)
    return response.data
  },

  // Cancel subscription (P1: POST /account/cancel-subscription)
  cancelSubscription: async () => {
    const response = await apiClient.post('/account/cancel-subscription')
    return response.data
  },

  // Delete account
  deleteAccount: async (password: string) => {
    const response = await apiClient.delete('/account', { data: { password } })
    return response.data
  },
}
