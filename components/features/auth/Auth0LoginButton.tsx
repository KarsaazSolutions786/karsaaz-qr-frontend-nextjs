'use client'

import { useAuth0Enabled } from '@/lib/hooks/queries/useAppConfig'

/**
 * Auth0LoginButton — shows "Sign in with Auth0" when Auth0 is enabled in backend config.
 * Redirects to /auth0/login which the Laravel backend handles (server-side OIDC flow).
 * After Auth0 callback, backend redirects to /auth-callback?user=<b64>&token=<b64>.
 */
export function Auth0LoginButton() {
  const { enabled, isLoading: loading } = useAuth0Enabled()

  if (loading || !enabled) return null

  const apiBase =
    typeof window !== 'undefined'
      ? process.env.NEXT_PUBLIC_API_URL || 'https://app.karsaazqr.com'
      : ''

  return (
    <a
      href={`${apiBase}/auth0/login`}
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
    >
      <svg className="h-5 w-5" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M55.6 40.3L50.5 24.5 32 0 13.5 24.5 8.4 40.3l23.6-9.3 23.6 9.3z"
          fill="#EB5424"
        />
        <path
          d="M8.4 40.3l5.1 15.8L32 46.8l-23.6-6.5zM55.6 40.3l-5.1 15.8L32 46.8l23.6-6.5z"
          fill="#EB5424"
        />
        <path
          d="M13.5 56.1L32 64l18.5-7.9L32 46.8 13.5 56.1z"
          fill="#EB5424"
        />
      </svg>
      Sign in with Auth0
    </a>
  )
}
