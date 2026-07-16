import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api/endpoints/auth'
import { organizationAPI } from '@/lib/api/endpoints/organization'
import { queryKeys } from '@/lib/query/keys'
import { useAuth } from '@/lib/hooks/useAuth'
import { getStoredReferralCode, clearStoredReferralCode } from '@/lib/utils/referral-tracking'
import type { OrgRegisterFormData } from '@/lib/validations/auth'

/**
 * Purpose: Combined "create your account + your organization" flow -- a single
 * submit registers the user (same /register endpoint as the normal signup) and,
 * once that issues an auth token, immediately creates the organization owned by
 * that new account. Mirrors useRegister() but chains the organization-create call
 * before redirecting, and lands on /organization instead of /qrcodes/new.
 * Owner/Author: Claude Code
 * Created/Updated: 2026-07-15
 */
export function useRegisterOrganization() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setUser } = useAuth()

  return useMutation({
    mutationFn: async (data: OrgRegisterFormData) => {
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

      // The org-create call requires auth:sanctum -- store the fresh token first
      // so apiClient's request interceptor picks it up for the next call.
      if (registerResponse.token && typeof window !== 'undefined') {
        localStorage.setItem('logged_in', 'true')
        localStorage.setItem('token', registerResponse.token)
        localStorage.removeItem('guest_session_token')
        localStorage.removeItem('guest_action_count')
      }

      const orgResponse = await organizationAPI.create({ name: data.organizationName })

      return { registerResponse, orgResponse: orgResponse.data }
    },
    onSuccess: ({ registerResponse, orgResponse }, variables) => {
      if (registerResponse.user) {
        setUser(registerResponse.user)
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(registerResponse.user))
        }
        queryClient.setQueryData(queryKeys.auth.currentUser(), registerResponse.user)
      }
      clearStoredReferralCode()

      // One-time portal credentials -- stashed for /organization to pick up and
      // show its existing "shown once" modal, since a full page navigation loses
      // React state.
      if (orgResponse.portal_credentials && typeof window !== 'undefined') {
        sessionStorage.setItem(
          'new_org_portal_credentials',
          JSON.stringify(orgResponse.portal_credentials)
        )
      }

      router.push(
        `/verify-email?email=${encodeURIComponent(variables.email)}&next=${encodeURIComponent('/organization')}`
      )
    },
  })
}
