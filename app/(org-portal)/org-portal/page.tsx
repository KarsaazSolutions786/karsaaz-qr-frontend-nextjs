'use client'

import { redirect } from 'next/navigation'

/**
 * Purpose: Bare /org-portal had no page at all -- every "Portal" link in the app
 * (`/organization`'s org card, `/for-organizations`'s plan page) pointed here and
 * 404'd. Forward to /org-portal/dashboard, whose own auth guard (PortalShell in
 * the org-portal layout) already redirects to /org-portal/login when there's no
 * active portal session -- so this single redirect correctly handles both the
 * logged-in and logged-out cases.
 * Owner/Author: Claude Code
 * Created/Updated: 2026-07-15
 */
export default function OrgPortalRootRedirect() {
  redirect('/org-portal/dashboard')
}
