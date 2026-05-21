import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

/**
 * Purpose: Executes PluginsPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function PluginsPage() {
  redirect('/plugins/available')
}
