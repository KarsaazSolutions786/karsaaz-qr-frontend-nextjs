'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import { useLogin } from '@/lib/hooks/mutations/useLogin'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const loginMutation = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data)
    } catch {
      // Error handled by mutation
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-3">
      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-[12px] font-bold text-white"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Email
        </label>
        <input
          {...register('email')}
          id="email"
          type="email"
          autoComplete="email"
          placeholder="Example@gmail.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className="block w-full rounded-[8px] border-[0.695px] border-[#ebecef] bg-white/90 px-4 text-[12px] font-normal text-gray-800 placeholder:text-[#404a60] focus:border-[#8351e0] focus:outline-none focus:ring-2 focus:ring-[#8351e0]/30 transition-all"
          style={{ height: 40, fontFamily: "'Inter', sans-serif" }}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="mt-1 text-xs text-red-200">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-[12px] font-bold text-white"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Password
        </label>
        <div className="relative">
          <input
            {...register('password')}
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="******************"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            className="block w-full rounded-[8px] border-[0.695px] border-[#ebecef] bg-white/90 pl-4 pr-10 text-[12px] font-normal text-gray-800 placeholder:text-[#404a60] focus:border-[#8351e0] focus:outline-none focus:ring-2 focus:ring-[#8351e0]/30 transition-all"
            style={{ height: 41, fontFamily: "'Inter', sans-serif" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#404a60] hover:text-gray-700 transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" role="alert" className="mt-1 text-xs text-red-200">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Forgot password link */}
      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-[12px] font-medium text-white hover:text-white/80 transition-colors"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Forget password?
        </Link>
      </div>

      {/* Error message */}
      {loginMutation.isError && (
        <div role="alert" className="rounded-lg bg-red-500/20 border border-red-400/30 p-3">
          <p className="text-xs text-red-100">
            {(loginMutation.error as any)?.response?.data?.message ||
              'Invalid email or password. Please try again.'}
          </p>
        </div>
      )}

      {/* Submit button — purple gradient pill */}
      <button
        type="submit"
        disabled={isSubmitting || loginMutation.isPending}
        className="w-full rounded-[41.843px] text-[16px] font-semibold text-white shadow-[0px_3px_10px_0px_rgba(0,0,0,0.16)] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all"
        style={{
          height: 40,
          backgroundImage: 'linear-gradient(to bottom, #bb9df3, #8351e0)',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {isSubmitting || loginMutation.isPending ? 'Signing in...' : 'Login'}
      </button>
    </form>
  )
}
