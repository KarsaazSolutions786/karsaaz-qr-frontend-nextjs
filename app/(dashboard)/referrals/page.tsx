'use client'

import { redirect } from 'next/navigation'

/**
 * Purpose: Redirect /referrals (plural) to /referral (singular) where the actual page lives
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export default function ReferralsRedirect() {
  redirect('/referral')
}
