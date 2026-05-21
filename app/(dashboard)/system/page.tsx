import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

/**
 * Purpose: Executes SystemPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function SystemPage() {
  redirect('/system/settings')
}
