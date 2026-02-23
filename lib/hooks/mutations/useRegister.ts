import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api/endpoints/auth'
import { queryKeys } from '@/lib/query/keys'
import { useAuth } from '@/lib/hooks/useAuth'
import { getStoredReferralCode, clearStoredReferralCode } from '@/lib/utils/referral-tracking'
import type { RegisterFormData } from '@/lib/validations/auth'

export function useRegister() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setUser } = useAuth()

  return useMutation({
    mutationFn: (data: RegisterFormData) => {
      // T269: Include referral code if present
      const referralCode = getStoredReferralCode()
      return authAPI.register({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
        terms_consent: data.termsConsent,
        ...(referralCode ? { referral_code: referralCode } : {}),
      })
    },
    onSuccess: (response, variables) => {
      // Store token + user immediately (even before email verification)
      if (response.token && typeof window !== 'undefined') {
        localStorage.setItem('token', response.token)
      }
      if (response.user) {
        setUser(response.user)
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(response.user))
        }
        queryClient.setQueryData(queryKeys.auth.currentUser(), response.user)
      }

      // Clear stored referral code after successful registration
      clearStoredReferralCode()

      // Redirect to email verification page
      router.push(`/verify-email?email=${encodeURIComponent(variables.email)}`)
    },
  })
}
