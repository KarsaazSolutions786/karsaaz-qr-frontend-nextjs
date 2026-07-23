import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api/endpoints/auth'
import { queryKeys } from '@/lib/query/keys'
import { useAuth } from '@/lib/hooks/useAuth'
import { getStoredReferralCode, clearStoredReferralCode } from '@/lib/utils/referral-tracking'
import type { RegisterFormData } from '@/lib/validations/auth'

/**
 * Purpose: Combined "create your account + your organization" flow -- a single
 * submit registers the user (same /register endpoint as the normal signup) and,
 * once that issues an auth token, redirects to /verify-email.
 * Owner/Author: Claude Code
 * Created/Updated: 2026-07-15
 */
export function useRegisterOrganization() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setUser } = useAuth()

  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const referralCode = getStoredReferralCode()
      const guestToken =
        typeof window !== 'undefined' ? localStorage.getItem('guest_session_token') : null

      const registerResponse = await authAPI.register({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
        terms_consent: data.termsConsent,
        ...(referralCode ? { referral_code: referralCode } : {}),
        ...(guestToken ? { guest_session_token: guestToken } : {}),
      })

      if (registerResponse.token && typeof window !== 'undefined') {
        localStorage.setItem('logged_in', 'true')
        localStorage.setItem('token', registerResponse.token)
        localStorage.removeItem('guest_session_token')
        localStorage.removeItem('guest_action_count')
      }

      return { registerResponse }
    },
    onSuccess: ({ registerResponse }, variables) => {
      if (registerResponse.user) {
        setUser(registerResponse.user)
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(registerResponse.user))
        }
        queryClient.setQueryData(queryKeys.auth.currentUser(), registerResponse.user)
      }
      clearStoredReferralCode()

      router.push(
        `/verify-email?email=${encodeURIComponent(variables.email)}&next=${encodeURIComponent('/organization/onboarding')}`
      )
    },
  })
}
