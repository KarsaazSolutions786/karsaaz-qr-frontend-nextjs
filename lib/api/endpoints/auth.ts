import apiClient from '@/lib/api/client'
import { User } from '@/types/entities/user'

// Auth API Endpoints — matching original Laravel backend

export interface LoginRequest {
  email: string
  password: string
  remember?: boolean
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

export interface PasswordlessInitRequest {
  email: string
  type?: 'email' | 'sms'
}

export interface PasswordlessInitResponse {
  message: string
}

export interface PasswordlessVerifyRequest {
  email: string
  token: string
}

export interface PasswordlessVerifyResponse {
  user: User
  token: string
}

export interface PasswordlessStatusResponse {
  enabled: boolean
  default_type?: 'email' | 'sms'
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

  // Get passwordless auth status
  passwordlessStatus: async () => {
    const response = await apiClient.get<PasswordlessStatusResponse>(
      '/passwordless-auth/status'
    )
    return response.data
  },

  // Passwordless auth — send login code
  passwordlessInit: async (data: PasswordlessInitRequest) => {
    const response = await apiClient.post<PasswordlessInitResponse>(
      '/passwordless-auth/init',
      data
    )
    return response.data
  },

  // Passwordless auth — verify code and get token
  passwordlessVerify: async (data: PasswordlessVerifyRequest) => {
    const response = await apiClient.post<PasswordlessVerifyResponse>(
      '/passwordless-auth/verify',
      data
    )
    return response.data
  },

  // Passwordless auth — resend code
  passwordlessResend: async (email: string) => {
    const response = await apiClient.post('/passwordless-auth/resend', { email })
    return response.data
  },

  // Google OAuth — returns the redirect URL for server-side flow
  getGoogleRedirectUrl: () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api'
    // Strip /api suffix if present — OAuth redirect is at root level
    const rootUrl = baseUrl.replace(/\/api\/?$/, '')
    return `${rootUrl}/auth-workflow/google/redirect`
  },

  // Update profile
  updateProfile: async (data: UpdateProfileRequest) => {
    const response = await apiClient.put<UpdateProfileResponse>('/account', data)
    return response.data
  },

  // Delete account
  deleteAccount: async (password: string) => {
    const response = await apiClient.delete('/account', { data: { password } })
    return response.data
  },
}
