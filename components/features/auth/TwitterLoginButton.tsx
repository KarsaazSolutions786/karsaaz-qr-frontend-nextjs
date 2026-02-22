'use client'

import { authAPI } from '@/lib/api/endpoints/auth'

export function TwitterLoginButton() {
  const handleTwitterLogin = () => {
    const redirectUrl = authAPI.getTwitterRedirectUrl()
    window.location.href = redirectUrl
  }

  return (
    <button
      type="button"
      onClick={handleTwitterLogin}
      className="w-full flex items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
        <path
          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
          fill="currentColor"
        />
      </svg>
      Continue with X
    </button>
  )
}
