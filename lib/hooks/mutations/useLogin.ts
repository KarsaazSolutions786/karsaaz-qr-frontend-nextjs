'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api/endpoints/auth'
import { queryKeys } from '@/lib/query/keys'
import { useAuth } from '@/lib/hooks/useAuth'
import { LoginFormData } from '@/lib/validations/auth'

/** Determine where to send the user after login */
function getPostLoginRedirect(user: { roles?: Array<{ home_page?: string }> }): string {
  // Check for ?from= query parameter first
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const from = params.get('from')
    if (from) return from
  }
  // Use the home_page from user's first role (matches original frontend)
  const homePage = user.roles?.[0]?.home_page
  if (homePage) return homePage
  // Default fallback
  return '/qrcodes/new'
}

export function useLogin() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setUser } = useAuth()

  return useMutation({
    mutationFn: (data: LoginFormData) => {
      // Only send fields the backend expects (email + password)
      return authAPI.login({
        email: data.email,
        password: data.password,
      })
    },
    onSuccess: (response) => {
      // Store user in AuthContext and localStorage
      setUser(response.user)
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.user))
        localStorage.setItem('token', response.token)
      }

      queryClient.setQueryData(queryKeys.auth.currentUser(), response.user)

      // Check if email is verified — if not, redirect to verification
      if (response.user.email_verified_at === null) {
        router.push(`/verify-email?email=${encodeURIComponent(response.user.email)}`)
        return
      }

      router.push(getPostLoginRedirect(response.user))
    },
  })
}
