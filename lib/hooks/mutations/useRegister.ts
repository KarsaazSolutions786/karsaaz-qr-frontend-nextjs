import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api/endpoints/auth'
import { queryKeys } from '@/lib/query/keys'
import { useAuth } from '@/lib/hooks/useAuth'
import { getStoredReferralCode, clearStoredReferralCode } from '@/lib/utils/referral-tracking'
import type { RegisterFormData } from '@/lib/validations/auth'
import { toast } from 'sonner'

/**
 * Purpose: Executes useRegister functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useRegister() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setUser } = useAuth()

  return useMutation({
    mutationFn: (data: RegisterFormData) => {
      // T269: Include referral code if present
      const referralCode = getStoredReferralCode()
      // Include guest session token for guest→user data migration
      const guestToken =
        typeof window !== 'undefined' ? localStorage.getItem('guest_session_token') : null
      return authAPI.register({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
        terms_consent: data.termsConsent,
        ...(referralCode ? { referral_code: referralCode } : {}),
        ...(guestToken ? { guest_session_token: guestToken } : {}),
      })
    },
    onSuccess: (response, variables) => {
      // Store session flag + user immediately (even before email verification).
      // Token is stored in httpOnly cookie by backend.
      if (response.token && typeof window !== 'undefined') {
        localStorage.setItem('logged_in', 'true')
        localStorage.setItem('token', response.token)
        localStorage.removeItem('guest_session_token') // Clear guest session after signup
        localStorage.removeItem('guest_action_count')
      }
      if (response.guest_migration?.migrated_qrcodes) {
        toast.success(
          `${response.guest_migration.migrated_qrcodes} QR code(s) migrated to your account!`
        )
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
