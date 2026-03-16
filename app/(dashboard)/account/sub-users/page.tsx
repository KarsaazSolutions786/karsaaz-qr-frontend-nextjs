'use client'

import { redirect } from 'next/navigation'

/**
 * Redirect /account/sub-users to /account (sub-users tab is on the account page)
 */
export default function SubUsersRedirect() {
  redirect('/account')
}
