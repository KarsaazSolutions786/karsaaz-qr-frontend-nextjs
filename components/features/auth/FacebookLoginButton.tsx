'use client'

import { authAPI } from '@/lib/api/endpoints/auth'
import { useTranslation } from '@/lib/i18n'

/**
 * Purpose: Executes FacebookLoginButton functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function FacebookLoginButton() {
  const { t } = useTranslation()
  /**
   * Purpose: Executes handleFacebookLogin functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleFacebookLogin = () => {
    const redirectUrl = authAPI.getFacebookRedirectUrl()
    window.location.href = redirectUrl
  }

  return (
    <button
      type="button"
      onClick={handleFacebookLogin}
      className="relative flex items-center justify-center gap-2 bg-white text-[12px] text-black"
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
      <img src="/images/auth/facebook-icon.svg" alt="" style={{ width: 24, height: 24 }} />
      {t('Facebook')}
    </button>
  )
}
