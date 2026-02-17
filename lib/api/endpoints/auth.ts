import apiClient from '@/lib/api/client'
import { User } from '@/types/entities/user'

// Auth API Endpoints

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface RegisterResponse {
  user: User
  message: string
}

export interface VerifyOTPRequest {
  email: string
  otp: string
}

export interface VerifyOTPResponse {
  user: User
  message: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
}

export interface ResetPasswordResponse {
  message: string
}

export interface GoogleLoginRequest {
  token: string
}

export interface GoogleLoginResponse {
  user: User
}

export interface PasswordlessInitRequest {
  email: string
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
  // Login
  login: async (data: LoginRequest) => {
    const response = await apiClient.post<LoginResponse>('/login', data)
    return response.data
  },

  // Register
  register: async (data: RegisterRequest) => {
    const response = await apiClient.post<RegisterResponse>('/register', data)
    return response.data
  },

  // Logout (Sanctum - just delete token locally)
  logout: async () => {
    // Laravel Sanctum - token is in localStorage, just clear it
    // Optionally call backend to revoke token
    return { success: true }
  },

  // Get current user (account endpoint)
  getCurrentUser: async () => {
    const response = await apiClient.get<User>('/account')
    return response.data
  },

  // Verify OTP
  verifyOTP: async (data: VerifyOTPRequest) => {
    const response = await apiClient.post<VerifyOTPResponse>('/account/verify-otp-code', data)
    return response.data
  },

  // Resend OTP
  resendOTP: async (email: string) => {
    const response = await apiClient.post('/account/resend-otp-code', { email })
    return response.data
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordRequest) => {
    const response = await apiClient.post<ForgotPasswordResponse>('/forgot-password', data)
    return response.data
  },

  // Reset password
  resetPassword: async (data: ResetPasswordRequest) => {
    const response = await apiClient.post<ResetPasswordResponse>('/reset-password', data)
    return response.data
  },

  // Google OAuth
  googleLogin: async (data: GoogleLoginRequest) => {
    const response = await apiClient.post<GoogleLoginResponse>('/auth/google/token-login', data)
    return response.data
  },

  // Passwordless auth - initialize
  passwordlessInit: async (data: PasswordlessInitRequest) => {
    const response = await apiClient.post<PasswordlessInitResponse>(
      '/passwordless-auth/init',
      data
    )
    return response.data
  },

  // Passwordless auth - verify
  passwordlessVerify: async (data: PasswordlessVerifyRequest) => {
    const response = await apiClient.post<PasswordlessVerifyResponse>(
      '/passwordless-auth/verify',
      data
    )
    return response.data
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
