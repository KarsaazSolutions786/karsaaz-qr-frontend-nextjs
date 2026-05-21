'use client'

import { redirect } from 'next/navigation'

/**
 * Purpose: Redirect /account/sub-users to /account (sub-users tab is on the account page)
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export default function SubUsersRedirect() {
  redirect('/account')
}
