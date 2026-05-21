import { redirect } from 'next/navigation'

/**
 * Purpose: /custom-code (singular) redirects to the canonical /custom-codes (plural) route. The nav, sidebar, and ROUTES constants all use /custom-codes.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: April 2026
 */

export default function CustomCodeRedirect() {
  redirect('/custom-codes')
}
