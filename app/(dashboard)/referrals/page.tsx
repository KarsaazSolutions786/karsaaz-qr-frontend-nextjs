'use client'

import { redirect } from 'next/navigation'

/**
 * Redirect /referrals (plural) to /referral (singular) where the actual page lives
 */
export default function ReferralsRedirect() {
  redirect('/referral')
}
