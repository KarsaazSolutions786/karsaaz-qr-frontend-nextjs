'use client'

import { authAPI } from '@/lib/api/endpoints/auth'

export function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    const redirectUrl = authAPI.getGoogleRedirectUrl()
    window.location.href = redirectUrl
  }

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="relative flex items-center justify-center gap-2 bg-white text-[12.891px] text-black"
      style={{
        width: 193,
        height: 40,
        borderRadius: 20,
        boxShadow: '0px 4px 7px 0px rgba(0,0,0,0.13)',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Inner shadow overlay */}
      <span
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ boxShadow: 'inset 0px 0px 4px 0px rgba(0,0,0,0.29)' }}
      />
      <img src="/images/auth/google-icon.svg" alt="" style={{ width: 16, height: 16 }} />
      Google
    </button>
  )
}
