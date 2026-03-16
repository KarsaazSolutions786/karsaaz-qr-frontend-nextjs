'use client'

import { redirect } from 'next/navigation'

/**
 * Redirect /account/api-keys to /account (API keys tab is on the account page)
 */
export default function ApiKeysRedirect() {
  redirect('/account')
}
