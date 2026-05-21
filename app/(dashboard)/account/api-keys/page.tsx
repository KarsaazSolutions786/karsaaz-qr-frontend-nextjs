'use client'

import { redirect } from 'next/navigation'

/**
 * Purpose: Redirect /account/api-keys to /account (API keys tab is on the account page)
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export default function ApiKeysRedirect() {
  redirect('/account')
}
