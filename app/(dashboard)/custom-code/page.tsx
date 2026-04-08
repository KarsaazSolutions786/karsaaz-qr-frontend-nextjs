import { redirect } from 'next/navigation'

/**
 * /custom-code (singular) redirects to the canonical /custom-codes (plural) route.
 * The nav, sidebar, and ROUTES constants all use /custom-codes.
 */
export default function CustomCodeRedirect() {
  redirect('/custom-codes')
}
