import { z } from 'zod'

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>

// Register schema — matches original backend expectations
export const registerSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    termsConsent: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms and conditions' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type RegisterFormData = z.infer<typeof registerSchema>

// OTP verification schema — original backend uses 5-digit codes
export const otpVerificationSchema = z.object({
  code: z.string().regex(/^[0-9]{5}$/, 'OTP code must be 5 digits'),
})

export type OTPVerificationFormData = z.infer<typeof otpVerificationSchema>

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

// Reset password schema — backend requires email + password_confirmation
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

// Update profile schema
export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters').optional(),
  email: z.string().email('Invalid email address'),
  avatar: z.string().url('Avatar must be a valid URL').optional(),
})

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>

// Passwordless auth schema
export const passwordlessInitSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export type PasswordlessInitFormData = z.infer<typeof passwordlessInitSchema>

export const passwordlessVerifySchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().regex(/^[0-9]{5}$/, 'Code must be 5 digits'),
})

export type PasswordlessVerifyFormData = z.infer<typeof passwordlessVerifySchema>
